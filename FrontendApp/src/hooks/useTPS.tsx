
import { useState, useEffect, useRef, useCallback } from 'react';
import config from '@/config.json';

interface TPSData {
  tps_1h: number;
  tps_1d: number;
  tps_1w: number;
  tps_1m: number;
  tps_1y: number;
  tps_all_time: number;
}

export const useTPS = () => {
  const [tpsData, setTpsData] = useState<TPSData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<string>('');
  const lastUpdateRef = useRef<number>(0);
  const controllerRef = useRef<AbortController>();

  const fetchTPS = useCallback(async () => {
    // Cancel previous request if still pending
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    controllerRef.current = new AbortController();
    
    try {
      if (!tpsData) setIsLoading(true);
      
      const response = await fetch(`${config.blazer_api}/blocks_api/getTPS`, {
        signal: controllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Failed to fetch TPS data');
      }

      const data = await response.json();
      const dataString = JSON.stringify(data);
      
      // Only update if data has actually changed
      if (dataString !== cacheRef.current) {
        cacheRef.current = dataString;
        lastUpdateRef.current = Date.now();
        setTpsData(data);
        setError(null);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching TPS data:', err);
        setError('Failed to fetch TPS data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [tpsData]);

  useEffect(() => {
    fetchTPS();
    
    // Increase interval to 2 minutes for better performance
    const interval = setInterval(fetchTPS, 2 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [fetchTPS]);

  return { tpsData, isLoading, error };
};
