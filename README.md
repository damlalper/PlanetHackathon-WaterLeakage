# PlanetHackathon-WaterLeakage: AI-Powered Water Leak Detection System

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

> A full-stack, AI-driven platform for the real-time detection and visualization of water leaks in urban water infrastructure. This project combines a powerful machine learning model with a modern web interface to provide actionable insights for municipal water management.

## 🎯 Vision & Mission

**Our mission is to empower cities with intelligent tools to combat water loss.** By providing a real-time, intuitive, and data-driven solution, we aim to help municipalities conserve water, reduce operational costs, and minimize the environmental impact of water leakage.

## 💧 The Problem: Urban Water Leakage

Non-Revenue Water (NRW) is a critical global issue. A significant portion of this is lost through leaks in aging urban water distribution networks. These leaks lead to:

- **Massive Water Waste:** Billions of liters of treated water are lost daily.
- **Financial Loss:** Lost revenue for municipalities and high costs for repair.
- **Environmental Impact:** Wasted energy from water treatment and pumping, plus potential ground erosion.
- **Operational Inefficiency:** Locating leaks is often a slow, manual, and resource-intensive process.

## 💡 Our Solution

This project tackles the problem by creating a smart monitoring system that uses IoT sensor data and machine learning to predict and pinpoint leaks before they become critical failures.

The system architecture consists of three main components:

1.  **AI Prediction Service:** An XGBoost model trained on sensor data (pressure, flow rate, temperature) is deployed on **Google Cloud Vertex AI**. It analyzes incoming data to calculate the probability of a leak.
2.  **Real-Time Data & API Layer:**
    - **Firebase Firestore** acts as the real-time database, ingesting data from IoT sensors across the city.
    - A **FastAPI (Python)** backend serves as the central API, handling requests from the frontend, querying the Vertex AI model for predictions, and communicating with the database.
3.  **Interactive Frontend Dashboard:** A **React** application provides a single pane of glass for city water operators. It features a live map, KPI dashboards, and detailed analytics, allowing users to visualize the network's health and respond to alerts instantly.

### System Architecture & Data Flow

```
[IoT Sensors] --(Real-time Data)--> [Firebase Firestore]
       ^                                      |
       |                                      | (Real-time Updates)
       |                                      v
[React Frontend] <--(Prediction JSON)-- [FastAPI Backend]
       ^                                      |
       | (User Interaction)                   | (Prediction Request)
       |                                      v
       +----------------------------> [Vertex AI Endpoint]
                                        (XGBoost Model)
```

## ✨ Key Features

- **Real-Time Geospatial Map:** Live visualization of all sensors on Google Maps, with markers dynamically colored based on leak probability.
- **KPI Dashboard:** At-a-glance metrics including total sensors, active leak alerts, estimated water savings, and overall system health.
- **Advanced Analytics:** Deep dive into sensor data with time-series charts, pressure vs. flow scatter plots, and prediction confidence histograms.
- **Model Insights:** A dedicated view to monitor the AI model's performance, featuring accuracy metrics, a confusion matrix, and feature importance charts (SHAP).
- **Alerting System:** Automatic toast notifications on the dashboard when a sensor's leak probability crosses a predefined threshold.
- **Responsive Design:** Fully responsive interface built with Material Design principles for use on both desktop and mobile devices.

## 🗺️ Project Roadmap

This roadmap outlines the key phases of development, from initial setup to a production-ready application.

| Phase | Status      | Focus Area                  | Key Deliverables                                                                                             |
| :---: | :---------- | :-------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **1** | ✅ Complete | **Foundation & Prototyping**  | - **Frontend:** UI/UX mockups, component library, and page skeletons (React, MUI, Tailwind).<br>- **AI:** Initial model training and evaluation (`train_model.py`).<br>- **Docs:** Detailed requirements analysis. |
| **2** | 🔄 In-Progress | **MVP Implementation**        | - **Backend:** FastAPI server with a `/predict` endpoint.<br>- **AI:** Deploy trained model to a Vertex AI endpoint.<br>- **Frontend:** Integrate Google Maps, KPI cards, and basic charts. |
| **3** | ⏳ Pending   | **End-to-End Integration**    | - **Integration:** Connect frontend to backend API.<br>- **Data Pipeline:** Set up Firestore listener for real-time data updates on the frontend.<br>- **Simulation:** Develop a sensor data simulator for live demos. |
| **4** | ⏳ Pending   | **Deployment & Production**   | - **Deployment:** Deploy backend to Cloud Run and frontend to Firebase Hosting.<br>- **Testing:** Implement comprehensive integration and E2E tests.<br>- **Security:** Add API authentication and secure Firestore rules. |
| **5** | 💡 Future    | **Advanced Features**         | - **MLOps:** Build a full Vertex AI pipeline for automated model retraining.<br>- **Alerting:** Integrate advanced notification services (Email, SMS).<br>- **Analytics:** Add cost-saving reports and anomaly detection features. |

## 🛠️ Technology Stack

| Category      | Technology                                                              |
|---------------|-------------------------------------------------------------------------|
| **Frontend**  | React, Vite, TypeScript, Tailwind CSS, Material UI (MUI), Recharts, Framer Motion |
| **Backend**   | Python, FastAPI, Uvicorn                                                |
| **ML/AI**     | Scikit-learn (XGBoost), Google Cloud Vertex AI (Prediction, Pipelines)    |
| **Database**  | Firebase Firestore (Real-time Data)                                     |
| **Deployment**| Google Cloud Run (Backend), Firebase Hosting (Frontend)                 |
| **DevOps**    | Docker, GitHub Actions (CI/CD planned)                                  |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+) and npm
- Python (v3.10+) and pip
- Google Cloud SDK (`gcloud`) installed and authenticated.
- A Google Cloud Project with **Vertex AI, Firestore, and Cloud Run** APIs enabled.

### 1. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env

# Add your Firebase project configuration and other keys to .env
# VITE_API_BASE_URL=http://localhost:8000/api
# VITE_FIREBASE_...

# Run the development server
npm run dev
```
The app will be available at `http://localhost:5173`.

### 2. Backend & AI Setup

The backend setup is a multi-step process involving model deployment and running the local API server.

1.  **Deploy the Model:** Follow the instructions in `BACKEND_ROADMAP.md` (Phase 1) to deploy the trained model to a **Vertex AI Endpoint**.
2.  **Configure the Backend:** Create the backend directory structure and files as outlined in `BACKEND_ROADMAP.md` (Phase 2).
3.  **Run the API Server:**
    ```bash
    # Navigate to the backend directory (once created)
    cd backend

    # Install Python dependencies
    pip install -r requirements.txt

    # Run the FastAPI server
    uvicorn app.main:app --reload
    ```
The API will be available at `http://localhost:8000`.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a pull request or open an issue to discuss your ideas.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.