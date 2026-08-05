import os
import shutil
import cv2
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException
from config import UPLOAD_DIR, ALLOWED_EXTENSIONS
from services.session_store import session_store
from services.pipeline_manager import pipeline_manager

router = APIRouter(prefix="/api", tags=["Upload"])

@router.post("/upload")
async def upload_diagram(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file extension {ext}. Allowed: {ALLOWED_EXTENSIONS}")

    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    session_id = session_store.create_session(save_path, file.filename)

    # Immediately run pipeline to populate session state
    pipeline_data = pipeline_manager.run_full_pipeline(save_path)
    session_store.update_session(session_id, {"pipeline": pipeline_data})

    return {
        "status": "success",
        "session_id": session_id,
        "filename": file.filename,
        "summary": pipeline_data["summary"],
        "pipeline": pipeline_data
    }

@router.post("/preset/{preset_id}")
async def load_preset_diagram(preset_id: str):
    # Generate synthetic diagram preset image for demonstration
    filename = f"preset_{preset_id}.png"
    save_path = os.path.join(UPLOAD_DIR, filename)

    img = np.ones((600, 800, 3), dtype=np.uint8) * 255
    
    # Draw sample flowchart shapes
    cv2.ellipse(img, (400, 60), (90, 30), 0, 0, 360, (79, 70, 229), 2)
    cv2.putText(img, "START", (370, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (15, 23, 42), 2)

    cv2.rectangle(img, (300, 140), (500, 200), (99, 102, 241), 2)
    cv2.putText(img, "READ Input X", (340, 175), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (15, 23, 42), 2)

    # Decision diamond
    pts = np.array([[400, 260], [520, 320], [400, 380], [280, 320]], np.int32)
    cv2.polylines(img, [pts], True, (217, 70, 239), 2)
    cv2.putText(img, "Is X > 10 ?", (350, 325), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (15, 23, 42), 2)

    # Process block (YES branch)
    cv2.rectangle(img, (140, 440), (340, 500), (16, 185, 129), 2)
    cv2.putText(img, "Output = X * 2", (170, 475), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (15, 23, 42), 2)

    # Connectors / Arrows
    cv2.arrowedLine(img, (400, 90), (400, 140), (59, 130, 246), 2)
    cv2.arrowedLine(img, (400, 200), (400, 260), (59, 130, 246), 2)
    cv2.arrowedLine(img, (340, 350), (240, 440), (59, 130, 246), 2)
    cv2.putText(img, "YES", (270, 390), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (225, 29, 72), 2)

    cv2.imwrite(save_path, img)

    session_id = session_store.create_session(save_path, filename)
    pipeline_data = pipeline_manager.run_full_pipeline(save_path)
    session_store.update_session(session_id, {"pipeline": pipeline_data})

    return {
        "status": "success",
        "session_id": session_id,
        "filename": filename,
        "summary": pipeline_data["summary"],
        "pipeline": pipeline_data
    }
