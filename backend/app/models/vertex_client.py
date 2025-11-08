from google.cloud import aiplatform
from app.config import settings
import numpy as np

class VertexAIClient:
    def __init__(self):
        aiplatform.init(
            project=settings.PROJECT_ID,
            location=settings.LOCATION
        )
        self.endpoint = aiplatform.Endpoint(settings.ENDPOINT_ID)

    async def predict(self, instances: list) -> dict:
        try:
            prediction = self.endpoint.predict(instances=instances)
            return {
                'predictions': prediction.predictions,
                'deployed_model_id': prediction.deployed_model_id
            }
        except Exception as e:
            raise Exception(f"Vertex AI prediction failed: {str(e)}")

_vc = None

def get_vertex_client():
    global _vc
    if _vc is None:
        try:
            _vc = VertexAIClient()
        except Exception:
            class _Dummy:
                async def predict(self, instances: list) -> dict:
                    return {'predictions': [[0, 0.5] for _ in instances], 'deployed_model_id': 'local-dummy'}
            _vc = _Dummy()
    return _vc
