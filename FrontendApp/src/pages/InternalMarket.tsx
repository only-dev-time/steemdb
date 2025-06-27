
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderBookOptimized from '@/components/InternalMarket/OrderBookOptimized';
import RecentTradesOptimized from '@/components/InternalMarket/RecentTradesOptimized';
import UserOrdersPopup from '@/components/InternalMarket/UserOrdersPopup';
import PriceChart from '@/components/InternalMarket/PriceChart';
import DepthChart from '@/components/InternalMarket/DepthChart';
import MarketStats from '@/components/InternalMarket/MarketStats';
import { useDataManager } from '@/hooks/useDataManager';

const InternalMarket = () => {
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [chartMode, setChartMode] = useState<'price' | 'depth'>('price');
  const [timeframe, setTimeframe] = useState('1h');
  
  // Initialize the data manager to coordinate API calls
  useDataManager();

  const timeframes = [
    { value: '15s', label: '15s' },
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '1h', label: '1h' },
    { value: '6h', label: '6h' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Internal Market</h1>
            <p className="text-muted-foreground">STEEM/SBD Trading Pair</p>
          </div>
          <UserOrdersPopup />
        </div>

        {/* Market Stats */}
        <MarketStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {chartMode === 'price' ? 'Price Chart' : 'Depth Chart'}
                  </CardTitle>
                  
                  {/* Chart Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Chart Mode Toggle */}
                    <Tabs value={chartMode} onValueChange={(value) => setChartMode(value as 'price' | 'depth')}>
                      <TabsList className="grid w-fit grid-cols-2">
                        <TabsTrigger value="price" className="text-xs">📈 Price</TabsTrigger>
                        <TabsTrigger value="depth" className="text-xs">📊 Depth</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    {/* Chart Type Toggle - Only show for price charts */}
                    {chartMode === 'price' && (
                      <Tabs value={chartType} onValueChange={(value) => setChartType(value as 'candles' | 'line')}>
                        <TabsList className="grid w-fit grid-cols-2">
                          <TabsTrigger value="candles" className="text-xs">🕯️ Candles</TabsTrigger>
                          <TabsTrigger value="line" className="text-xs">📈 Line</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    )}
                    
                    {/* Timeframe Selector - Only show for price charts */}
                    {chartMode === 'price' && (
                      <Tabs value={timeframe} onValueChange={setTimeframe}>
                        <TabsList className="grid w-fit grid-cols-5">
                          {timeframes.map((tf) => (
                            <TabsTrigger 
                              key={tf.value} 
                              value={tf.value}
                              className="text-xs px-2 py-1 min-w-[35px]"
                            >
                              {tf.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px]">
                  {/* Chart Component */}
                  {chartMode === 'price' ? (
                    <PriceChart chartType={chartType} timeframe={timeframe} />
                  ) : (
                    <DepthChart />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Trades - Using optimized component */}
            <RecentTradesOptimized />
          </div>

          {/* Order Book - Using optimized component */}
          <div>
            <OrderBookOptimized />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InternalMarket;
