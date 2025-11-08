from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict, model, health
from app.config import settings

app = FastAPI(
    title="Water Leak Detection API",
    description="ML-powered water leak detection system",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(model.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
