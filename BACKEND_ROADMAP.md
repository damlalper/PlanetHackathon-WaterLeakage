# Backend Roadmap - Water Leak Detection System

## 📋 Genel Bakış

Frontend MVP tamamlandı. Bu dokümanda backend geliştirme, model deployment ve sistem entegrasyonu adımları yer almaktadır.

---

## 🎯 Phase 1: Model Deployment (Vertex AI)

### 1.1 Model Hazırlığı

- [ ] **Eğitilmiş modeli kontrol et**
  - Model dosyası lokasyonu: Projedeki model klasörünü kontrol et
  - Model format: XGBoost model (`.pkl`, `.json` veya `.bst`)
  - Model performans metrikleri: Accuracy, Precision, Recall kaydet

  ```bash
  # Model dosyasını bul
  find . -name "*.pkl" -o -name "*.joblib" -o -name "*.bst"
  ```

- [ ] **Model test scripti oluştur**
  ```python
  # test_model_local.py
  import joblib
  import numpy as np

  # Model yükle
  model = joblib.load('path/to/model.pkl')

  # Test verisi
  test_data = {
      'pressure': 65.5,
      'flow': 120.3,
      'temperature': 22.5,
      'time_of_day': 14,
      'location_id': 1
  }

  # Prediction
  prediction = model.predict([list(test_data.values())])
  probability = model.predict_proba([list(test_data.values())])

  print(f"Prediction: {prediction}")
  print(f"Leak Probability: {probability[0][1]:.2f}")
  ```

### 1.2 Vertex AI Setup

- [ ] **Google Cloud Project oluştur/seç**
  ```bash
  gcloud projects list
  gcloud config set project YOUR_PROJECT_ID
  ```

- [ ] **Vertex AI API'yi etkinleştir**
  ```bash
  gcloud services enable aiplatform.googleapis.com
  gcloud services enable storage.googleapis.com
  ```

- [ ] **Service Account oluştur**
  ```bash
  gcloud iam service-accounts create vertex-ai-service \
      --display-name="Vertex AI Service Account"

  gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
      --member="serviceAccount:vertex-ai-service@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
      --role="roles/aiplatform.user"

  gcloud iam service-accounts keys create vertex-ai-key.json \
      --iam-account=vertex-ai-service@YOUR_PROJECT_ID.iam.gserviceaccount.com
  ```

### 1.3 Model Upload to Vertex AI

- [ ] **Model artifact'ını GCS'ye yükle**
  ```bash
  # GCS bucket oluştur
  gsutil mb -l us-central1 gs://water-leak-detection-models

  # Model dosyalarını yükle
  gsutil cp model.pkl gs://water-leak-detection-models/xgboost-leak-detector/
  gsutil cp requirements.txt gs://water-leak-detection-models/xgboost-leak-detector/
  ```

- [ ] **Custom prediction container oluştur (Opsiyonel)**
  ```python
  # predictor.py - Custom Vertex AI Predictor
  from google.cloud import aiplatform
  from google.cloud.aiplatform.prediction import LocalModel
  import joblib
  import numpy as np

  class LeakPredictor:
      def __init__(self, model_path):
          self.model = joblib.load(model_path)

      def predict(self, instances):
          predictions = []
          for instance in instances:
              pred = self.model.predict_proba([instance])[0]
              predictions.append({
                  'leak_probability': float(pred[1]),
                  'prediction': int(pred[1] > 0.7),
                  'confidence': float(max(pred))
              })
          return predictions
  ```

- [ ] **Model'i Vertex AI'a deploy et**
  ```python
  # deploy_to_vertex.py
  from google.cloud import aiplatform

  aiplatform.init(project='YOUR_PROJECT_ID', location='us-central1')

  # Model oluştur
  model = aiplatform.Model.upload(
      display_name='water-leak-xgboost',
      artifact_uri='gs://water-leak-detection-models/xgboost-leak-detector',
      serving_container_image_uri='us-docker.pkg.dev/vertex-ai/prediction/sklearn-cpu.1-0:latest'
  )

  # Endpoint oluştur ve deploy et
  endpoint = model.deploy(
      machine_type='n1-standard-2',
      min_replica_count=1,
      max_replica_count=3
  )

  print(f"Model deployed to endpoint: {endpoint.resource_name}")
  ```

---

## 🚀 Phase 2: FastAPI Backend Geliştirme

### 2.1 Proje Yapısı Oluştur

- [ ] **Backend klasör yapısını oluştur**
  ```
  backend/
  ├── app/
  │   ├── __init__.py
  │   ├── main.py              # FastAPI app
  │   ├── config.py            # Configuration
  │   ├── models/
  │   │   ├── __init__.py
  │   │   ├── schemas.py       # Pydantic models
  │   │   └── vertex_client.py # Vertex AI client
  │   ├── routers/
  │   │   ├── __init__.py
  │   │   ├── predict.py       # Prediction endpoints
  │   │   ├── model.py         # Model management
  │   │   └── health.py        # Health check
  │   ├── services/
  │   │   ├── __init__.py
  │   │   ├── prediction.py    # Prediction logic
  │   │   └── firestore.py     # Firebase integration
  │   └── utils/
  │       ├── __init__.py
  │       └── helpers.py
  ├── requirements.txt
  ├── Dockerfile
  └── .env.example
  ```

