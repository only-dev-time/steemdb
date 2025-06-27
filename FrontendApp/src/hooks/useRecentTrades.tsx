
import { useState, useEffect, useRef } from 'react';
import config from '@/config.json';

interface RecentTrade {
  timestamp: string;
  price: number;
  amount: number;
  total: number;
  type: 'buy' | 'sell';
}

interface APITrade {
  date: string;
  price: number;
  steem: number;
  sbd: number;
}

interface RecentTradesResponse {
  trades: APITrade[];
  count: number;
}

export const useRecentTrades = () => {
  const [trades, setTrades] = useState<RecentTrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<string>('');

  useEffect(() => {
    const fetchRecentTrades = async () => {
      try {
        if (trades.length === 0) {
          setIsLoading(true);
        }
        
        console.log('Fetching recent trades data...');
        
        const response = await fetch(`${config.blazer_api}/market_api/get_recent_trades?limit=75`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: RecentTradesResponse = await response.json();
        const dataString = JSON.stringify(result.trades);
        
        // Only update if data has actually changed
        if (dataString !== cacheRef.current) {
          console.log('Recent trades data changed, updating...');
          cacheRef.current = dataString;
          
          // Transform API data to match our interface
          const transformedTrades: RecentTrade[] = result.trades.map((trade: APITrade) => ({
            timestamp: trade.date,
            price: trade.price,
            amount: trade.steem,
            total: trade.sbd,
            type: 'buy' as const // We'll assume all trades are buys since API doesn't specify
          }));
          
          setTrades(transformedTrades);
          setError(null);
        } else {
          console.log('Recent trades data unchanged, skipping update');
        }
        
      } catch (err) {
        console.error('Error fetching recent trades:', err);
        setError('Failed to fetch recent trades');
        // Fall back to empty array if API fails
        setTrades([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTrades();
    
    // Refresh recent trades every 30 seconds
    const interval = setInterval(fetchRecentTrades, 30000);
    
    return () => clearInterval(interval);
  }, []); // Remove trades.length dependency to avoid the error

  return { trades, isLoading, error };
};
