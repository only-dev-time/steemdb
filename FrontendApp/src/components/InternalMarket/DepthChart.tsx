import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { useOrderBook } from '@/hooks/useOrderBook';
import { useMarketPrice } from '@/hooks/useMarketPrice';
import { Percent } from 'lucide-react';

const DepthChart = () => {
  const { orderBookData, isLoading, error } = useOrderBook();
  const { priceData } = useMarketPrice();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading depth chart...</div>
      </div>
    );
  }

  if (error || !orderBookData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-500">Failed to load depth chart</div>
      </div>
    );
  }

  // Calculate spread percentage
  const calculateSpread = () => {
    if (!orderBookData.bids.length || !orderBookData.asks.length) return 0;
    
    const highestBid = Math.max(...orderBookData.bids.map(bid => bid.price));
    const lowestAsk = Math.min(...orderBookData.asks.map(ask => ask.price));
    
    const spread = lowestAsk - highestBid;
    const spreadPercentage = (spread / ((highestBid + lowestAsk) / 2)) * 100;
    
    return spreadPercentage;
  };

  // Process order book data for depth chart
  const processDepthData = () => {
    const bids = orderBookData.bids
      .sort((a, b) => b.price - a.price);
    
    const asks = orderBookData.asks
      .sort((a, b) => a.price - b.price);

    // Calculate cumulative volumes for bids (buy orders)
    let cumulativeBidVolume = 0;
    const bidDepth = bids.map(bid => {
      cumulativeBidVolume += bid.steem;
      return {
        price: bid.price,
        buyVolume: cumulativeBidVolume,
        sellVolume: null,
        side: 'buy',
        amount: bid.steem
      };
    }).reverse();

    // Calculate cumulative volumes for asks (sell orders)
    let cumulativeAskVolume = 0;
    const askDepth = asks.map(ask => {
      cumulativeAskVolume += ask.steem;
      return {
        price: ask.price,
        buyVolume: null,
        sellVolume: cumulativeAskVolume,
        side: 'sell',
        amount: ask.steem
      };
    });

    // Combine and sort by price
    const combinedData = [...bidDepth, ...askDepth].sort((a, b) => a.price - b.price);
    
    return combinedData;
  };

  const depthData = processDepthData();
  const currentPrice = priceData?.last_price || 0;
  const spreadPercentage = calculateSpread();

  const chartConfig = {
    buyVolume: {
      label: "Buy Volume",
      color: "hsl(142, 76%, 36%)", // Green
    },
    sellVolume: {
      label: "Sell Volume", 
      color: "hsl(0, 84%, 60%)", // Red
    },
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <div className="text-sm space-y-1">
            <div className="font-medium">
              Price: <span className="font-mono">{Number(label).toFixed(6)} SBD</span>
            </div>
            <div className={`${data.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
              Side: {data.side === 'buy' ? 'Buy' : 'Sell'}
            </div>
            <div>
              Amount: <span className="font-mono">{data.amount.toLocaleString()} STEEM</span>
            </div>
            <div>
              Cumulative: <span className="font-mono">{(data.buyVolume || data.sellVolume).toLocaleString()} STEEM</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full relative">
      {/* Spread Percentage Display */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <Percent className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Spread:</span>
            <span className="font-mono font-medium text-foreground">
              {spreadPercentage.toFixed(3)}%
            </span>
          </div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart data={depthData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="price" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => Number(value).toFixed(4)}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <ChartTooltip content={<CustomTooltip />} />
          
          {/* Reference line for current price */}
          <ReferenceLine 
            x={currentPrice} 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={2}
            strokeDasharray="4 4"
            label={{ value: "Current Price", position: "top" }}
          />
          
          {/* Buy orders (green area) */}
          <Area
            type="stepAfter"
            dataKey="buyVolume"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.3}
            strokeWidth={2}
            connectNulls={false}
            name="Buy Orders"
          />
          
          {/* Sell orders (red area) */}
          <Area
            type="stepBefore"
            dataKey="sellVolume"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
            strokeWidth={2}
            connectNulls={false}
            name="Sell Orders"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default DepthChart;
