from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.session_store import session_store

router = APIRouter(prefix="/api", tags=["Healing"])

class SessionRequest(BaseModel):
    session_id: str

@router.post("/heal")
async def heal_diagram(req: SessionRequest):
    sess = session_store.get_session(req.session_id)
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found.")
    pipeline = sess.get("pipeline", {})
    return {
        "status": "success",
        "session_id": req.session_id,
        "healing": pipeline.get("healing")
    }
