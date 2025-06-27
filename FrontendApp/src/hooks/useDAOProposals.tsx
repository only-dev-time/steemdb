
import { useQuery } from '@tanstack/react-query';
import config from '@/config.json';

export interface DAOProposal {
  rank: number;
  id: number;
  proposal_id: number;
  creator: string;
  receiver: string;
  start_date: string;
  end_date: string;
  daily_pay: {
    amount: string;
    precision: number;
    nai: string;
  };
  subject: string;
  permlink: string;
  total_votes: string;
  status: string;
}

export const useDAOProposals = () => {
  return useQuery({
    queryKey: ['dao-proposals'],
    queryFn: async (): Promise<DAOProposal[]> => {
      const response = await fetch(`${config.blazer_api}/governance_api/governance_api/sps_proposals`);
      if (!response.ok) {
        throw new Error('Failed to fetch DAO proposals');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  });
};
