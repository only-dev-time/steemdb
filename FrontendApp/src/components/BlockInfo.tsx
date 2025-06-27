
import { Card } from '@/components/ui/card';

interface BlockInfoProps {
  blockNumber: number;
  timestamp: string;
  transactionsCount: number;
  virtualOpsCount: number;
  formatTimestamp: (timestamp: string) => string;
  formatTimeAgo: (timestamp: string) => string;
}

const BlockInfo = ({ 
  blockNumber, 
  timestamp, 
  transactionsCount, 
  virtualOpsCount,
  formatTimestamp,
  formatTimeAgo 
}: BlockInfoProps) => {
  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Block Information</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Block Number:</span>
          <span className="text-foreground font-mono">#{blockNumber.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Timestamp:</span>
          <span className="text-foreground">{formatTimestamp(timestamp)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Time Ago:</span>
          <span className="text-foreground">{formatTimeAgo(timestamp)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transactions:</span>
          <span className="text-foreground">{transactionsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Virtual Operations:</span>
          <span className="text-foreground">{virtualOpsCount}</span>
        </div>
      </div>
    </Card>
  );
};

export default BlockInfo;
