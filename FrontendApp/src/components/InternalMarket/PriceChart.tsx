
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useOHLCData } from '@/hooks/useOHLCData';

interface PriceChartProps {
  chartType: 'candles' | 'line';
  timeframe: string;
}

// Custom candlestick component without volume
const CandlestickChart = ({ data, config }: { data: any[], config: any }) => {
  if (!data.length) return <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>;
  
  // Calculate price range for scaling
  const prices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;
  
  const yMin = minPrice - padding;
  const yMax = maxPrice + padding;
  const yRange = yMax - yMin;
  
  // Chart dimensions (removed volume section)
  const chartHeight = 450; // Full height for price chart only
  
  return (
    <div className="w-full h-full relative">
      <svg width="100%" height="100%" viewBox={`0 0 800 ${chartHeight + 50}`} className="overflow-visible">
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        
        {/* Background grid */}
        <rect width="100%" height={chartHeight} fill="url(#grid)" />
        
        {/* Y-axis labels for price */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = chartHeight * (1 - ratio);
          const price = yMin + (yRange * ratio);
          return (
            <g key={i}>
              <line
                x1={60}
                y1={y}
                x2={800}
                y2={y}
                stroke="hsl(var(--border))"
                strokeDasharray="2,2"
                opacity={0.3}
              />
              <text
                x={50}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="hsl(var(--muted-foreground))"
              >
                {price.toFixed(6)}
              </text>
            </g>
          );
        })}
        
        {/* Candlesticks */}
        <g transform="translate(60,0)">
          {data.map((candle, index) => {
            const x = (index * (740 / data.length)) + (740 / data.length / 2);
            const candleWidth = Math.max(2, (740 / data.length) * 0.6);
            
            const isGreen = candle.close >= candle.open;
            const color = isGreen ? "#10b981" : "#ef4444";
            
            // Calculate Y positions (inverted because SVG Y grows downward)
            const highY = chartHeight * (1 - ((candle.high - yMin) / yRange));
            const lowY = chartHeight * (1 - ((candle.low - yMin) / yRange));
            const openY = chartHeight * (1 - ((candle.open - yMin) / yRange));
            const closeY = chartHeight * (1 - ((candle.close - yMin) / yRange));
            
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);
            const bodyX = x - candleWidth / 2;
            
            return (
              <g key={index}>
                {/* Wick (high-low line) */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth={1}
                />
                {/* Body - Both green and red candles are filled */}
                <rect
                  x={bodyX}
                  y={bodyTop}
                  width={candleWidth}
                  height={Math.max(1, bodyHeight)}
                  fill={color}
                  stroke={color}
                  strokeWidth={1}
                />
              </g>
            );
          })}
        </g>
        
        {/* X-axis labels */}
        <g transform="translate(60,0)">
          {data.map((candle, index) => {
            if (index % Math.ceil(data.length / 8) === 0) {
              const x = (index * (740 / data.length)) + (740 / data.length / 2);
              return (
                <text
                  key={index}
                  x={x}
                  y={chartHeight + 30}
                  textAnchor="middle"
                  fontSize="10"
                  fill="hsl(var(--muted-foreground))"
                >
                  {candle.time}
                </text>
              );
            }
            return null;
          })}
        </g>
      </svg>
    </div>
  );
};

const PriceChart = ({ chartType, timeframe }: PriceChartProps) => {
  const { data, isLoading, error } = useOHLCData({ timeframe });

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--primary))",
    },
    open: {
      label: "Open",
      color: "hsl(var(--muted-foreground))",
    },
    high: {
      label: "High",
      color: "hsl(142, 76%, 36%)", // Green
    },
    low: {
      label: "Low",
      color: "hsl(0, 84%, 60%)", // Red
    },
    close: {
      label: "Close",
      color: "hsl(var(--primary))",
    },
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-destructive text-lg font-medium">Failed to load chart data</p>
          <p className="text-muted-foreground text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!data || data.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-muted-foreground text-lg">No chart data available</p>
          <p className="text-muted-foreground/70 text-sm mt-1">Try selecting a different timeframe</p>
        </div>
      </div>
    );
  }

  if (chartType === 'line') {
    return (
      <div className="h-[500px]">
        <ChartContainer config={chartConfig} className="h-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              domain={['dataMin - 0.005', 'dataMax + 0.005']}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              labelFormatter={(value) => `Time: ${value}`}
              formatter={(value: any) => [`${value.toFixed(6)} SBD`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="var(--color-price)" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    );
  }

  // Candlestick chart without volume
  return (
    <div className="h-[500px]">
      <CandlestickChart data={data} config={chartConfig} />
    </div>
  );
};

export default PriceChart;
