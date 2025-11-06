import { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy, limit } from '../services/firebase';
import { SensorData } from '../components/map/SensorMarker';

export const useRealtimeSensors = (collectionName: string = 'sensors', limitCount: number = 100) => {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setError('Firebase is not initialized. Please check your configuration.');
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, collectionName),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const sensorData: SensorData[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            sensorData.push({
              id: doc.id,
              lat: data.lat || 0,
              lng: data.lng || 0,
              pressure: data.pressure || 0,
              flow: data.flow || 0,
              temperature: data.temperature || 0,
              leak_probability: data.leak_probability || 0,
              timestamp: data.timestamp || new Date().toISOString(),
            });
          });
          setSensors(sensorData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Firestore error:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error('Hook error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName, limitCount]);

  return { sensors, loading, error };
};

export default useRealtimeSensors;
