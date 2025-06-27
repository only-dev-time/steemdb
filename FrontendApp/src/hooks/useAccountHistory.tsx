
import { useQuery } from '@tanstack/react-query';
import config from '../config.json';

interface HistoryEntry {
  trx_id: string;
  block: number;
  trx_in_block: number;
  op_in_trx: number;
  virtual_op: number;
  timestamp: string;
  op: {
    type: string;
    value: any;
  };
}

interface AccountHistoryResponse {
  account: string;
  start: number;
  limit: number;
  next_start: number;
  history: [number, HistoryEntry][];
}

export const useAccountHistory = (username: string, start: number = -1, limit: number = 30) => {
  return useQuery<AccountHistoryResponse>({
    queryKey: ['account-history', username, start, limit],
    queryFn: async () => {
      const response = await fetch(
        `${config.blazer_api}/accounts_api/getAccountHistory/${username}?limit=${limit}&start=${start}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch account history');
      }
      return response.json();
    },
    enabled: !!username,
  });
};
