# Water Leak Detection Dashboard - Frontend

A modern, responsive React dashboard for real-time water leak detection and monitoring using Google Cloud AI.

## Features

- **Dashboard Overview**: Real-time KPI cards, time-series charts, and system status visualization
- **Interactive Map**: Google Maps integration with sensor markers and leak detection alerts
- **Analytics**: Advanced data analysis with scatter plots, confidence distribution, and temporal trends
- **Model Insights**: XGBoost model performance metrics, confusion matrix, and SHAP feature importance
- **Admin Settings**: Configurable detection thresholds, notification preferences, and API settings
- **Real-time Updates**: Firebase Firestore integration for live sensor data
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Mobile-friendly interface with Material Design 3.0

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material-UI (MUI)** for UI components
- **Tailwind CSS** for utility-first styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Framer Motion** for animations
- **Firebase** for real-time data
- **Axios** for API calls
- **React Hot Toast** for notifications

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Maps API key
- Firebase project credentials
- Backend API running (FastAPI)

### Installation

1. Clone the repository and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
# ... other Firebase credentials
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

The build output will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/         # Sidebar, Topbar
│   │   ├── kpi/            # KPI cards
│   │   ├── charts/         # Chart components
│   │   ├── map/            # Map markers
│   │   └── ui/             # Theme provider
│   ├── pages/              # Main page components
│   ├── services/           # API and Firebase
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
└── package.json
```

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase hosting:
```bash
firebase init hosting
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

## Configuration

### Leak Detection Threshold

Adjust the threshold in Admin Settings (default: 70%). Predictions above this value trigger alerts.

### Data Refresh Interval

Configure how often to fetch new sensor data (default: 30 seconds).

### Notifications

Enable/disable email, SMS, and push notifications in Admin Settings.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API endpoint | Yes |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |
| `VITE_FIREBASE_API_KEY` | Firebase API key | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID | Yes |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Yes |

## License

MIT
