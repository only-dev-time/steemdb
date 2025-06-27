
import { useState, useEffect } from 'react';

export const useAccountCount = () => {
  const [accountCount, setAccountCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountCount = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.steemit.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'condenser_api.get_account_count',
            params: [],
            id: 1
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch account count');
        }

        const data = await response.json();
        setAccountCount(data.result);
        setError(null);
      } catch (err) {
        console.error('Error fetching account count:', err);
        setError('Failed to fetch account count');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountCount();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchAccountCount, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { accountCount, isLoading, error };
};
