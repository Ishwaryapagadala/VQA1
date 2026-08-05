from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.session_store import session_store

router = APIRouter(prefix="/api", tags=["Analysis"])

class SessionRequest(BaseModel):
    session_id: str

@router.post("/analyze")
async def analyze_diagram(req: SessionRequest):
    sess = session_store.get_session(req.session_id)
    if not sess:
        raise HTTPException(status_code=444, detail="Session not found.")
    pipeline = sess.get("pipeline", {})
    return {
        "status": "success",
        "session_id": req.session_id,
        "summary": pipeline.get("summary"),
        "preprocessing": pipeline.get("preprocessing"),
        "detected_objects": pipeline.get("detected_objects"),
        "ocr": pipeline.get("ocr"),
        "graph": pipeline.get("graph")
    }

@router.post("/validate")
async def validate_diagram(req: SessionRequest):
    sess = session_store.get_session(req.session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found.")
    pipeline = sess.get("pipeline", {})
    return {
        "status": "success",
        "session_id": req.session_id,
        "validation": pipeline.get("validation")
    }

@router.post("/reason")
async def reason_anomalies(req: SessionRequest):
    sess = session_store.get_session(req.session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found.")
    pipeline = sess.get("pipeline", {})
    return {
        "status": "success",
        "session_id": req.session_id,
        "anomalies": pipeline.get("anomalies")
    }
