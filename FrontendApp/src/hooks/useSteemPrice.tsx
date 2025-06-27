
import { useState, useEffect, useRef } from 'react';

interface SteemPriceData {
  symbol: string;
  open: string;
  low: string;
  high: string;
  close: string;
  quantity: string;
  amount: string;
  tradeCount: number;
  startTime: number;
  closeTime: number;
  displayName: string;
  dailyChange: string;
  bid: string;
  bidQuantity: string;
  ask: string;
  askQuantity: string;
  ts: number;
  markPrice: string;
}

export const useSteemPrice = () => {
  const [priceData, setPriceData] = useState<SteemPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<string>('');
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const fetchSteemPrice = async () => {
      try {
        // Only show loading for the initial fetch
        if (!priceData) {
          setIsLoading(true);
        }
        
        console.log('Fetching STEEM price data...');
        
        // Try multiple CORS proxy services in order
        const corsProxies = [
          'https://api.codetabs.com/v1/proxy?quest=',
          'https://cors-anywhere.herokuapp.com/',
          'https://api.allorigins.win/raw?url='
        ];
        
        const apiUrl = 'https://api.poloniex.com/markets/STEEM_USDT/ticker24h';
        
        let lastError = null;
        
        for (const proxy of corsProxies) {
          try {
            console.log(`Trying proxy: ${proxy}`);
            const response = await fetch(`${proxy}${encodeURIComponent(apiUrl)}`, {
              headers: {
                'Accept': 'application/json',
              }
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: SteemPriceData = await response.json();
            const dataString = JSON.stringify(data);
            
            // Only update if data has actually changed
            if (dataString !== cacheRef.current) {
              console.log('STEEM price data changed, updating...');
              cacheRef.current = dataString;
              lastUpdateRef.current = Date.now();
              setPriceData(data);
              setError(null);
            } else {
              console.log('STEEM price data unchanged, skipping update');
            }
            return; // Success, exit the loop
            
          } catch (err) {
            console.warn(`Proxy ${proxy} failed:`, err);
            lastError = err;
            continue; // Try next proxy
          }
        }
        
        // If all proxies failed, throw the last error
        throw lastError || new Error('All CORS proxies failed');
        
      } catch (err) {
        console.error('Error fetching STEEM price:', err);
        setError('Failed to fetch STEEM price');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSteemPrice();
    
    // Refresh price data every 60 seconds instead of 30
    const interval = setInterval(fetchSteemPrice, 60000);
    
    return () => clearInterval(interval);
  }, [priceData]);

  return { priceData, isLoading, error };
};
