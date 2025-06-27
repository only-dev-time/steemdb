
import { useQuery } from '@tanstack/react-query';
import config from '@/config.json';

interface TransactionOperation {
  type: string;
  data: any;
}

interface TransactionDetails {
  ref_block_num: number;
  ref_block_prefix: number;
  expiration: string;
  signatures: string[];
  extensions: any[];
}

interface TransactionData {
  transaction_id: string;
  block_num: number;
  transaction_num: number;
  operations: TransactionOperation[];
  details: TransactionDetails;
}

export const useTransactionDetails = (transactionId: string | undefined) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async (): Promise<TransactionData> => {
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }
      
      const response = await fetch(`${config.blazer_api}/blocks_api/getTransactions?transaction_id=${transactionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction details');
      }
      
      return response.json();
    },
    enabled: !!transactionId,
    staleTime: 60000, // Cache for 1 minute
  });
};
