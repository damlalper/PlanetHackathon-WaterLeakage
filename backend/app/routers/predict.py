from fastapi import APIRouter, HTTPException
from app.models.schemas import PredictionRequest, PredictionResponse
from app.models.vertex_client import vertex_client
from datetime import datetime

router = APIRouter(prefix="/api", tags=["prediction"])

@router.post("/predict", response_model=PredictionResponse)
async def predict_leak(request: PredictionRequest):
    """
    Predict water leak probability
    """
    try:
        # Prepare instance for Vertex AI
        instance = [
            request.pressure,
            request.flow,
            request.temperature,
            datetime.now().hour if not request.timestamp else request.timestamp.hour
        ]

        # Get prediction from Vertex AI
        result = await vertex_client.predict([instance])
        prediction = result['predictions'][0]

        leak_probability = prediction.get('leak_probability', prediction[1] if isinstance(prediction, list) else 0.5)

        return PredictionResponse(
            leak_probability=leak_probability,
            prediction=1 if leak_probability > 0.7 else 0,
            confidence=max(leak_probability, 1 - leak_probability),
            timestamp=datetime.now(),
            threshold_exceeded=leak_probability > 0.7
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/batch")
async def predict_batch(requests: list[PredictionRequest]):
    """
    Batch prediction for multiple sensors
    """
    instances = [
        [r.pressure, r.flow, r.temperature, datetime.now().hour]
        for r in requests
    ]

    result = await vertex_client.predict(instances)

    return {
        'predictions': result['predictions'],
        'count': len(instances)
    }
