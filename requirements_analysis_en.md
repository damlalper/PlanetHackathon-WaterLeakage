# Hackathon Frontend Plan — Water Leak Detection Dashboard

## Inputs

### Business Goals
- **Alignment with Jury Goals:** Live demo + measurable impact + innovative visualization.  
  - Hackathon priority: show working demo of leak detection.
- **Project-specific business goals:**
  - Detect leaks in city water networks with high accuracy (target 90%+).
  - Provide real-time/near-real-time display to meet jury demo expectations.
  - Present measurable impact metrics such as water savings and carbon reduction.
  - Deliver a visually appealing React dashboard aligned with Google Cloud design guidelines.

### Current Processes and Systems
- **Backend / Model / Endpoints:** (ready)
  - Vertex AI — XGBoost-based leak prediction model (trained)
  - FastAPI — `/predict` endpoint
  - Firebase Firestore — real-time IoT sensor data stream

- **Data Sources:**
  - Real/simulated sensor data: pressure, flow, temperature, location, timestamp
  - BigQuery / GCS available (recommended in hackathon notes)

- **UI/UX references:** Google Cloud Console aesthetics, Material Design 3.0, Google Sans/Roboto typography

- **Deployment target:** Firebase Hosting (React application)

### Stakeholders
- **Decision Makers / Jury:** Hackathon jury members
- **Customer / User:** City water operators, field technicians, municipal managers
- **Development Team:** Frontend, Backend, AI/Data specialist, DevOps
- **Supporting Stakeholders:** Designer, presentation creator

### Time and Budget Constraints
- **Hackathon duration:** 7 days
- **Priority:** MVP working demo (map + live leak markers + KPI cards)
- **Resource constraints:** Small team, limited design time
- **Budget:** Cloud free tier / student credits; no paid external tools

### Success Criteria
- **Functional:** Sensors visible on map and updated from Firestore; KPI cards accurate
- **Performance & UX:** Page load ≤ 3s, mobile-friendly
- **Hackathon-specific:** At least 3 leaks must be successfully shown during demo; visual design aligned with Google Cloud aesthetics
- **Key metrics:** Prediction accuracy (%), latency (seconds), detected leaks, estimated water savings (liters)

---

## Outputs

### Scope Definition

#### In-Scope
- Full React + Vite frontend (responsive)
- Material Design 3.0 + Tailwind
- Dashboard Overview: KPI cards, time-series chart, donut chart, animated background
- Map page: Google Maps API, sensor markers, popups
- Analytics page: Pressure vs Flow scatter, confidence histogram, temporal trends
- Model Insights: Accuracy/Precision/Recall, confusion matrix heatmap, SHAP chart, "Retrain model" button
- Admin & Settings: Threshold slider, sensor CRUD, dark/light mode
- Realtime: Firestore listener, skeleton loaders, toast notifications
- Sample axios fetches: `/predict`, Firestore connection example
- Component tree and folder structure
- Demo-ready mock data and test scenarios

#### Out-of-Scope
- Retraining Vertex AI model infrastructure
- Production-grade authentication
- Long-term cost optimization
- Complete CI/CD pipeline details

### Prioritized Requirements (MoSCoW)
- **Must:** Map integration, KPI cards, `/predict` fetch, responsive dashboard, basic theme & navigation, skeleton loader, toast notifications
- **Should:** Time-series chart + chart switch, confusion matrix, SHAP chart, dark/light mode toggle
- **Could:** Animated wave background, marker clustering, push/SMS/Email notification toggle, "Retrain model" link
- **Won’t:** Production authentication, cost optimization, SLA agreements

---

## Timebox Plan (7-Day Hackathon)

| Day | Activity | Timebox |
|-----|----------|---------|
| 0 | Preparation: accounts, repo, boilerplate | - |
| 1 | Scaffold & Basic Layout: Vite + MUI theme, Tailwind, sidebar/topbar, Dashboard skeleton | 8h |
| 2 | Firestore + Map Mock: listener, marker rendering, popup content | 8h |
| 3 | Charts & Analytics: Recharts/Chart.js, time-series + donut chart, hour/day/month switch | 8h |
| 4 | Model Insights + API: Axios `/predict`, model metrics, SHAP chart | 8h |
| 5 | Admin, Settings, Dark Mode: Threshold slider, sensor CRUD, theme switch | 8h |
| 6 | Polish & Animations: Framer Motion, skeleton loaders, toast notifications, responsive fixes | 8h |
| 7 | Test & Presentation: end-to-end demo, freeze KPI data for presentation | 8h |

---

## Risk and Dependency Log

| Risk / Dependency | Impact | Probability | Mitigation / Contingency |
|------------------|--------|------------|-------------------------|
| Maps API key limit / quota | High | Medium | Local mock map fallback, quota increase |
| Firestore access errors | High | Medium | Simple security rules, offline mock |
| Vertex AI endpoint latency | High | Low-Medium | Batch/mock fallback, cache & debounce |
| Insufficient time | High | High | Prioritize must-have tasks |
| Team member absence | Medium | Medium | Reusable components, minimal stateful logic |
| Privacy / sensitive data | Medium | Low | Use simulated data |
| Internet / deploy issues | High | Low-Medium | Local demo, screen share with mock data |

---

## Success Metrics / KPIs

### Functional
- At least 1 leak example shown on map during demo
- KPI cards accurate and up-to-date

### Model Performance
- Model accuracy ≥ 70% (ideal 90%+)

### UX / Performance
- Smooth page transitions, dashboard load ≤ 3s

### Presentation Impact Metrics
- Water savings estimate and detected leak count clearly displayed

### Technical Maturity
- Frontend production build deployable on Firebase Hosting

---

## Technical / Detailed Deliverables

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

React Router Structure
/ → DashboardOverview
/map → Map Visualization
/analytics → Analytics charts
/model → Model Insights
/admin → Admin & Settings

Theme & Colors (M3 Palette)
Primary: #1565C0
Secondary: #42A5F5
Accent/Success: #81C784
Background: #E3F2FD
Typography: Google Sans / Roboto

Charts & Map Mockup Strategy
Recharts/Chart.js with sample dataset (hour/day/month)
Map: @react-google-maps/api marker components
probability > threshold → red, else blue
Confusion matrix: 2x2 heatmap
SHAP: top 10 feature importance bar chart

Animations & UX
Framer Motion page transitions (fade + slide)
Wave background: subtle SVG + slow Framer Motion animation
Toast: leak alert (leak_prob > threshold) bottom-right

Test & Acceptance
Unit: KpiCard render tests (jest/react-testing-library)
E2E: Simple Cypress scenario — map markers visible, predict call triggers toast (optional)