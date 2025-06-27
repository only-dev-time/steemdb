
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import config from '@/config.json';

interface BlockData {
  _id: string;
  block_num: number;
  timestamp: string;
  previous: string;
  witness: string;
  witness_signature: string;
  transactions_count: number;
}

interface BlocksResponse {
  page: number;
  limit: number;
  total_blocks: number;
  blocks: BlockData[];
}

export const useBlocks = (limit: number = 30, lastBlockNum?: number) => {
  const fetchBlocks = async (): Promise<BlocksResponse> => {
    let url = `${config.blazer_api}/blocks_api/getBlocks?limit=${limit}&with_transactions=false`;
    
    if (lastBlockNum) {
      url += `&last_block_num=${lastBlockNum}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch blocks');
    }
    
    return response.json();
  };

  return useQuery({
    queryKey: ['blocks', limit, lastBlockNum],
    queryFn: fetchBlocks,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};
