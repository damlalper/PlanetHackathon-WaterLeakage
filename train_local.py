
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
import xgboost as xgb
import joblib
from sklearn.utils import class_weight
import numpy as np

# --- 1. Veri Yükleme ve Ön İşleme ---

# CSV dosyasını oku
try:
    df = pd.read_csv("water_leak_data/water_leak_detection_1000_rows.csv")
except FileNotFoundError:
    print("Hata: 'water_leak_data/water_leak_detection_1000_rows.csv' dosyası bulunamadı.")
    print("Lütfen Kaggle'dan veri setini indirip doğru klasöre yerleştirdiğinizden emin olun.")
    exit()

# Features / Target
# "Burst Status" sütununu da özelliklerden çıkarıyoruz çünkü bu da bir sızıntı türü ve hedefle ilişkili olabilir.
X = df.drop(columns=["Leak Status", "Burst Status"])
y = df["Leak Status"]

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# --- Zaman Damgası ve Kategorik Özellikleri Dönüştürme ---

# Timestamp -> hour, day, month
X_train_enc = X_train.copy()
X_test_enc = X_test.copy()

if 'Timestamp' in X_train_enc.columns:
    X_train_enc['Timestamp'] = pd.to_datetime(X_train_enc['Timestamp'])
    X_test_enc['Timestamp'] = pd.to_datetime(X_test_enc['Timestamp'])

    X_train_enc['Hour'] = X_train_enc['Timestamp'].dt.hour
    X_train_enc['Day'] = X_train_enc['Timestamp'].dt.day
    X_train_enc['Month'] = X_train_enc['Timestamp'].dt.month

    X_train_enc = X_train_enc.drop(columns=['Timestamp'])
    X_test_enc = X_test_enc.drop(columns=['Timestamp'])

# Sensor_ID varsa one-hot encoding
if 'Sensor_ID' in X_train_enc.columns:
    X_train_enc = pd.get_dummies(X_train_enc, columns=['Sensor_ID'], drop_first=True)
    X_test_enc = pd.get_dummies(X_test_enc, columns=['Sensor_ID'], drop_first=True)

# One-hot encoding sonrası oluşabilecek sütun uyuşmazlığını giderme
train_cols = X_train_enc.columns
test_cols = X_test_enc.columns

missing_in_test = set(train_cols) - set(test_cols)
for c in missing_in_test:
    X_test_enc[c] = 0

missing_in_train = set(test_cols) - set(train_cols)
for c in missing_in_train:
    X_train_enc[c] = 0

X_test_enc = X_test_enc[train_cols] # Sütun sıralamasını eşitle

# Eğitimde kullanılan sütunları yazdır
print("Eğitimde kullanılan sütunlar:", X_train_enc.columns.tolist())

# --- Sınıf Dengesizliği için Ağırlık Hesaplama ---

# Calculate class weights (Bu kısım model tanımından önceye taşındı)
class_weights = class_weight.compute_class_weight(
    'balanced',
    classes=np.unique(y_train),
    y=y_train
)
class_weights_dict = dict(enumerate(class_weights))
print("Hesaplanan Sınıf Ağırlıkları:", class_weights_dict)

# XGBoost için scale_pos_weight hesapla
scale_pos_weight = class_weights_dict.get(1, 1.0) / class_weights_dict.get(0, 1.0)

# --- Modelleri Tanımlama ---

models = {
    "RandomForest": RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42, class_weight=class_weights_dict),
    "XGBoost": xgb.XGBClassifier(n_estimators=100, max_depth=5, use_label_encoder=False, eval_metric="logloss", scale_pos_weight=scale_pos_weight),
    "LogisticRegression": LogisticRegression(max_iter=500, random_state=42, class_weight=class_weights_dict)
}

# --- Lojistik Regresyon için Veri Ölçeklendirme ---

# Sadece Lojistik Regresyon için kullanılacak ölçeklenmiş veriler
scaler = StandardScaler()
# get_dummies sonrası oluşan tüm sütunları ölçeklendir
X_train_scaled = scaler.fit_transform(X_train_enc)
X_test_scaled = scaler.transform(X_test_enc)

# --- Modelleri Eğitme ve Değerlendirme ---

results = {}
for name, model in models.items():
    print(f"--- {name} Modeli Eğitiliyor ---")
    if name == "LogisticRegression":
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
    else:
        model.fit(X_train_enc, y_train)
        y_pred = model.predict(X_test_enc)

    acc = accuracy_score(y_test, y_pred)
    print(f"{name} Accuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred, zero_division=0))
    results[name] = acc

# --- En İyi Modeli Kaydetme ---

best_model_name = max(results, key=results.get)
print(f"En iyi model: {best_model_name} (Accuracy = {results[best_model_name]:.4f})")

best_model = models[best_model_name]

# Modeli kaydet
joblib.dump(best_model, f"{best_model_name}_water_leak_model.pkl")
print(f"Model '{best_model_name}_water_leak_model.pkl' olarak kaydedildi!")

# Eğer Logistic Regression en iyi ise scaler’ı da kaydet
if best_model_name == "LogisticRegression":
    joblib.dump(scaler, "scaler.pkl")
    print("Scaler 'scaler.pkl' olarak kaydedildi!")

# --- XGBoost Hiperparametre Ayarlaması (GridSearchCV) ---

print("--- XGBoost Hiperparametre Ayarlaması Başlatılıyor ---")
param_grid = {
    'max_depth': [3, 5, 7],
    'min_child_weight': [1, 3, 5],
    'subsample': [0.6, 0.8, 1.0],
    'colsample_bytree': [0.6, 0.8, 1.0]
}

xgb_model_grid = xgb.XGBClassifier(
    use_label_encoder=False,
    eval_metric="logloss",
    scale_pos_weight=scale_pos_weight,
    random_state=42
)

grid_search = GridSearchCV(
    estimator=xgb_model_grid,
    param_grid=param_grid,
    scoring='f1',
    cv=3,
    verbose=1,
    n_jobs=-1
)

grid_search.fit(X_train_enc, y_train)

print("En iyi hiperparametreler: ", grid_search.best_params_)
print("En iyi F1 skoru: ", grid_search.best_score_)

# En iyi parametrelerle modeli tekrar eğit ve değerlendir
best_xgb_model = grid_search.best_estimator_
y_pred_tuned_xgb = best_xgb_model.predict(X_test_enc)

acc_tuned_xgb = accuracy_score(y_test, y_pred_tuned_xgb)
print(f"Tuned XGBoost Accuracy: {acc_tuned_xgb:.4f}")
print(classification_report(y_test, y_pred_tuned_xgb, zero_division=0))

# Ayarlanmış modeli kaydet
joblib.dump(best_xgb_model, "XGBoost_tuned_water_leak_model.pkl")
print("Model 'XGBoost_tuned_water_leak_model.pkl' olarak kaydedildi!")
