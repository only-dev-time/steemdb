
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
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
  trade_type: 'buy' | 'sell';
  price: number;
  steem: number;
  sbd: number;
}

interface RecentTradesResponse {
  trades: APITrade[];
  count: number;
}

export const useRecentTradesOptimized = () => {
  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ['recentTrades'],
    queryFn: async () => {
      const response = await fetch(`${config.blazer_api}/market_api/get_recent_trades?limit=50`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent trades');
      }
      return response.json() as Promise<RecentTradesResponse>;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false, // Managed by useDataManager
    retry: 2,
  });

  // Memoize the transformed trades to avoid recalculation on every render
  const trades = useMemo(() => {
    if (!rawData?.trades) return [];
    
    return rawData.trades.map((trade: APITrade): RecentTrade => ({
      timestamp: trade.date,
      price: trade.price,
      amount: trade.steem,
      total: trade.sbd,
      type: trade.trade_type
    }));
  }, [rawData]);

  return { trades, isLoading, error: error?.message || null };
};
