
import { useQuery } from '@tanstack/react-query';
import config from '@/config.json';

interface OrderBookEntry {
  steem: number;
  sbd: number;
  price: number;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export const useOrderBookOptimized = () => {
  const { data: orderBookData, isLoading, error } = useQuery({
    queryKey: ['orderBook'],
    queryFn: async () => {
      const response = await fetch(`${config.blazer_api}/market_api/get_order_book`);
      if (!response.ok) {
        throw new Error('Failed to fetch order book');
      }
      return response.json() as Promise<OrderBookData>;
    },
    staleTime: 45 * 1000, // 45 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false, // Managed by useDataManager
    retry: 2,
  });

  const totalOpenOrders = orderBookData 
    ? orderBookData.bids.length + orderBookData.asks.length 
    : 0;

  return { orderBookData, isLoading, error: error?.message || null, totalOpenOrders };
};
