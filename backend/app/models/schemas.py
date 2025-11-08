from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PredictionRequest(BaseModel):
    pressure: float = Field(..., ge=0, le=150, description="Pressure in PSI")
    flow: float = Field(..., ge=0, le=500, description="Flow rate in L/min")
    temperature: float = Field(..., ge=-20, le=100, description="Temperature in Celsius")
    location_id: Optional[str] = None
    timestamp: Optional[datetime] = None

class PredictionResponse(BaseModel):
    leak_probability: float
    prediction: int  # 0 or 1
    confidence: float
    timestamp: datetime
    threshold_exceeded: bool

class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: list
    last_updated: datetime
