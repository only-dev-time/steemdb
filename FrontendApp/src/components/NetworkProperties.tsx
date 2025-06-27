import { Activity, Database, Users, Zap, Clock, Shield, TrendingUp, Percent } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNetworkProperties } from '@/hooks/useNetworkProperties';

const NetworkProperties = () => {
  const { properties, isConnected, error } = useNetworkProperties();

  const formatTimeAgo = (utcTimestamp: string) => {
    const now = new Date();
    const utcTime = new Date(utcTimestamp + 'Z'); // Ensure it's treated as UTC
    const diffInSeconds = Math.floor((now.getTime() - utcTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  if (error) {
    return (
      <Card className="glass-card p-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Network Properties
        </h2>
        <p className="text-red-500">Error: {error}</p>
      </Card>
    );
  }

  if (!properties) {
    return (
      <Card className="glass-card p-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Network Properties
        </h2>
        <p className="text-muted-foreground">Waiting to Update Network Properties...</p>
      </Card>
    );
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatCurrency = (amount: string) => amount.split(' ')[0];
  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  const totalVestingShares = parseFloat(properties.total_vesting_shares.split(' ')[0]);
  const virtualSupply = parseFloat(properties.virtual_supply.split(' ')[0]);

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Network Properties
        </h2>
        <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">{isConnected ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Block Information */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            BLOCK INFORMATION
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-steem-accent-blue/10 to-steem-purple-blue/10 p-4 rounded-lg border border-steem-accent-blue/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Head Block</p>
              <p className="text-lg font-bold text-foreground">#{formatNumber(properties.head_block_number)}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Irreversible Block</p>
              <p className="text-lg font-bold text-foreground">#{formatNumber(properties.last_irreversible_block_num)}</p>
            </div>
          </div>
        </div>

        {/* Network Stats */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            NETWORK STATS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Witness</p>
              <p className="text-sm font-bold text-steem-accent-blue">@{properties.current_witness}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Participation</p>
              <p className="text-sm font-bold text-foreground">{properties.participation_count}/128</p>
            </div>
          </div>
        </div>

        {/* SBD Information */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            <Percent className="w-4 h-4 mr-2" />
            SBD ECONOMICS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 rounded-lg border border-amber-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">SBD Print Rate</p>
              <p className="text-lg font-bold text-foreground">{(properties.sbd_print_rate / 100).toFixed(2)}%</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border border-indigo-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Last Budget Time</p>
              <p className="text-sm font-bold text-foreground">{formatTimeAgo(properties.last_budget_time)}</p>
            </div>
          </div>
        </div>

        {/* Supply Information */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            SUPPLY & ECONOMICS
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-lg border border-orange-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Virtual Supply</p>
              <p className="text-lg font-bold text-foreground">{formatLargeNumber(virtualSupply)} STEEM</p>
              <p className="text-xs text-muted-foreground">~{formatCurrency(properties.virtual_supply)} STEEM</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 p-3 rounded-lg border border-green-500/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">STEEM Supply</p>
                <p className="text-sm font-bold text-foreground">{formatLargeNumber(parseFloat(formatCurrency(properties.current_supply)))} STEEM</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 rounded-lg border border-yellow-500/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">SBD Supply</p>
                <p className="text-sm font-bold text-foreground">{formatLargeNumber(parseFloat(formatCurrency(properties.current_sbd_supply)))} SBD</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 p-4 rounded-lg border border-indigo-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Vesting Fund</p>
              <p className="text-lg font-bold text-foreground">{formatLargeNumber(parseFloat(formatCurrency(properties.total_vesting_fund_steem)))} STEEM</p>
            </div>
          </div>
        </div>

        {/* Vesting Information */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            VESTING METRICS
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-4 rounded-lg border border-violet-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Vesting Shares</p>
              <p className="text-lg font-bold text-foreground">{formatLargeNumber(totalVestingShares)} VESTS</p>
              <p className="text-xs text-muted-foreground">~{(totalVestingShares / 1e9).toFixed(2)} billion VESTS</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-4 rounded-lg border border-emerald-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">STEEM per Mvests Ratio</p>
              <p className="text-lg font-bold text-foreground">{properties.steem_per_mvests.toFixed(2)} STEEM</p>
              <p className="text-xs text-muted-foreground">per million VESTS</p>
            </div>
          </div>
        </div>

        {/* Reward Distribution */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            REWARD DISTRIBUTION
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-3 rounded-lg border border-blue-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Content Rewards</p>
              <p className="text-sm font-bold text-foreground">{(properties.content_reward_percent / 100).toFixed(1)}%</p>
            </div>
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded-lg border border-green-500/20">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Vesting Rewards</p>
              <p className="text-sm font-bold text-foreground">{(properties.vesting_reward_percent / 100).toFixed(1)}%</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3 rounded-lg border border-purple-500/20 col-span-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">SPS Fund Percent</p>
              <p className="text-sm font-bold text-foreground">{(properties.sps_fund_percent / 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="pt-4 border-t border-border/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Last Update</span>
            </div>
            <span className="font-mono">{new Date(properties.time + 'Z').toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NetworkProperties;
