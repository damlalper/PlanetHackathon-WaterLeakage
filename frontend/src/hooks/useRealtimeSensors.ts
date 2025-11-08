import { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy, limit } from '../services/firebase';
import { SensorData } from '../components/map/SensorMarker';
import { mockSensors } from '../data/mockSensorData';

export const useRealtimeSensors = (collectionName: string = 'sensors', limitCount: number = 100) => {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use mock data if Firebase is not configured
    const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY &&
                                  import.meta.env.VITE_FIREBASE_API_KEY !== '';

    console.log('[useRealtimeSensors] Firebase configured:', isFirebaseConfigured);
    console.log('[useRealtimeSensors] DB instance:', db ? 'exists' : 'null');

    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase not configured, using mock data');
      setSensors(mockSensors);
      setLoading(false);
      setError(null);
      return;
    }

    console.log('[useRealtimeSensors] Setting up Firestore listener for collection:', collectionName);

    try {
      // Try without orderBy first to see if we can get any data
      const q = query(
        collection(db, collectionName),
        limit(limitCount)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log('[useRealtimeSensors] Snapshot received. Size:', snapshot.size);
          const sensorData: SensorData[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            console.log('[useRealtimeSensors] Document:', doc.id, data);
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
          console.log('[useRealtimeSensors] Total sensors loaded:', sensorData.length);
          setSensors(sensorData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('[useRealtimeSensors] Firestore error:', err);
          console.error('[useRealtimeSensors] Error code:', err.code);
          console.error('[useRealtimeSensors] Error message:', err.message);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error('[useRealtimeSensors] Hook error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [collectionName, limitCount]);

  return { sensors, loading, error };
};

export default useRealtimeSensors;
