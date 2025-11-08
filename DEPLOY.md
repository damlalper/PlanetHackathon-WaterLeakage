# 🚀 Hızlı Deploy Kılavuzu (1 Saat)

## ⏱️ Süre Tahmini: 45-60 dakika

Bu kılavuz, projenin Google Cloud üzerinde hızlı şekilde deploy edilmesi için optimize edilmiştir.

---

## 📋 Ön Hazırlık (5 dakika)

### Gerekli Hesaplar
- ✅ Google Cloud hesabı (aktif billing)
- ✅ Firebase projesi
- ✅ Google Maps API key

### Yerel Araçlar
```bash
# Google Cloud SDK kurulumu kontrolü
gcloud --version

# Firebase CLI kurulumu kontrolü
firebase --version

# Eğer yoksa:
npm install -g firebase-tools
```

---

## 🔧 1. Adım: Google Cloud Yapılandırması (10 dakika)

### 1.1 Proje Ayarları
```bash
# Proje ID'nizi ayarlayın
export PROJECT_ID="water-leak-detection-477117"
export REGION="us-central1"

# Projeyi aktif edin
gcloud config set project $PROJECT_ID

# Gerekli API'leri etkinleştirin (tek komutla)
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  firestore.googleapis.com
```

### 1.2 Service Account Oluştur
```bash
# Service account oluştur
gcloud iam service-accounts create water-leak-sa \
  --display-name="Water Leak Detection Service Account"

# Gerekli rolleri ver
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:water-leak-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:water-leak-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

# Key dosyasını indir (eğer yoksa)
gcloud iam service-accounts keys create backend/firebase-key.json \
  --iam-account=water-leak-sa@${PROJECT_ID}.iam.gserviceaccount.com
```

---

## 🤖 2. Adım: Vertex AI Model Deploy (15 dakika)

### 2.1 Model Dosyasını Kontrol Et
```bash
# Model dosyasının varlığını kontrol et
ls backend/xgboost_leak_model.pkl
# veya
ls xgboost_leak_model.pkl
```

### 2.2 Cloud Storage Bucket Oluştur ve Model Yükle
```bash
# Bucket oluştur
gsutil mb -p $PROJECT_ID -l $REGION gs://${PROJECT_ID}-models

# Model dosyasını yükle
gsutil cp backend/xgboost_leak_model.pkl gs://${PROJECT_ID}-models/leak-detector/model.pkl
# veya model başka yerdeyse
# gsutil cp xgboost_leak_model.pkl gs://${PROJECT_ID}-models/leak-detector/model.pkl
```

### 2.3 Model ve Endpoint Oluştur (ÖNEMLİ!)
```bash
# Model oluştur
gcloud ai models upload \
  --region=$REGION \
  --display-name=water-leak-xgboost \
  --container-image-uri=us-docker.pkg.dev/vertex-ai/prediction/sklearn-cpu.1-0:latest \
  --artifact-uri=gs://${PROJECT_ID}-models/leak-detector/

# Endpoint oluştur
gcloud ai endpoints create \
  --region=$REGION \
  --display-name=water-leak-endpoint

# Endpoint ID'yi al (çıktıdan kopyalayın)
# Örnek: projects/123456/locations/us-central1/endpoints/987654
# Son kısmı (987654) ENDPOINT_ID olarak kullanın

# Model'i endpoint'e deploy et (bu 10-15 dakika sürebilir!)
gcloud ai endpoints deploy-model <ENDPOINT_ID> \
  --region=$REGION \
  --model=<MODEL_ID> \
  --display-name=water-leak-deployment \
  --machine-type=n1-standard-2 \
  --min-replica-count=1 \
  --max-replica-count=1
```

**NOT:** Model deploy olurken diğer adımlara geçebilirsiniz!

---

## 🐳 3. Adım: Backend Deploy - Cloud Run (15 dakika)

### 3.1 Dockerfile Oluştur
`backend/Dockerfile` dosyası:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
```

### 3.2 .env Dosyasını Güncelle
`backend/.env` dosyasını düzenleyin:
```bash
PROJECT_ID=water-leak-detection-477117
LOCATION=us-central1
ENDPOINT_ID=<YUKARIDAN_ALDIĞINIZ_ENDPOINT_ID>
FIRESTORE_COLLECTION=sensors
FIRESTORE_DATABASE=water-leak-db
CORS_ORIGINS=["*"]
```

### 3.3 Backend'i Deploy Et
```bash
cd backend

