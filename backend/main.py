import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import UPLOAD_DIR
from routes.upload_routes import router as upload_router
from routes.analysis_routes import router as analysis_router
from routes.healing_routes import router as healing_router
from routes.vqa_routes import router as vqa_router
from routes.report_routes import router as report_router

app = FastAPI(
    title="Error-Aware Visual Question Answering for Technical Diagrams API",
    description="Backend API platform providing anomaly detection, graph construction, self-healing, VQA, and report generation.",
    version="1.0.0"
)

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(upload_router)
app.include_router(analysis_router)
app.include_router(healing_router)
app.include_router(vqa_router)
app.include_router(report_router)

@app.get("/")
async def root():
    return {
        "title": "Error-Aware Visual Question Answering for Technical Diagrams AI API",
        "status": "online",
        "version": "1.0.0",
        "endpoints": [
            "POST /api/upload",
            "POST /api/preset/{preset_id}",
            "POST /api/analyze",
            "POST /api/validate",
            "POST /api/reason",
            "POST /api/heal",
            "POST /api/vqa",
            "GET /api/report/{session_id}"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
