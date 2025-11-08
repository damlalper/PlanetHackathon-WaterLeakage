from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "service": "water-leak-detection-api"
    }

@router.get("/")
async def root():
    return {
        "message": "Water Leak Detection API",
        "version": "1.0.0",
        "docs": "/docs"
    }
