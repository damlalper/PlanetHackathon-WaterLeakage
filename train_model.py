import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE

# Load the dataset
df = pd.read_csv('water_leak_data/water_leak_detection_1000_rows.csv')

# Preprocessing
# Convert Timestamp to datetime objects
df['Timestamp'] = pd.to_datetime(df['Timestamp'])

# Extract features from Timestamp
df['hour'] = df['Timestamp'].dt.hour
df['dayofweek'] = df['Timestamp'].dt.dayofweek

# Drop original Timestamp and Sensor_ID
df = df.drop(['Timestamp', 'Sensor_ID'], axis=1)

# Define features (X) and target (y)
X = df.drop(['Leak Status', 'Burst Status'], axis=1)
y_leak = df['Leak Status']
y_burst = df['Burst Status']

# Oversample using SMOTE for leak detection
smote = SMOTE(random_state=42)
X_leak_res, y_leak_res = smote.fit_resample(X, y_leak)

# Split data for leak detection
X_train_leak, X_test_leak, y_train_leak, y_test_leak = train_test_split(X_leak_res, y_leak_res, test_size=0.2, random_state=42)

# Train a RandomForestClassifier for leak detection
leak_model = RandomForestClassifier(n_estimators=100, random_state=42)
leak_model.fit(X_train_leak, y_train_leak)

# Predictions
leak_preds = leak_model.predict(X_test_leak)

# Evaluate the model
print("Leak Detection Model Performance (with SMOTE):")
print(f"Accuracy: {accuracy_score(y_test_leak, leak_preds)}")
print(classification_report(y_test_leak, leak_preds))

# Oversample using SMOTE for burst detection
X_burst_res, y_burst_res = smote.fit_resample(X, y_burst)

# Split data for burst detection
X_train_burst, X_test_burst, y_train_burst, y_test_burst = train_test_split(X_burst_res, y_burst_res, test_size=0.2, random_state=42)

# Train a RandomForestClassifier for burst detection
burst_model = RandomForestClassifier(n_estimators=100, random_state=42)
burst_model.fit(X_train_burst, y_train_burst)

# Predictions
burst_preds = burst_model.predict(X_test_burst)

# Evaluate the model
print("\nBurst Detection Model Performance (with SMOTE):")
print(f"Accuracy: {accuracy_score(y_test_burst, burst_preds)}")
print(classification_report(y_test_burst, burst_preds))