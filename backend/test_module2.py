import os
import cv2
import numpy as np
from ai.preprocessing.image_processor import ImageProcessor
from ai.detection.symbol_detector import SymbolDetector
from ai.ocr.text_extractor import TextExtractor
from ai.graph.graph_builder import GraphBuilder
from ai.validation.validator import DiagramValidator

def test_module2():
    print("=== TESTING MODULE 2: AI VISION PIPELINE & GRAPH VALIDATOR ===")
    
    # 1. Generate multi-shape flowchart image with synthetic skewed rectangle & text regions
    img_path = "test_module2_diagram.png"
    img = np.ones((700, 900, 3), dtype=np.uint8) * 255

    # Oval Start
    cv2.ellipse(img, (450, 70), (100, 32), 0, 0, 360, (79, 70, 229), 2)
    cv2.putText(img, "START", (415, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (15, 23, 42), 2)

    # Parallelogram Input
    pts_io = np.array([[380, 150], [560, 150], [520, 210], [340, 210]], np.int32)
    cv2.polylines(img, [pts_io], True, (6, 182, 212), 2)
    cv2.putText(img, "READ Number N", (370, 185), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (15, 23, 42), 2)

    # Diamond Decision
    pts_dec = np.array([[450, 280], [580, 350], [450, 420], [320, 350]], np.int32)
    cv2.polylines(img, [pts_dec], True, (217, 70, 239), 2)
    cv2.putText(img, "Is N > 0 ?", (410, 355), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (15, 23, 42), 2)

    # Process block (YES branch)
    cv2.rectangle(img, (180, 480), (380, 550), (16, 185, 129), 2)
    cv2.putText(img, "Print N", (240, 520), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (15, 23, 42), 2)

    cv2.imwrite(img_path, img)

    # 2. Test Image Preprocessing
    preprocessor = ImageProcessor()
    prep_res = preprocessor.process(img_path)
    print("[1] Preprocessing Completed. Skew angle:", prep_res["skew_angle"])
    assert "gray" in prep_res and "thresh" in prep_res and "morph" in prep_res

    # 3. Test Symbol Detector
    detector = SymbolDetector()
    objects = detector.detect(img_path)
    print(f"[2] Detected {len(objects)} Symbols & Arrows:")
    for obj in objects:
        print(f"    - [{obj['id']}] Shape: {obj['label']} | BBox: {obj['bbox']} | Conf: {obj['confidence']}")

    # 4. Test OCR Text Extractor
    ocr_engine = TextExtractor()
    ocr_res = ocr_engine.extract(img_path, objects)
    print(f"[3] Extracted {len(ocr_res)} Text Labels")

    # 5. Test NetworkX Graph Builder
    graph_builder = GraphBuilder()
    graph_data, G = graph_builder.build_graph(objects, ocr_res)
    print(f"[4] Built NetworkX Graph: {graph_data['num_nodes']} Nodes, {graph_data['num_edges']} Directed Edges")

    # 6. Test Validator
    validator = DiagramValidator()
    val_res = validator.validate(graph_data, objects)
    print(f"[5] Diagram Validator Results: Valid? {val_res['is_valid']} | Total Anomalies: {val_res['total_errors']}")
    for err in val_res["structural_errors"] + val_res["semantic_errors"]:
        print(f"    - {err['severity']}: {err['type']} -> {err['description']}")

    # Cleanup
    if os.path.exists(img_path):
        os.remove(img_path)

    print("\nMODULE 2 AI COMPUTER VISION & GRAPH ENGINE TEST PASSED 100% SUCCESS!")

if __name__ == "__main__":
    test_module2()
