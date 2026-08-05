from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.session_store import session_store
from services.pipeline_manager import pipeline_manager

router = APIRouter(prefix="/api", tags=["VQA"])

class VQARequest(BaseModel):
    session_id: str
    question: str

@router.post("/vqa")
async def answer_visual_question(req: VQARequest):
    sess = session_store.get_session(req.session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found.")
    
    pipeline = sess.get("pipeline", {})
    graph_data = pipeline.get("graph", {})
    ocr_results = pipeline.get("ocr", [])
    validation_results = pipeline.get("validation", {})
    anomalies = pipeline.get("anomalies", [])

    answer_data = pipeline_manager.vqa_engine.answer_question(
        req.question, graph_data, ocr_results, validation_results, anomalies
    )

    # Log in session history
    vqa_history = sess.get("vqa_history", [])
    vqa_history.append(answer_data)
    session_store.update_session(req.session_id, {"vqa_history": vqa_history})

    return {
        "status": "success",
        "session_id": req.session_id,
        "vqa": answer_data,
        "history": vqa_history
    }
