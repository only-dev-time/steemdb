import { Clock, Hash, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useRealtimeBlocks } from '@/hooks/useRealtimeBlocks';

const RecentBlocks = () => {
  const { blocks, isConnected, error } = useRealtimeBlocks();

  if (error) {
    return (
      <Card className="glass-card p-6 animate-fade-in h-fit">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Recent Irreversible Blocks</h2>
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
        <p className="text-red-500">Error: {error}</p>
      </Card>
    );
  }

  // Filter out blocks with 0 operations
  const blocksWithOps = blocks.filter(block => block.transactions > 0);

  return (
    <Card className="glass-card p-6 animate-fade-in h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Recent Irreversible Blocks</h2>
        <div className={`animate-pulse-glow w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
      <div className="space-y-3 min-h-[600px] sm:min-h-[700px] md:min-h-[800px] lg:min-h-[900px] xl:min-h-[600px]">
        {blocksWithOps.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              {isConnected ? 'Waiting for New Irreversible Blocks...' : 'Connecting to blockchain...'}
            </p>
          </div>
        ) : (
          blocksWithOps.map((block, index) => {
            // Format operation types with counts - show all operations
            const formatOpTypes = (opCounts: Record<string, number>) => {
              return Object.entries(opCounts)
                .map(([opType, count]) => `${opType} (${count})`);
            };

            const formattedOps = formatOpTypes(block.opCounts);

            return (
              <Link 
                key={`block-${block.number}`}
                to={`/block/${block.number}`}
                className={`flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 cursor-pointer border border-border/30 ${index === 0 ? 'animate-fade-in' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Hash className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">#{block.number.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {formattedOps.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
                    <Clock className="w-3 h-3" />
                    <span>{block.timeAgo}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-foreground">{block.transactions} ops</span>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Activity className="w-3 h-3" />
                      <span className="text-primary">{Object.keys(block.opCounts).length} types</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default RecentBlocks;
