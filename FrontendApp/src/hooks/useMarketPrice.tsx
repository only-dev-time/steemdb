import { useState, useEffect, useRef } from 'react';

interface MarketPriceData {
  symbol: string;
  last_price: number;
  high_24h: number;
  low_24h: number;
  open_24h: number;
  close_24h: number;
  volume_24h: number;
  change_24h: number;
}

export const useMarketPrice = () => {
  const [priceData, setPriceData] = useState<MarketPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<string>('');
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const fetchMarketPrice = async () => {
      try {
        // Only show loading for the initial fetch
        if (!priceData) {
          setIsLoading(true);
        }
        
        const response = await fetch('https://blazerapi.museminted.com/market_api/get_price');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: MarketPriceData = await response.json();
        const dataString = JSON.stringify(data);
        
        // Only update if data has actually changed
        if (dataString !== cacheRef.current) {
          cacheRef.current = dataString;
          lastUpdateRef.current = Date.now();
          setPriceData(data);
          setError(null);
        }
        
      } catch (err) {
        console.error('Error fetching market price:', err);
        setError('Failed to fetch market price');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketPrice();
    
    // Refresh price data every 60 seconds instead of 30
    const interval = setInterval(fetchMarketPrice, 60000);
    
    return () => clearInterval(interval);
  }, [priceData]);

  return { priceData, isLoading, error };
};