### 2.2 Core Files Oluştur

- [ ] **requirements.txt**
  ```txt
  fastapi==0.104.1
  uvicorn[standard]==0.24.0
  pydantic==2.5.0
  google-cloud-aiplatform==1.38.0
  google-cloud-firestore==2.13.1
  google-cloud-storage==2.10.0
  python-dotenv==1.0.0
  python-multipart==0.0.6
  numpy==1.24.3
  pandas==2.0.3
  ```

- [ ] **app/config.py**
  ```python
  from pydantic_settings import BaseSettings

  class Settings(BaseSettings):
      PROJECT_ID: str
      LOCATION: str = "us-central1"
      ENDPOINT_ID: str
      FIRESTORE_COLLECTION: str = "sensors"
      CORS_ORIGINS: list = ["http://localhost:3000"]

      class Config:
          env_file = ".env"

  settings = Settings()
  ```

- [ ] **app/models/schemas.py**
  ```python
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
  ```

- [ ] **app/models/vertex_client.py**
  ```python
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
          """Send prediction request to Vertex AI endpoint"""
          try:
              prediction = self.endpoint.predict(instances=instances)
              return {
                  'predictions': prediction.predictions,
                  'deployed_model_id': prediction.deployed_model_id
              }
          except Exception as e:
              raise Exception(f"Vertex AI prediction failed: {str(e)}")

  vertex_client = VertexAIClient()
  ```

### 2.3 API Endpoints Oluştur

- [ ] **app/routers/predict.py**
  ```python
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
  ```

- [ ] **app/routers/model.py**
  ```python
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
  ```

- [ ] **app/routers/health.py**
  ```python
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
  ```

- [ ] **app/main.py**
  ```python
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
  ```

---

## 🔥 Phase 3: Firebase Firestore Entegrasyonu

### 3.1 Firestore Setup

- [ ] **Firebase projesi oluştur**
  - Firebase Console: https://console.firebase.google.com/
  - Yeni proje oluştur veya mevcut Google Cloud projesini kullan

- [ ] **Firestore Database oluştur**
  - Native mode seç
  - Location: us-central1
  - Security rules: Test mode (geliştirme için)

- [ ] **Service Account key indir**
  ```bash
  # Firebase Console > Project Settings > Service Accounts > Generate New Private Key
  # Dosyayı backend/firebase-key.json olarak kaydet
  ```

### 3.2 Firestore Integration

- [ ] **app/services/firestore.py**
  ```python
  from google.cloud import firestore
  from datetime import datetime
  import os

  class FirestoreService:
      def __init__(self):
          # Service account key path
          os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'firebase-key.json'
          self.db = firestore.Client()
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
  ```

- [ ] **Prediction endpoint'e Firestore entegrasyonu ekle**
  ```python
  # app/routers/predict.py içine ekle
  from app.services.firestore import firestore_service

  @router.post("/predict", response_model=PredictionResponse)
  async def predict_leak(request: PredictionRequest):
      # ... prediction logic ...

      # Save to Firestore
      sensor_id = request.location_id or f"sensor_{datetime.now().timestamp()}"
      await firestore_service.save_sensor_data(sensor_id, {
          'pressure': request.pressure,
          'flow': request.flow,
          'temperature': request.temperature,
          'lat': 40.7580,  # Default or from request
          'lng': -73.9855,
      })

      await firestore_service.save_prediction(sensor_id, {
          'leak_probability': leak_probability,
          'prediction': 1 if leak_probability > 0.7 else 0
      })

      return response
  ```

---

## 📊 Phase 4: Data Pipeline & Simülasyon

### 4.1 Sensor Data Simulator

