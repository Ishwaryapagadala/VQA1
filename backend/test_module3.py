import os
import cv2
import numpy as np
from services.pipeline_manager import pipeline_manager
from utils.report_generator import PDFReportGenerator

def test_module3():
    print("=== TESTING MODULE 3: FULL END-TO-END AI DIAGRAM VQA & HEALING SYSTEM ===")

    # 1. Create a complex technical diagram image with structural anomalies
    img_path = "test_complex_diagram.png"
    img = np.ones((800, 1000, 3), dtype=np.uint8) * 255

    # Process block (No start node!)
    cv2.rectangle(img, (400, 100), (600, 160), (99, 102, 241), 2)
    cv2.putText(img, "Initialize System", (420, 135), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (15, 23, 42), 2)

    # Decision block (Only 1 branch!)
    pts_dec = np.array([[500, 240], [640, 310], [500, 380], [360, 310]], np.int32)
    cv2.polylines(img, [pts_dec], True, (217, 70, 239), 2)
    cv2.putText(img, "Check Voltage > 5V", (410, 315), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (15, 23, 42), 2)

    # Dead end process
    cv2.rectangle(img, (200, 460), (420, 520), (239, 68, 68), 2)
    cv2.putText(img, "Halt Execution", (240, 495), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (15, 23, 42), 2)

    # Arrows
    cv2.arrowedLine(img, (500, 160), (500, 240), (59, 130, 246), 2)
    cv2.arrowedLine(img, (430, 350), (310, 460), (59, 130, 246), 2)
    cv2.putText(img, "YES", (350, 400), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (225, 29, 72), 2)

    cv2.imwrite(img_path, img)

    # 2. Run Full AI Pipeline
    results = pipeline_manager.run_full_pipeline(img_path)
    print("\n[1] Pipeline Summary:")
    print("    - Diagram Type:", results["summary"]["diagram_type"])
    print("    - Processing Time:", results["summary"]["processing_time"], "s")

    # 3. Validation & Anomaly Reasoning Check
    print("\n[2] Anomaly Reasoning Diagnostic Output:")
    for anom in results["anomalies"]:
        print(f"    - [{anom['id']}] {anom['title']} ({anom['severity']}): {anom['reason']}")
        print(f"      Repair: {anom['suggested_repair']}")

    # 4. Self-Healing Verification
    healing = results["healing"]
    print(f"\n[3] Self-Healing Applied {healing['total_repairs']} Repair Actions:")
    for log in healing["repair_logs"]:
        print(f"    - Action: {log['action']} -> {log['details']}")
    assert len(healing["repaired_image"]) > 100

    # 5. Visual Question Answering (VQA) Engine Test
    questions = [
        "How many decision nodes are present?",
        "Is there any missing connection?",
        "What happens if Check Voltage > 5V?"
    ]
    print("\n[4] Visual Question Answering (VQA) Results:")
    vqa_history = []
    for q in questions:
        vqa_ans = pipeline_manager.vqa_engine.answer_question(
            q, results["graph"], results["ocr"], results["validation"], results["anomalies"]
        )
        vqa_history.append(vqa_ans)
        print(f"    Q: '{q}'")
        print(f"    A: '{vqa_ans['answer']}' (Conf: {vqa_ans['confidence']*100:.0f}%)")

    # 6. PDF Audit Report Generation
    session_data = {
        "summary": results["summary"],
        "ocr": results["ocr"],
        "graph": results["graph"],
        "validation": results["validation"],
        "anomalies": results["anomalies"],
        "vqa_history": vqa_history
    }
    generator = PDFReportGenerator()
    pdf_path = "final_technical_diagram_report.pdf"
    generator.generate_pdf(session_data, pdf_path)
    print("\n[5] Generated ReportLab PDF Audit Report at:", pdf_path)
    assert os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000

    # Cleanup
    if os.path.exists(img_path):
        os.remove(img_path)
    if os.path.exists(pdf_path):
        os.remove(pdf_path)

    print("\n========================================================")
    print("MODULE 3 END-TO-END AI PIPELINE PASSED 100% SUCCESS!")
    print("========================================================")

if __name__ == "__main__":
    test_module3()
