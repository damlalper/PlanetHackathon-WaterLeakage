from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_ID: str = "local-dev"
    LOCATION: str = "us-central1"
    ENDPOINT_ID: str = "local-endpoint"
    FIRESTORE_COLLECTION: str = "sensors"
    CORS_ORIGINS: list = ["http://localhost:3000"]

    class Config:
        env_file = ".env"

settings = Settings()
