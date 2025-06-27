
import { Users, Zap, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useSteemPrice } from '@/hooks/useSteemPrice';
import { useNetworkProperties } from '@/hooks/useNetworkProperties';
import { useAccountCount } from '@/hooks/useAccountCount';
import { useTPS } from '@/hooks/useTPS';

const StatsOverview = () => {
  const { priceData, isLoading: priceLoading, error: priceError } = useSteemPrice();
  const { properties } = useNetworkProperties();
  const { accountCount, isLoading: accountLoading } = useAccountCount();
  const { tpsData, isLoading: tpsLoading } = useTPS();

  const formatNumber = (num: number) => num.toLocaleString();
  
  const formatNumberCompact = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `$${numPrice.toFixed(4)}`;
  };

  const calculatePercentChange = (markPrice: string, openPrice: string) => {
    const mark = parseFloat(markPrice);
    const open = parseFloat(openPrice);
    const change = ((mark - open) / open) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (markPrice: string, openPrice: string) => {
    const mark = parseFloat(markPrice);
    const open = parseFloat(openPrice);
    const change = mark - open;
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const formatTPS = (value: number) => value.toFixed(2);

  const stats = [
    {
      title: "Current Irreversible Block",
      value: properties ? `${formatNumber(properties.last_irreversible_block_num)}` : "Loading...",
      change: properties ? `${properties.reversible_blocks} Reversible blocks waiting Consensus` : "+0.2%",
      icon: null,
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Total Accounts",
      value: accountLoading ? "Loading..." : accountCount ? formatNumberCompact(accountCount) : "Loading...",
      subValue: accountLoading ? "" : accountCount ? formatNumber(accountCount) : "",
      change: "",
      icon: Users,
      color: "bg-gradient-to-br from-primary to-blue-500"
    },
    {
      title: "TPS",
      value: tpsLoading ? "Loading..." : tpsData ? `${formatTPS(tpsData.tps_all_time)}` : "Loading...",
      subValue: tpsLoading ? "" : tpsData ? `1h: ${formatTPS(tpsData.tps_1h)} • 1d: ${formatTPS(tpsData.tps_1d)} • 1w: ${formatTPS(tpsData.tps_1w)} • 1m: ${formatTPS(tpsData.tps_1m)}` : "",
      change: "",
      icon: Zap,
      color: "bg-gradient-to-br from-purple-500 to-primary"
    },
    {
      title: "STEEM Price",
      value: priceLoading ? "Loading..." : priceError ? "Error" : priceData ? formatPrice(priceData.markPrice) : "$0.00",
      subValue: priceLoading ? "" : priceError ? "" : priceData ? `24h High: ${formatPrice(priceData.high)} • 24h Low: ${formatPrice(priceData.low)}` : "",
      change: priceLoading ? "..." : priceError ? "N/A" : priceData ? calculatePercentChange(priceData.markPrice, priceData.open) : "0%",
      icon: DollarSign,
      color: "bg-gradient-to-br from-accent to-blue-600",
      changeColor: priceData ? getChangeColor(priceData.markPrice, priceData.open) : "text-green-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 glass-card hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              {stat.subValue && <p className="text-xs text-muted-foreground">~{stat.subValue}</p>}
              {stat.change && <p className={`text-sm mt-1 ${stat.changeColor || 'text-green-500'}`}>{stat.change}</p>}
            </div>
            {stat.icon && (
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
