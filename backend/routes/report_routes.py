import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from config import REPORTS_DIR
from services.session_store import session_store
from utils.report_generator import PDFReportGenerator

router = APIRouter(prefix="/api", tags=["Report"])
generator = PDFReportGenerator()

@router.get("/report/{session_id}")
async def get_report(session_id: str):
    sess = session_store.get_session(session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found.")
    
    pipeline = sess.get("pipeline", {})
    session_data = {
        "summary": pipeline.get("summary", {}),
        "ocr": pipeline.get("ocr", []),
        "graph": pipeline.get("graph", {}),
        "validation": pipeline.get("validation", {}),
        "anomalies": pipeline.get("anomalies", []),
        "vqa_history": sess.get("vqa_history", [])
    }

    pdf_filename = f"report_{session_id[:8]}.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)

    generator.generate_pdf(session_data, pdf_path)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"Diagram_Anomaly_Report_{session_id[:8]}.pdf"
    )
