
import { useState, useEffect } from 'react';

interface OpenOrder {
  id: number;
  created: string;
  expiration: string;
  seller: string;
  orderid: number;
  order_type: 'buy' | 'sell';
  steem_amount: number;
  sbd_amount: number;
  price: number;
  description: string;
  raw_price: {
    base: string;
    quote: string;
  };
}

interface UserOrdersData {
  account: string;
  open_orders: OpenOrder[];
}

export const useUserOpenOrders = (username: string) => {
  const [userOrders, setUserOrders] = useState<UserOrdersData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setUserOrders(null);
      setError(null);
      return;
    }

    const fetchUserOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching open orders for user:', username);
        
        const response = await fetch(`https://blazerapi.museminted.com/market_api/get_open_orders?account=${username}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: UserOrdersData = await response.json();
        console.log('User orders data received:', data);
        setUserOrders(data);
        
      } catch (err) {
        console.error('Error fetching user orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user orders');
        setUserOrders(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserOrders();
  }, [username]);

  return { userOrders, isLoading, error };
};
