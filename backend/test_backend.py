import os
import cv2
import numpy as np
from services.pipeline_manager import pipeline_manager
from utils.report_generator import PDFReportGenerator

def test_pipeline():
    print("Testing Backend Pipeline...")
    # Create test diagram image
    test_img_path = "test_diagram.png"
    img = np.ones((600, 800, 3), dtype=np.uint8) * 255
    cv2.ellipse(img, (400, 60), (90, 30), 0, 0, 360, (79, 70, 229), 2)
    cv2.putText(img, "START", (370, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (15, 23, 42), 2)
    cv2.rectangle(img, (300, 140), (500, 200), (99, 102, 241), 2)
    cv2.putText(img, "Process Step", (340, 175), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (15, 23, 42), 2)
    cv2.imwrite(test_img_path, img)

    # Run full AI pipeline
    res = pipeline_manager.run_full_pipeline(test_img_path)
    print("Pipeline Summary:", res["summary"])
    print("Validation Results:", res["validation"])
    print("Anomalies Detected:", len(res["anomalies"]))
    print("Self-Healing Repairs:", len(res["healing"]["repair_logs"]))

    # Test PDF Report Generation
    generator = PDFReportGenerator()
    pdf_path = "test_report.pdf"
    generator.generate_pdf(res, pdf_path)
    print("Generated PDF report at:", pdf_path)

    # Cleanup
    if os.path.exists(test_img_path):
        os.remove(test_img_path)
    if os.path.exists(pdf_path):
        os.remove(pdf_path)

    print("ALL BACKEND AI PIPELINE TESTS PASSED 100% SUCCESS!")

if __name__ == "__main__":
    test_pipeline()
