import random
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.firestore import firestore_service

# New York koordinatları civarında 10 sensör
SENSORS = [
    {'id': 'S001', 'lat': 40.7580, 'lng': -73.9855},
    {'id': 'S002', 'lat': 40.7589, 'lng': -73.9851},
    {'id': 'S003', 'lat': 40.7571, 'lng': -73.9876},
    {'id': 'S004', 'lat': 40.7595, 'lng': -73.9842},
    {'id': 'S005', 'lat': 40.7565, 'lng': -73.9868},
    {'id': 'S006', 'lat': 40.7602, 'lng': -73.9838},
    {'id': 'S007', 'lat': 40.7558, 'lng': -73.9882},
    {'id': 'S008', 'lat': 40.7612, 'lng': -73.9825},
]

def generate_sensor_reading(sensor, has_leak=False):
    if has_leak:
        pressure = random.uniform(40, 55)  # Low pressure
        flow = random.uniform(70, 95)      # Low flow
        leak_prob = random.uniform(0.7, 0.95)
    else:
        pressure = random.uniform(60, 75)  # Normal pressure
        flow = random.uniform(110, 140)    # Normal flow
        leak_prob = random.uniform(0.05, 0.3)

    return {
        'id': sensor['id'],
        'lat': sensor['lat'],
        'lng': sensor['lng'],
        'pressure': pressure,
        'flow': flow,
        'temperature': random.uniform(18, 26),
        'leak_probability': leak_prob,
        'timestamp': datetime.now().isoformat()
    }

def add_test_data():
    print("Adding test data to Firestore...")

    for sensor in SENSORS:
        # %30 ihtimalle leak simüle et
        has_leak = random.random() < 0.3

        reading = generate_sensor_reading(sensor, has_leak)

        # Firestore'a kaydet
        firestore_service.db.collection('sensors').document(sensor['id']).set(reading)

        status = "[LEAK]" if has_leak else "[OK]"
        print(f"{status} - {sensor['id']}: P={reading['pressure']:.1f} F={reading['flow']:.1f} Leak={reading['leak_probability']:.2f}")

    print(f"\nSuccessfully added {len(SENSORS)} sensors to Firestore!")
    print(f"Database: {firestore_service.database_id}")
    print(f"Collection: sensors")

if __name__ == "__main__":
    add_test_data()
