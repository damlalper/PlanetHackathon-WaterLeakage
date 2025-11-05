
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI()

# Modeli ve Gerekli Nesneleri Yükle
try:
    model = joblib.load("XGBoost_tuned_water_leak_model.pkl")
except FileNotFoundError:
    print("Model dosyası 'XGBoost_tuned_water_leak_model.pkl' bulunamadı.")
    model = None # Modeli None olarak ayarla ki uygulama çökmesin

# Orijinal eğitim sütunları (train_local.py çıktısından alındı)
# Bu sıranın ve isimlerin modelin eğitildiği sırayla aynı olması KRİTİKTİR.
training_columns = [
    'Pressure (bar)', 'Flow Rate (L/s)', 'Temperature (°C)', 'Hour', 'Day', 'Month',
    'Sensor_ID_S002', 'Sensor_ID_S003', 'Sensor_ID_S004', 'Sensor_ID_S005',
    'Sensor_ID_S006', 'Sensor_ID_S007', 'Sensor_ID_S008', 'Sensor_ID_S009', 'Sensor_ID_S010'
]

# Pydantic modeli: API'den gelecek ham veriyi tanımlar
class SensorData(BaseModel):
    Timestamp: str  # Örn: "2024-01-01 00:10:00"
    Sensor_ID: str  # Örn: "S002"
    Pressure_bar: float
    Flow_Rate_Ls: float
    Temperature_C: float

@app.post("/predict")
def predict(data: SensorData):
    if model is None:
        return {"error": "Model is not loaded. Please check the model file."}

    # Gelen veriyi bir pandas DataFrame'e dönüştür
    input_df = pd.DataFrame([data.dict()])

    # --- Gelen Veriyi Modelin Beklediği Formata Dönüştürme ---

    # 1. Sütun isimlerini modelin beklediğiyle eşleştir
    input_df.rename(columns={
        'Pressure_bar': 'Pressure (bar)',
        'Flow_Rate_Ls': 'Flow Rate (L/s)',
        'Temperature_C': 'Temperature (°C)'
    }, inplace=True)

    # 2. Timestamp özelliğini işle
    input_df['Timestamp'] = pd.to_datetime(input_df['Timestamp'])
    input_df['Hour'] = input_df['Timestamp'].dt.hour
    input_df['Day'] = input_df['Timestamp'].dt.day
    input_df['Month'] = input_df['Timestamp'].dt.month

    # 3. Sensor_ID için one-hot encoding uygula
    # Gelen tek bir sensör ID'si için doğru one-hot vektörünü oluştur
    for col in training_columns:
        if col.startswith('Sensor_ID_'):
            sensor_id_from_col = col.split('_')[-1]
            if data.Sensor_ID.endswith(sensor_id_from_col):
                input_df[col] = 1
            else:
                input_df[col] = 0

    # 4. Modelin beklediği sütun sırasını ve varlığını garantile
    final_df = pd.DataFrame(columns=training_columns)
    final_df = pd.concat([final_df, input_df[training_columns]], ignore_index=True)
    final_df.fillna(0, inplace=True) # Eksik kalan one-hot sütunlarını 0 ile doldur

    # Tahmin yap
    try:
        prediction = model.predict(final_df)
        probability = model.predict_proba(final_df)

        leak_status = int(prediction[0])
        leak_probability = float(probability[0][1]) # Sızıntı olma olasılığı (class 1)

        return {
            "leak_status_prediction": leak_status,
            "leak_probability": round(leak_probability, 4)
        }
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

@app.get("/")
def read_root():
    return {"message": "Water Leakage Prediction API is running. Use the /predict endpoint to get predictions."}

# Uygulamayı çalıştırmak için terminalde şu komutu kullanın:
# uvicorn main:app --reload
