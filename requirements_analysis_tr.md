# Hackathon Frontend Planı — Su Kaçak Tespit Dashboard

## Girdiler (Inputs)

### İş Hedefleri
- **Jüri hedefiyle uyum:** Canlı demo + ölçülebilir etki + yenilikçi görselleştirme.  
  - Hackathon önceliği: çalışan demo ile kaçak tespitini göstermek.
- **Projeye özel iş hedefleri:**
  - Şehir su şebekesindeki kaçakları yüksek doğrulukla tespit etmek (%90+ hedef).
  - Gerçek zamanlı/near-real-time gösterim ile jürinin demo beklentisini karşılamak.
  - Su tasarrufu ve karbon azaltımı gibi ölçülebilir metrikler sunmak.
  - Google Cloud tasarım rehberlerine uygun, görsel açıdan etkileyici bir React dashboard.

### Mevcut Süreçler ve Sistemler
- **Backend / Model / Endpointler:** (tamamlandı)
  - Vertex AI — XGBoost tabanlı leak prediction modeli (eğitilmiş)
  - FastAPI — `/predict` endpoint
  - Firebase Firestore — IoT sensörlerinden gerçek zamanlı veri akışı

- **Veri kaynakları:**
  - Gerçek/simüle edilmiş sensör verisi: basınç, akış, sıcaklık, lokasyon, timestamp
  - BigQuery / GCS kullanılabilir (hackathon hazırlık notları öneriyor)

- **UI/UX referansları:** Google Cloud Console estetiği, Material Design 3.0, Google Sans/Roboto tipografisi

- **Deployment hedefi:** Firebase Hosting (React uygulaması)

### Paydaşlar
- **Karar vericiler / Jüri:** Hackathon jüri üyeleri
- **Müşteri / Kullanıcı:** Şehirsu operatörleri, saha teknisyenleri, belediye yöneticileri
- **Geliştirme ekibi:** Frontend, Backend, AI/Veri uzmanı, DevOps
- **Destekleyici paydaşlar:** Tasarımcı, sunum hazırlayan

### Zaman ve Bütçe Kısıtları
- **Hackathon süresi:** 7 gün
- **Öncelik:** MVP çalışır demo (map + live leak markers + KPI kartları)
- **Kaynak kısıtları:** Küçük ekip, sınırlı tasarım zamanı
- **Bütçe:** Cloud ücretsiz katmanı / öğrenci kredileri; harici lisans gerektiren araç yok

### Başarı Kriterleri
- **Fonksiyonel:** Harita üzerinde sensörler görünür ve Firestore’dan güncelleniyor; KPI kartları doğru
- **Performans & UX:** Sayfa yüklenme ≤ 3s, mobil uyumlu
- **Hackathon özel:** Demo sırasında en az 3 kaçak başarıyla gösterilebilmeli, görsel tasarım Google Cloud estetiği
- **Kilit ölçümler:** Tahmin doğruluğu (%), gecikme (saniye), saptanan kaçak sayısı, tahmini su tasarrufu (litre)

---

## Çıktılar (Outputs)

### Kapsam Tanımı

#### Yapılacaklar (in-scope)
- Tam React + Vite frontend (responsive)
- Material Design 3.0 + Tailwind
- Dashboard Overview: KPI kartları, time-series chart, donut chart, animasyonlu arka plan
- Map page: Google Maps API, sensor markers, popups
- Analytics page: Pressure vs Flow scatter, confidence histogram, temporal trends
- Model Insights: Accuracy/Precision/Recall, confusion matrix heatmap, SHAP chart, “Retrain model” butonu
- Admin & Settings: Threshold slider, sensor CRUD, dark/light mode
- Realtime: Firestore listener, skeleton loaders, toast notifications
- Sample axios fetches: `/predict`, Firestore bağlantı örneği
- Component tree ve klasör yapısı
- Demo-ready mock data ve test senaryoları

#### Yapılmayacaklar (out-of-scope)
- Vertex AI model eğitimi altyapısının yeniden uygulanması
- Production-grade authentication
- Uzun süreli maliyet optimizasyonu
- Komple CI/CD pipeline detayları

### Önceliklendirilmiş Gereksinimler (MoSCoW)
- **Must:** Harita entegrasyonu, KPI kartları, `/predict` fetch, responsive dashboard, temel tema & navigasyon, skeleton loader ve toast
- **Should:** Time-series chart + chart switch, confusion matrix, SHAP chart, dark/light mode toggle
- **Could:** Animated wave background, marker clustering, push/SMS/Email notification toggle, “Retrain model” link
- **Won’t:** Production authentication, maliyet optimizasyonu, SLA sözleşmesi

---