# Cloud Run'a deploy et
gcloud run deploy water-leak-api \
  --source . \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars PROJECT_ID=$PROJECT_ID,LOCATION=$REGION,ENDPOINT_ID=<ENDPOINT_ID>,FIRESTORE_COLLECTION=sensors,CORS_ORIGINS='["*"]' \
  --service-account=water-leak-sa@${PROJECT_ID}.iam.gserviceaccount.com \
  --min-instances=1 \
  --max-instances=10

# Deploy URL'i kopyalayın (örnek: https://water-leak-api-xxx-uc.a.run.app)
```

---

## 🎨 4. Adım: Frontend Deploy - Firebase Hosting (10 dakika)

### 4.1 Firebase Projesini Bağla
```bash
cd ../frontend

# Firebase'e login
firebase login

# Projeyi başlat (mevcut proje varsa kullan)
firebase use $PROJECT_ID
# veya yeni proje için
# firebase init hosting
```

### 4.2 .env Dosyasını Güncelle
`frontend/.env` dosyasını düzenleyin:
```bash
# Backend Cloud Run URL'i
VITE_API_BASE_URL=https://water-leak-api-xxx-uc.a.run.app

# Google Maps API Key (Firebase Console > APIs & Services)
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key

# Firebase Config (Firebase Console > Project Settings)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=water-leak-detection-477117.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=water-leak-detection-477117
VITE_FIREBASE_STORAGE_BUCKET=water-leak-detection-477117.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4.3 Firebase Config Oluştur
`frontend/firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 4.4 Build ve Deploy
```bash
# Dependencies kur
npm install

# Production build
npm run build

# Firebase'e deploy et
firebase deploy --only hosting

# Deploy URL'i kopyalayın (örnek: https://water-leak-detection-477117.web.app)
```

---

## 🧪 5. Adım: Test ve Doğrulama (5 dakika)

### Backend Health Check
```bash
# Backend'in çalıştığını kontrol et
curl https://water-leak-api-xxx-uc.a.run.app/health
```

### Frontend'i Aç
```
https://water-leak-detection-477117.web.app
```

### Test Verisi Ekle (Opsiyonel)
```bash
cd backend
python scripts/add_test_data.py
```

---

## 🔥 Hızlı Troubleshooting

### CORS Hatası
```bash
# Backend .env'de CORS_ORIGINS'i güncelleyin
CORS_ORIGINS=["*"]
# veya
CORS_ORIGINS=["https://water-leak-detection-477117.web.app"]
```

### Model Prediction Hatası
- Vertex AI endpoint'inin deploy durumunu kontrol edin:
```bash
gcloud ai endpoints list --region=$REGION
```

### Firebase Connection Hatası
- Firestore Database'in oluşturulduğundan emin olun (Firebase Console)
- Security Rules'ı test için açık tutun (production'da değiştirin!)

---

## 📝 Deploy Özet Checklist

- [ ] Google Cloud proje ve API'ler etkin
- [ ] Service Account oluşturuldu ve key indirildi
- [ ] Vertex AI model deploy edildi
- [ ] Backend Cloud Run'da çalışıyor
- [ ] Frontend Firebase Hosting'de live
- [ ] .env dosyaları doğru yapılandırılmış
- [ ] Health check başarılı
- [ ] Test verisi eklendi

---

## 🎯 Sonuç

Tebrikler! Projeniz şu adreslerde yayında:

- **Frontend:** https://water-leak-detection-477117.web.app
- **Backend API:** https://water-leak-api-xxx-uc.a.run.app
- **API Docs:** https://water-leak-api-xxx-uc.a.run.app/docs

### Maliyet Optimizasyonu
- Cloud Run: Pay-per-use (istek olmadığında ücret yok)
- Firebase Hosting: Generous free tier
- Vertex AI: En maliyetli kısım (min-replica-count=1)
  - Demo sonrası min-replica-count=0 yapabilirsiniz (cold start olur)

### Güvenlik (Production için)
- [ ] CORS_ORIGINS'ı spesifik domaine çevirin
- [ ] Firestore Security Rules ekleyin
- [ ] API authentication ekleyin
- [ ] Environment variables'ı Secret Manager'a taşıyın
