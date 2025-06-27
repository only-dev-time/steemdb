
import { Card, CardContent } from '@/components/ui/card';
import { useMarketPrice } from '@/hooks/useMarketPrice';
import { useOrderBook } from '@/hooks/useOrderBook';

const MarketStats = () => {
  const { priceData, isLoading, error } = useMarketPrice();
  const { totalOpenOrders, isLoading: orderBookLoading } = useOrderBook();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="bg-card/50">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !priceData) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Error</div>
            <div className="text-lg font-bold text-red-500">Failed to load</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Last Price', 
      value: `${priceData.last_price.toFixed(6)} SBD`, 
      change: `${priceData.change_24h > 0 ? '+' : ''}${priceData.change_24h.toFixed(2)}%`, 
      positive: priceData.change_24h > 0 
    },
    { 
      label: '24h Volume', 
      value: `${priceData.volume_24h.toLocaleString()} STEEM`, 
      change: '', 
      positive: null 
    },
    { 
      label: '24h High', 
      value: `${priceData.high_24h.toFixed(6)} SBD`, 
      change: '', 
      positive: null 
    },
    { 
      label: '24h Low', 
      value: `${priceData.low_24h.toFixed(6)} SBD`, 
      change: '', 
      positive: null 
    },
    { 
      label: 'Open Orders', 
      value: orderBookLoading ? 'Loading...' : totalOpenOrders.toString(), 
      change: '', 
      positive: null 
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card/50">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-lg font-bold text-foreground mt-1">{stat.value}</div>
            {stat.change && (
              <div className={`text-xs mt-1 ${
                stat.positive === true ? 'text-green-500' : 
                stat.positive === false ? 'text-red-500' : 'text-muted-foreground'
              }`}>
                {stat.change}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MarketStats;
