from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.documents import router as documents_router
from app.api.face import router as face_router
from app.api.identity import router as identity_router
from app.api.risk import router as risk_router
from app.api.screenings import router as screenings_router
from app.api.audit import router as audit_router
from app.api import auth
from app.api.integrity import router as integrity_router
from app.api.monitoring import router as monitoring_router
from app.websocket.screening import router as screening_websocket_router


app = FastAPI(
    title="BorderGuard AI Backend",
    description="AI-assisted border document and identity screening backend",
    version="0.1.0",
)


# ==========================================================
# CORS
# ==========================================================
#
# Allows the React/Vite frontend to communicate with
# the FastAPI backend during local development.
#
# Frontend:
#   http://localhost:5173
#   http://127.0.0.1:5173
#
# Backend:
#   http://127.0.0.1:8000
#
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# API ROUTERS
# ==========================================================

app.include_router(documents_router)
app.include_router(face_router)
app.include_router(identity_router)
app.include_router(risk_router)
app.include_router(screenings_router)
app.include_router(audit_router)
app.include_router(auth.router)
app.include_router(integrity_router)
app.include_router(
    monitoring_router
)
app.include_router(
    screening_websocket_router
)


# ==========================================================
# ROOT
# ==========================================================

@app.get("/")
def root():
    return {
        "message": "BorderGuard AI backend is running",
        "status": "ok",
    }


# ==========================================================
# HEALTH
# ==========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
    }