- [ ] **scripts/sensor_simulator.py**
  ```python
  import random
  import time
  from datetime import datetime
  from google.cloud import firestore
  import os

  os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'firebase-key.json'
  db = firestore.Client()

  # New York koordinatları civarında 10 sensör
  SENSORS = [
      {'id': 'S001', 'lat': 40.7580, 'lng': -73.9855},
      {'id': 'S002', 'lat': 40.7589, 'lng': -73.9851},
      {'id': 'S003', 'lat': 40.7571, 'lng': -73.9876},
      {'id': 'S004', 'lat': 40.7595, 'lng': -73.9842},
      {'id': 'S005', 'lat': 40.7565, 'lng': -73.9868},
      {'id': 'S006', 'lat': 40.7602, 'lng': -73.9838},
      {'id': 'S007', 'lat': 40.7558, 'lng': -73.9882},
      {'id': 'S008', 'lat': 40.7612, 'lng': -73.9825},
  ]

  def generate_sensor_reading(sensor, has_leak=False):
      if has_leak:
          pressure = random.uniform(40, 55)  # Low pressure
          flow = random.uniform(70, 95)      # Low flow
          leak_prob = random.uniform(0.7, 0.95)
      else:
          pressure = random.uniform(60, 75)  # Normal pressure
          flow = random.uniform(110, 140)    # Normal flow
          leak_prob = random.uniform(0.05, 0.3)

      return {
          'id': sensor['id'],
          'lat': sensor['lat'],
          'lng': sensor['lng'],
          'pressure': pressure,
          'flow': flow,
          'temperature': random.uniform(18, 26),
          'leak_probability': leak_prob,
          'timestamp': datetime.now()
      }

  def simulate_sensors():
      print("Starting sensor simulation...")
      while True:
          for sensor in SENSORS:
              # %20 ihtimalle leak simüle et
              has_leak = random.random() < 0.2

              reading = generate_sensor_reading(sensor, has_leak)

              # Firestore'a kaydet
              db.collection('sensors').document(sensor['id']).set(reading)

              status = "🚨 LEAK" if has_leak else "✅ OK"
              print(f"{status} - {sensor['id']}: P={reading['pressure']:.1f} F={reading['flow']:.1f}")

          time.sleep(5)  # Her 5 saniyede bir güncelle

  if __name__ == "__main__":
      simulate_sensors()
  ```

- [ ] **Simulator'ı çalıştır**
  ```bash
  python scripts/sensor_simulator.py
  ```

---

## 🧪 Phase 5: Testing

### 5.1 Unit Tests

- [ ] **tests/test_prediction.py**
  ```python
  from fastapi.testclient import TestClient
  from app.main import app

  client = TestClient(app)

  def test_predict_endpoint():
      response = client.post("/api/predict", json={
          "pressure": 65.5,
          "flow": 120.3,
          "temperature": 22.5
      })
      assert response.status_code == 200
      data = response.json()
      assert 'leak_probability' in data
      assert 0 <= data['leak_probability'] <= 1

  def test_health_check():
      response = client.get("/health")
      assert response.status_code == 200
      assert response.json()['status'] == 'healthy'
  ```

### 5.2 Integration Test

- [ ] **Test full pipeline**
  ```bash
  # Terminal 1: Backend çalıştır
  cd backend
  uvicorn app.main:app --reload

  # Terminal 2: Sensor simulator çalıştır
  python scripts/sensor_simulator.py

  # Terminal 3: Frontend çalıştır
  cd frontend
  npm run dev

  # Tarayıcıda http://localhost:3000 aç ve map'te sensörleri kontrol et
  ```

---

## 🚀 Phase 6: Deployment

### 6.1 Cloud Run Deployment

- [ ] **Dockerfile oluştur**
  ```dockerfile
  FROM python:3.10-slim

  WORKDIR /app

  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt

  COPY app/ ./app/
  COPY firebase-key.json .

  ENV PORT=8080
  ENV GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-key.json

  CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
  ```

- [ ] **Cloud Run'a deploy et**
  ```bash
  # Docker image oluştur
  gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/water-leak-api

  # Cloud Run'a deploy et
  gcloud run deploy water-leak-api \
      --image gcr.io/YOUR_PROJECT_ID/water-leak-api \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --set-env-vars PROJECT_ID=YOUR_PROJECT_ID,ENDPOINT_ID=YOUR_ENDPOINT_ID
  ```

### 6.2 Frontend Environment Update

- [ ] **Frontend .env güncelle**
  ```env
  VITE_API_BASE_URL=https://water-leak-api-xxxxx.run.app
  ```

---

## ✅ Checklist Summary

### Öncelikli (MVP)
- [ ] Vertex AI'a model deploy
- [ ] FastAPI `/predict` endpoint
- [ ] Firestore basic integration
- [ ] Sensor simulator
- [ ] Local testing
- [ ] Frontend-Backend bağlantısı

### İkinci Öncelik
- [ ] Batch prediction endpoint
- [ ] Model metrics endpoint
- [ ] Error handling & logging
- [ ] Cloud Run deployment
- [ ] Security & authentication

### Gelecek İyileştirmeler
- [ ] Model retraining pipeline
- [ ] Monitoring & alerting
- [ ] Load testing
- [ ] CI/CD pipeline
- [ ] Documentation (Swagger)

---

## 📚 Faydalı Linkler

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Firestore Python SDK](https://firebase.google.com/docs/firestore/quickstart)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)

---

## 💡 Notlar

1. **Maliyet Optimizasyonu**: Vertex AI endpoint için minimum replica count = 0 yapabilirsin (cold start kabul edilirse)
2. **Security**: Production'da API key authentication ekle
3. **Monitoring**: Cloud Monitoring ile endpoint performance takip et
4. **Data Retention**: Firestore'da eski verileri silme policy'si belirle

**Sonraki Adım**: Phase 1'den başla - Model deployment! 🚀
