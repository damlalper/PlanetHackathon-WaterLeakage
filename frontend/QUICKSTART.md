# Quick Start Guide

## Hızlı Başlangıç

### 1. Bağımlılıkları Yükle

```bash
cd frontend
npm install
```

### 2. Environment Dosyası Oluştur

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

### 3. .env Dosyasını Düzenle

`.env` dosyasını açın ve aşağıdaki değerleri doldurun:

```env
# Backend API (Opsiyonel - şimdilik mock data kullanılacak)
VITE_API_BASE_URL=http://localhost:8000

# Google Maps API Key (Gerekli)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Firebase Configuration (Opsiyonel - şimdilik mock data kullanılacak)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

**Not:** Firebase yapılandırması yapılmadığında otomatik olarak mock data kullanılır.

### 4. Google Maps API Key Alma

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Library" bölümüne gidin
4. "Maps JavaScript API" arayın ve etkinleştirin
5. "APIs & Services" > "Credentials" bölümünden API key oluşturun
6. API key'i `.env` dosyasına ekleyin

### 5. Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılacak.

### 6. Production Build

```bash
npm run build
```

Build dosyaları `dist` klasörüne oluşturulur.

## Özellikler

### Şu An Çalışan Özellikler (Mock Data ile)

- ✅ Dashboard Overview - KPI kartları ve grafikler
- ✅ Map View - Google Maps entegrasyonu (API key gerekli)
- ✅ Analytics - Veri analiz grafikleri
- ✅ Model Insights - Model performans metrikleri
- ✅ Admin Settings - Ayarlar paneli
- ✅ Dark/Light Mode - Tema değiştirme
- ✅ Responsive Design - Mobil uyumlu

### Backend Bağlantısı Gerektirecek Özellikler

- 🔄 Gerçek zamanlı Firebase veri akışı
- 🔄 FastAPI prediction endpoint
- 🔄 Model retraining

## Sorun Giderme

### Google Maps Yüklenmiyor

- `.env` dosyasında `VITE_GOOGLE_MAPS_API_KEY` değerinin doğru olduğundan emin olun
- API key'in "Maps JavaScript API" için etkinleştirildiğini kontrol edin
- Tarayıcı konsolunda hata mesajlarını kontrol edin

### Build Hataları

Eğer TypeScript hataları alıyorsanız:

```bash
rm -rf node_modules
npm install
npm run build
```

### Port Çakışması

Eğer 3000 portu kullanılıyorsa, `vite.config.ts` dosyasında portu değiştirebilirsiniz:

```typescript
server: {
  port: 3001, // Farklı bir port
  open: true
}
```

## Klasör Yapısı

```
frontend/
├── src/
│   ├── components/     # Yeniden kullanılabilir bileşenler
│   ├── pages/          # Ana sayfa bileşenleri
│   ├── services/       # API ve Firebase servisleri
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Yardımcı fonksiyonlar
│   ├── data/           # Mock data
│   └── types/          # TypeScript type tanımları
├── public/             # Static dosyalar
└── dist/               # Build çıktısı
```

## Sonraki Adımlar

1. ✅ Frontend yapısı tamamlandı
2. ⏳ Backend API entegrasyonu
3. ⏳ Firebase Firestore real-time bağlantı
4. ⏳ Production deployment (Firebase Hosting)

## Yardım

Herhangi bir sorunla karşılaşırsanız:
1. `npm run dev` komutunun çıktısını kontrol edin
2. Tarayıcı konsol loglarına bakın
3. `.env` dosyasının doğru yapılandırıldığından emin olun
