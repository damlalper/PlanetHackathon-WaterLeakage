# 🌍 PlanetHackathon-WaterLeakage: AI-Powered Water Leak Detection System

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

<p align="center">
  <img src="https://simpleicons.org/icons/react.svg" alt="React" width="40" height="40"/>
  <img src="https://simpleicons.org/icons/python.svg" alt="Python" width="40" height="40"/>
  <img src="https://simpleicons.org/icons/googlecloud.svg" alt="Google Cloud" width="40" height="40"/>
  <img src="https://simpleicons.org/icons/firebase.svg" alt="Firebase" width="40" height="40"/>
  <img src="https://simpleicons.org/icons/boost.svg" alt="XGBoost" width="40" height="40"/>
</p>

---

> **An AI-powered, real-time water leak detection and visualization system designed to combat urban water scarcity.**  
> Leveraging IoT, Vertex AI, and interactive dashboards, this system turns data into actionable insights for cities.

![Demo GIF](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWM5dzB5eHExNzBqMmRpd2Zvdmc2dHp5NGUzeHpzbXg1YW1veXFpcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlxB64LOpt3E8OQ/giphy.gif)

---

## 🎯 Vision & Mission

**Mission:** Provide cities with intelligent tools to detect leaks instantly, reduce water loss, and minimize environmental impact.  

**Vision 2030:** With global water stress projected to impact **40% of the population**, proactive leak detection will be vital for sustainable urban living, energy efficiency, and climate resilience.

---

## 💧 The Problem: Urban Water Leakage in 2030

Aging infrastructure + inefficient manual monitoring leads to:

- **Massive Water Waste:** Billions of liters lost daily.  
- **Financial Loss:** Millions lost by municipalities yearly.  
- **Environmental Impact:** Wasted energy, soil erosion, higher carbon footprint.  
- **Operational Inefficiency:** Reactive, slow, resource-heavy leak detection.  

> Undetected leaks exacerbate water scarcity and climate vulnerability.

![Water Loss Infographic](https://upload.wikimedia.org/wikipedia/commons/1/11/Water_Leak.jpg)

---

## 💡 Our Solution

A **smart AI system** combining IoT, machine learning, and an interactive dashboard:

1. **AI Prediction Service**
   - **XGBoost** model trained on pressure, flow, and temperature.
   - Hosted on **Google Cloud Vertex AI** for real-time prediction.
2. **Real-Time Data & API Layer**
   - **Firebase Firestore** stores live sensor data.
   - **FastAPI** backend queries the model and serves frontend requests.
3. **Interactive Dashboard**
   - **React + Material UI + Tailwind CSS**
   - Live geospatial maps, KPIs, analytics, and AI insights.

### System Data Flow

```text
[IoT Sensors] --(Real-time Data)--> [Firebase Firestore]
       ^                                      |
       |                                      | (Updates)
       |                                      v
[React Frontend] <--(Predictions)-- [FastAPI Backend]
       ^                                      |
       | (User Actions)                        | (Prediction Requests)
       |                                      v
       +------------------------> [Vertex AI Endpoint]
                                   (XGBoost Model)

```

## Key Features

- **Live Geospatial Map:** Real-time leak probabilities visualized on Google Maps.  
- **KPI Dashboard:** Total leaks, water savings, carbon reduction, system health.  
- **Advanced Analytics:** Pressure vs. flow, prediction confidence charts, SHAP insights.  
- **Alerting:** Automatic notifications for threshold breaches.  
- **Responsive Design:** Desktop and mobile ready.  

## 🗺️ Project Roadmap

| Phase | Status | Focus Area | Key Deliverables |
|-------|--------|------------|-----------------|
| 1 | ✅ Complete | Foundation & Prototyping | UI/UX mockups, component library, initial XGBoost model |
| 2 | 🔄 In-Progress | MVP Implementation | FastAPI backend, Vertex AI deployment, Google Maps integration |
| 3 | ⏳ Pending | End-to-End Integration | Frontend-backend connection, real-time Firestore updates |
| 4 | ⏳ Pending | Deployment & Production | Cloud Run + Firebase Hosting, integration tests |
| 5 | 💡 Future | Advanced Features | Auto retraining, advanced alerting, cost-saving analytics |

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | React, TypeScript, Tailwind CSS, Material UI, Recharts, Framer Motion |
| Backend | Python, FastAPI, Uvicorn |
| ML/AI | XGBoost, Vertex AI (Prediction + Pipelines) |
| Database | Firebase Firestore |
| Deployment | Google Cloud Run, Firebase Hosting |
| DevOps | Docker, GitHub Actions (CI/CD) |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+) & npm  
- Python (v3.10+) & pip  
- Google Cloud SDK  
- Google Cloud Project with Vertex AI, Firestore, Cloud Run  

### 1. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Add Firebase and API keys to .env
npm run dev
```

### 2. Backend Setup
```bash

cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# Deploy trained XGBoost model to Vertex AI Endpoint
# Connect FastAPI to Vertex AI and Firebase
```

## 📈 Hackathon Strategy

**Jury Impact:**  
- **Live Demo:** Show real or simulated leak points on the map.  
- **Measurable Results:** Prediction accuracy (90%+), water savings, and carbon reduction.  
- **Innovation:** Vertex AI + Maps API + Dashboard = All-in-one solution.  

**Key KPIs to Highlight:**  
- X leaks detected → Y liters of water saved  
- Real-time prediction accuracy  

## 🤝 Contributing

1. Fork the repository  
2. Create your branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)  
4. Push to your branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

## 📄 License

MIT License – See [LICENSE](LICENSE) for details