## Zaman Kutusu Planı (7 Günlük Hackathon)

| Gün | Aktivite | Timebox |
|-----|----------|---------|
| 0 | Hazırlık: hesaplar, repo, boilerplate | - |
| 1 | Scaffold & Temel Layout: Vite + MUI theme, Tailwind, sidebar/topbar, Dashboard skeleton | 8h |
| 2 | Firestore + Map Mock: listener, marker render, popup içerik | 8h |
| 3 | Charts & Analytics: Recharts/Chart.js, time-series + donut chart, hour/day/month switch | 8h |
| 4 | Model Insights + API: Axios `/predict`, model metrics, SHAP chart | 8h |
| 5 | Admin, Settings, Dark Mode: Threshold slider, sensor CRUD, theme switch | 8h |
| 6 | Polish & Animations: Framer Motion, skeleton loaders, toast notifications, responsive fixes | 8h |
| 7 | Test & Presentation: end-to-end demo, KPI verilerini sunum için sabitle | 8h |

---

## Risk ve Bağımlılık Kaydı

| Risk / Bağımlılık | Etki | Olasılık | Önlem / Mitigasyon |
|------------------|------|----------|------------------|
| Maps API key limiti / quota | Yüksek | Orta | Lokal mock map fallback, quota artırımı |
| Firestore erişim hatası | Yüksek | Orta | Basit security rules, offline mock |
| Vertex AI endpoint gecikmesi | Yüksek | Düşük-Orta | Batch/mock fallback, cache & debounce |
| Zaman yetersizliği | Yüksek | Yüksek | Must’ları öncelikli tamamla |
| Ekip üyesi yokluğu | Orta | Orta | Reusable komponentler, minimal stateful logic |
| Gizlilik / veri hassasiyeti | Orta | Düşük | Simüle veri kullanımı |
| İnternet / deploy sorunları | Yüksek | Düşük-Orta | Lokal demo, ekran paylaşımda mock veri |

---

## Başarı Ölçütleri / KPI’lar

### Fonksiyonel
- Harita üzerinde en az 1 kaçak örneği demo
- KPI kartları doğru ve güncel

### Model Performans
- Model accuracy ≥ %70 (ideal %90+)

### UX/Performans
- Sayfa geçişleri akıcı, dashboard yükleme ≤ 3s

### Sunum Etki Metrikleri
- Demo sırasında “su tasarrufu tahmini” ve “kaçak tespit sayısı” gösterimi

### Teknik Olgunluk
- Frontend production build ile Firebase Hosting’e deploy edilebilir

---

## Teknik / Detaylı Teslimatlar

### Component Hierarchy & Folder Structure
```text
src/
├─ pages/
│  ├─ Dashboard.tsx
│  ├─ MapView.tsx
│  ├─ Analytics.tsx
│  ├─ ModelInsights.tsx
│  └─ AdminSettings.tsx
├─ components/
│  ├─ layout/
│  │  ├─ Sidebar.tsx
│  │  └─ Topbar.tsx
│  ├─ kpi/
│  │  └─ KpiCard.tsx
│  ├─ charts/
│  │  ├─ TimeSeriesChart.tsx
│  │  ├─ DonutChart.tsx
│  │  └─ ConfusionMatrix.tsx
│  ├─ map/
│  │  └─ SensorMarker.tsx
│  └─ ui/
│     └─ ThemeProvider.tsx
├─ services/
│  ├─ api.ts
│  └─ firebase.ts
├─ hooks/
│  └─ useRealtimeSensors.ts
├─ utils/
│  └─ helpers.ts
└─ App.tsx

### React Router Structure
/ → DashboardOverview

/map → Map Visualization

/analytics → Analytics charts

/model → Model Insights

/admin → Admin & Settings

### Tema & Renkler (M3 Palette)
Primary: #1565C0
Secondary: #42A5F5
Accent/Success: #81C784
Background: #E3F2FD
Typography: Google Sans / Roboto

## Charts & Map Mockup Stratejisi
Recharts/Chart.js ile sample dataset (hour/day/month)
Map: @react-google-maps/api ile marker komponentleri
probability > threshold → kırmızı, aksi halde mavi
Confusion matrix: 2x2 heatmap
SHAP: top 10 feature importance bar chart

### Animations & UX
Framer Motion page transitions (fade + slide)
Wave background: subtle SVG + yavaş Framer Motion animasyonu
Toast: leak alert (leak_prob > threshold) sağ alt

### Test & Acceptance
Unit: KpiCard render testleri (jest/react-testing-library)
E2E: Basit Cypress senaryosu — harita marker görünmeli, predict call tetiklenip toast gösterilmeli (opsiyonel)