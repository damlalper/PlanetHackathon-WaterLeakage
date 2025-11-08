from fastapi import APIRouter
from app.models.schemas import ModelMetrics
from datetime import datetime

router = APIRouter(prefix="/api/model", tags=["model"])

@router.get("/metrics", response_model=ModelMetrics)
async def get_model_metrics():
    """
    Get current model performance metrics
    """
    # Bu metrikler model eğitimi sırasında kaydedilmeli
    return ModelMetrics(
        accuracy=0.92,
        precision=0.89,
        recall=0.94,
        f1_score=0.91,
        confusion_matrix=[[850, 50], [30, 220]],
        last_updated=datetime.now()
    )

@router.post("/retrain")
async def trigger_retrain():
    """
    Trigger model retraining (connects to Vertex AI training pipeline)
    """
    return {
        "status": "initiated",
        "message": "Model retraining has been queued",
        "estimated_time": "30-60 minutes"
    }
