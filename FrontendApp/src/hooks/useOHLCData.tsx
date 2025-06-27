
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import config from '@/config.json';

interface OHLCDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface OHLCResponse {
  data: OHLCDataPoint[];
}

interface UseOHLCDataProps {
  timeframe: string;
}

const getTimeframeParams = (timeframe: string) => {
  switch (timeframe) {
    case '15s':
      return { bucket_size: 15, hours: 6 }; // 15-second candles for 6 hours
    case '1m':
      return { bucket_size: 60, hours: 24 }; // 1-minute candles for 24 hours
    case '5m':
      return { bucket_size: 300, hours: 48 }; // 5-minute candles for 48 hours
    case '1h':
      return { bucket_size: 3600, hours: 168 }; // 1-hour candles for 1 week
    case '6h':
      return { bucket_size: 21600, hours: 720 }; // 6-hour candles for 30 days
    default:
      return { bucket_size: 3600, hours: 168 }; // Default to 1-hour
  }
};

export const useOHLCData = ({ timeframe }: UseOHLCDataProps) => {
  const { bucket_size, hours } = getTimeframeParams(timeframe);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['ohlc', timeframe, bucket_size, hours],
    queryFn: async () => {
      const response = await fetch(
        `${config.blazer_api}/market_api/ohlc?bucket_size=${bucket_size}&hours=${hours}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch OHLC data');
      }
      
      const result: OHLCResponse = await response.json();
      return result.data;
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Transform data for chart consumption
  const chartData = data?.map((item, index) => {
    const date = new Date(item.timestamp);
    let timeLabel: string;
    
    // Format time labels based on timeframe
    if (timeframe === '15s') {
      timeLabel = date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    } else if (timeframe === '1m' || timeframe === '5m') {
      timeLabel = date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (timeframe === '1h') {
      timeLabel = date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (timeframe === '6h') {
      timeLabel = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } else {
      timeLabel = date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: '2-digit' 
      });
    }

    return {
      time: timeLabel,
      timestamp: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      price: item.close, // For line chart
    };
  }) || [];

  return {
    data: chartData,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};
