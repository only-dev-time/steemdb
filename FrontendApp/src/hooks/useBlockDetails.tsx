import { useQuery } from '@tanstack/react-query';
import config from '@/config.json';

interface Operation {
  [key: string]: any;
}

interface Transaction {
  ref_block_num: number;
  ref_block_prefix: number;
  expiration: string;
  operations: [string, Operation][];
  extensions: any[];
  signatures: string[];
  transaction_id: string;
  block_num: number;
  transaction_num: number;
}

interface VirtualOperation {
  trx_id: string;
  block: number;
  trx_in_block: number;
  op_in_trx: number;
  virtual_op: number;
  timestamp: string;
  op: [string, Operation];
}

interface BlockDetailsData {
  block_num: number;
  block_id: string;
  transactions_count: number;
  transactions: Transaction[];
  witness: string;
  witness_signature: string;
  previous: string;
  timestamp: string;
  virtual_ops: VirtualOperation[];
}

export const useBlockDetails = (blockNumber: string | undefined) => {
  const fetchBlockDetails = async (): Promise<BlockDetailsData> => {
    if (!blockNumber) {
      throw new Error('Block number is required');
    }
    
    const url = `${config.blazer_api}/blocks_api/getBlockDetails?block_num=${blockNumber}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch block details: ${response.status}`);
    }
    
    return response.json();
  };

  return useQuery({
    queryKey: ['blockDetails', blockNumber],
    queryFn: fetchBlockDetails,
    enabled: !!blockNumber,
    staleTime: 60000, // 1 minute
  });
};
