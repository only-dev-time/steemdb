
import { useState, useEffect, useRef } from 'react';

interface OrderBookEntry {
  steem: number;
  sbd: number;
  price: number;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export const useOrderBook = () => {
  const [orderBookData, setOrderBookData] = useState<OrderBookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<string>('');
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        // Only show loading for the initial fetch
        if (!orderBookData) {
          setIsLoading(true);
        }
        
        console.log('Fetching order book data...');
        
        const response = await fetch('https://blazerapi.museminted.com/market_api/get_order_book');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: OrderBookData = await response.json();
        const dataString = JSON.stringify(data);
        
        // Only update if data has actually changed
        if (dataString !== cacheRef.current) {
          console.log('Order book data changed, updating...');
          cacheRef.current = dataString;
          lastUpdateRef.current = Date.now();
          setOrderBookData(data);
          setError(null);
        } else {
          console.log('Order book data unchanged, skipping update');
        }
        
      } catch (err) {
        console.error('Error fetching order book:', err);
        setError('Failed to fetch order book');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderBook();
    
    // Refresh order book data every 30 seconds instead of 10
    const interval = setInterval(fetchOrderBook, 30000);
    
    return () => clearInterval(interval);
  }, [orderBookData]);

  const totalOpenOrders = orderBookData 
    ? orderBookData.bids.length + orderBookData.asks.length 
    : 0;

  return { orderBookData, isLoading, error, totalOpenOrders };
};
