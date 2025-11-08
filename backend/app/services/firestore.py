from google.cloud import firestore
from datetime import datetime
import os

class FirestoreService:
    def __init__(self):
        # Service account key path
        key_path = os.path.join(os.path.dirname(__file__), '..', '..', 'firebase-key.json')
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = key_path
        self.database_id = 'water-leak-db'
        self.db = firestore.Client(database=self.database_id)
        self.sensors_collection = 'sensors'

    async def save_sensor_data(self, sensor_id: str, data: dict):
        """Save sensor reading to Firestore"""
        doc_ref = self.db.collection(self.sensors_collection).document(sensor_id)
        data['timestamp'] = datetime.now()
        doc_ref.set(data, merge=True)
        return doc_ref.id

    async def save_prediction(self, sensor_id: str, prediction: dict):
        """Save prediction result"""
        doc_ref = self.db.collection('predictions').document()
        prediction['sensor_id'] = sensor_id
        prediction['timestamp'] = datetime.now()
        doc_ref.set(prediction)
        return doc_ref.id

    async def get_recent_sensors(self, limit: int = 100):
        """Get recent sensor readings"""
        docs = self.db.collection(self.sensors_collection)\
            .order_by('timestamp', direction=firestore.Query.DESCENDING)\
            .limit(limit)\
            .stream()

        return [doc.to_dict() for doc in docs]

firestore_service = FirestoreService()
