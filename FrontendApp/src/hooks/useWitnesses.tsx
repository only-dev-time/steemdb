
import { useQuery } from '@tanstack/react-query';
import config from '@/config.json';

interface WitnessData {
  rank: number;
  _id: string;
  created: string;
  account_creation_fee: string;
  maximum_block_size: number;
  sbd_interest_rate: number;
  running_version: string;
  sbd_exchange_rate: {
    base: string;
    quote: string;
  };
  signing_key: string;
  url: string;
  total_missed: number;
  votes: number;
  last_feed_publish: string;
}

export const useWitnesses = () => {
  return useQuery({
    queryKey: ['witnesses'],
    queryFn: async (): Promise<WitnessData[]> => {
      const response = await fetch(`${config.blazer_api}/governance_api/governance_api/witnesses`);
      if (!response.ok) {
        throw new Error('Failed to fetch witnesses');
      }
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
