
import { useState, useEffect, useCallback, useRef } from 'react';
import config from '@/config.json';

interface BlockData {
  height: number;
  accounts: string[];
  opCount: number;
  opTypes: string[];
  ts: string;
  opCounts: Record<string, number>;
}

interface RealtimeBlock {
  number: number;
  timestamp: string;
  transactions: number;
  opTypes: string[];
  opCounts: Record<string, number>;
  timeAgo: string;
  id: string;
}

export const useRealtimeBlocks = () => {
  const [blocks, setBlocks] = useState<RealtimeBlock[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const messageQueueRef = useRef<any[]>([]);
  const processingRef = useRef(false);

  const formatTimeAgo = useCallback((timestamp: string) => {
    const now = new Date();
    const blockTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - blockTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  }, []);

  // Debounced message processing to prevent UI blocking
  const processMessageQueue = useCallback(() => {
    if (processingRef.current || messageQueueRef.current.length === 0) return;
    
    processingRef.current = true;
    const messages = [...messageQueueRef.current];
    messageQueueRef.current = [];

    // Process multiple messages at once
    const newBlocks: RealtimeBlock[] = [];
    
    messages.forEach(data => {
      if (data.block) {
        const blockData: BlockData = data.block;
        const utcTime = new Date(blockData.ts + 'Z');
        const localTime = new Date(utcTime.getTime());
        
        const newBlock: RealtimeBlock = {
          number: blockData.height,
          timestamp: localTime.toISOString(),
          transactions: blockData.opCount,
          opTypes: blockData.opTypes,
          opCounts: blockData.opCounts,
          timeAgo: formatTimeAgo(localTime.toISOString()),
          id: `${blockData.height}-${blockData.ts}`
        };
        
        newBlocks.push(newBlock);
      }
    });

    if (newBlocks.length > 0) {
      setBlocks(prevBlocks => {
        const existingNumbers = new Set(prevBlocks.map(b => b.number));
        const uniqueNewBlocks = newBlocks.filter(b => !existingNumbers.has(b.number));
        
        if (uniqueNewBlocks.length === 0) return prevBlocks;
        
        return [...uniqueNewBlocks, ...prevBlocks].slice(0, 16);
      });
    }
    
    processingRef.current = false;
  }, [formatTimeAgo]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(config.wss_address);
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          messageQueueRef.current.push(data);
          
          // Debounce processing to every 100ms
          setTimeout(processMessageQueue, 100);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
        
        // Exponential backoff for reconnection
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
        setIsConnected(false);
      };
    } catch (err) {
      console.error('Failed to connect to WebSocket:', err);
      setError('Failed to connect to WebSocket');
    }
  }, [processMessageQueue]);

  useEffect(() => {
    connectWebSocket();

    // Optimize time updates to every 60 seconds instead of 30
    const timeUpdateInterval = setInterval(() => {
      setBlocks(prevBlocks => 
        prevBlocks.map(block => ({
          ...block,
          timeAgo: formatTimeAgo(block.timestamp)
        }))
      );
    }, 60000);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      clearInterval(timeUpdateInterval);
      messageQueueRef.current = [];
    };
  }, [connectWebSocket, formatTimeAgo]);

  return { blocks, isConnected, error };
};
