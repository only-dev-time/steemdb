
import { useQuery } from '@tanstack/react-query';
import config from '@/config.json';

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

export const useMarketPriceOptimized = () => {
  const { data: priceData, isLoading, error } = useQuery({
    queryKey: ['marketPrice'],
    queryFn: async () => {
      const response = await fetch(`${config.blazer_api}/market_api/get_price`);
      if (!response.ok) {
        throw new Error('Failed to fetch market price');
      }
      return response.json() as Promise<MarketPriceData>;
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false, // Disable automatic refetch, managed by useDataManager
    retry: 2,
  });

  return { priceData, isLoading, error: error?.message || null };
};
