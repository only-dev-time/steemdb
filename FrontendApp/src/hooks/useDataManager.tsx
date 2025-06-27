
import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface DataManagerState {
  isRefreshing: boolean;
  lastRefresh: number;
}

export const useDataManager = () => {
  const [state, setState] = useState<DataManagerState>({
    isRefreshing: false,
    lastRefresh: 0
  });
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Stagger API refreshes to avoid simultaneous calls
    const refreshData = async () => {
      setState(prev => ({ ...prev, isRefreshing: true }));
      
      try {
        // Refresh market data first
        await queryClient.refetchQueries({ queryKey: ['marketPrice'] });
        
        // Wait 2 seconds before next batch
        await new Promise(resolve => setTimeout(resolve, 2000));
        await queryClient.refetchQueries({ queryKey: ['orderBook'] });
        
        // Wait 2 seconds before next batch
        await new Promise(resolve => setTimeout(resolve, 2000));
        await queryClient.refetchQueries({ queryKey: ['recentTrades'] });
        
        // Wait 2 seconds before next batch
        await new Promise(resolve => setTimeout(resolve, 2000));
        await queryClient.refetchQueries({ queryKey: ['tps'] });

      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        setState(prev => ({ 
          ...prev, 
          isRefreshing: false,
          lastRefresh: Date.now()
        }));
      }
    };

    // Initial refresh after 1 second
    const initialTimeout = setTimeout(refreshData, 1000);
    
    // Set up staggered refresh every 2 minutes
    intervalRef.current = setInterval(refreshData, 120000);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [queryClient]);

  return state;
};
