import time
from ai.preprocessing.image_processor import ImageProcessor
from ai.detection.symbol_detector import SymbolDetector
from ai.ocr.text_extractor import TextExtractor
from ai.graph.graph_builder import GraphBuilder
from ai.validation.validator import DiagramValidator
from ai.reasoning.anomaly_reasoner import AnomalyReasoner
from ai.healing.diagram_healer import DiagramHealer
from ai.vqa.vqa_engine import VQAEngine

class PipelineManager:
    def __init__(self):
        self.preprocessor = ImageProcessor()
        self.detector = SymbolDetector()
        self.ocr_engine = TextExtractor()
        self.graph_builder = GraphBuilder()
        self.validator = DiagramValidator()
        self.reasoner = AnomalyReasoner()
        self.healer = DiagramHealer()
        self.vqa_engine = VQAEngine()

    def run_full_pipeline(self, image_path: str) -> dict:
        start_time = time.time()

        # Step 2: Image Preprocessing
        prep_results = self.preprocessor.process(image_path)

        # Step 3: Object Detection
        detected_objects = self.detector.detect(image_path)

        # Step 4: OCR Text Extraction
        ocr_results = self.ocr_engine.extract(image_path, detected_objects)

        # Step 5: Graph Construction
        graph_data, G = self.graph_builder.build_graph(detected_objects, ocr_results)

        # Step 6 & 7: Structural & Semantic Validation
        val_results = self.validator.validate(graph_data, detected_objects)

        # Step 8: Anomaly Reasoning
        anomalies = self.reasoner.reason(val_results, graph_data)

        # Step 9: Self Healing
        healing_results = self.healer.heal(image_path, graph_data, anomalies)

        elapsed = round(time.time() - start_time, 2)

        return {
            "summary": {
                "diagram_type": "Flowchart",
                "total_symbols": len([o for o in detected_objects if o["label"] != "Arrow"]),
                "total_arrows": len([o for o in detected_objects if o["label"] == "Arrow"]),
                "total_text_segments": len(ocr_results),
                "processing_time": elapsed,
                "confidence_score": 0.94
            },
            "preprocessing": prep_results,
            "detected_objects": detected_objects,
            "ocr": ocr_results,
            "graph": graph_data,
            "validation": val_results,
            "anomalies": anomalies,
            "healing": healing_results
        }

pipeline_manager = PipelineManager()
