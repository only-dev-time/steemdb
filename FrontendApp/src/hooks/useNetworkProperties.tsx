
import { useState, useEffect } from 'react';
import config from '@/config.json';

interface NetworkProperties {
  head_block_number: number;
  head_block_id: string;
  time: string;
  current_witness: string;
  total_pow: number;
  num_pow_witnesses: number;
  virtual_supply: string;
  current_supply: string;
  current_sbd_supply: string;
  total_vesting_fund_steem: string;
  total_vesting_shares: string;
  sbd_interest_rate: number;
  sbd_print_rate: number;
  maximum_block_size: number;
  participation_count: number;
  last_irreversible_block_num: number;
  available_account_subsidies: number;
  next_maintenance_time: string;
  last_budget_time: string;
  content_reward_percent: number;
  vesting_reward_percent: number;
  sps_fund_percent: number;
  downvote_pool_percent: number;
  steem_per_mvests: number;
  reversible_blocks: number;
}

export const useNetworkProperties = () => {
  const [properties, setProperties] = useState<NetworkProperties | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(config.wss_address);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.props) {
              setProperties(data.props);
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('WebSocket connection error');
          setIsConnected(false);
        };

        return ws;
      } catch (err) {
        console.error('Failed to connect to WebSocket:', err);
        setError('Failed to connect to WebSocket');
        return null;
      }
    };

    const ws = connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return { properties, isConnected, error };
};
