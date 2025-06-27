import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAccountHistory } from '@/hooks/useAccountHistory';
import { getOperationIcon } from '@/lib/formatter.js';
import OperationDescription from './OperationDescription';

interface AccountHistoryProps {
  username: string;
}

const AccountHistory = ({ username }: AccountHistoryProps) => {
  const [currentStart, setCurrentStart] = useState(-1);
  const limit = 30;

  const { data: historyData, isLoading, error } = useAccountHistory(username, currentStart, limit);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOperationColor = (type: string) => {
    switch (type) {
      case 'vote_operation':
        return 'text-green-500';
      case 'transfer_operation':
        return 'text-blue-500';
      case 'comment_operation':
        return 'text-purple-500';
      case 'claim_reward_balance_operation':
        return 'text-yellow-500';
      case 'producer_reward_operation':
        return 'text-orange-500';
      case 'curation_reward_operation':
        return 'text-emerald-500';
      case 'feed_publish_operation':
        return 'text-cyan-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleNext = () => {
    if (historyData && historyData.next_start) {
      setCurrentStart(historyData.next_start);
    }
  };

  const handlePrevious = () => {
    if (historyData && historyData.history.length > 0) {
      const firstEntry = historyData.history[0];
      setCurrentStart(firstEntry[0]);
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card p-6">
        <div className="text-center">
          <div className="text-muted-foreground">Loading account history...</div>
        </div>
      </Card>
    );
  }

  if (error || !historyData) {
    return (
      <Card className="glass-card p-6">
        <div className="text-center">
          <div className="text-destructive">Error loading account history</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Account History</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentStart === -1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!historyData.next_start}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {historyData.history.map(([index, entry]) => (
          <Card key={`${entry.trx_id}-${index}`} className="glass-card p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-secondary/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm">{getOperationIcon(entry.op.type)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground capitalize">
                      {entry.op.type.replace(/_/g, ' ').replace(' operation', '')}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(entry.timestamp)}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    <OperationDescription operation={[entry.op.type, entry.op.value]} opData={entry.op.value} />
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>
                      Block: <Link to={`/block/${entry.block}`} className="text-steem-accent hover:text-steem-bright transition-colors">
                        {entry.block.toLocaleString()}
                      </Link>
                    </span>
                    <span>
                      TX: <Link to={`/transaction/${entry.trx_id}`} className="text-steem-accent hover:text-steem-bright transition-colors">
                        {entry.trx_id.slice(0, 8)}...{entry.trx_id.slice(-6)}
                      </Link>
                    </span>
                    {entry.virtual_op > 0 && <span className="text-purple-500">Virtual</span>}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center pt-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentStart === -1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Showing {historyData.history.length} operations
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!historyData.next_start}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountHistory;
