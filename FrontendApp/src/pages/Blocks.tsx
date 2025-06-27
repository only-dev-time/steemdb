
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Hash, User, Activity, ChevronLeft, ChevronRight, Grid3X3, List } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useBlocks } from '@/hooks/useBlocks';
import { Skeleton } from '@/components/ui/skeleton';

const Blocks = () => {
  const [lastBlockNum, setLastBlockNum] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const limit = 30;

  const { data: blocksData, isLoading, error } = useBlocks(limit, lastBlockNum);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const blockTime = new Date(timestamp + 'Z'); // Add 'Z' to indicate UTC
    const diffInSeconds = Math.floor((now.getTime() - blockTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    // Parse UTC timestamp and convert to local time
    const utcDate = new Date(timestamp + 'Z'); // Add 'Z' to indicate UTC
    return utcDate.toLocaleString();
  };

  const handleNextPage = () => {
    if (blocksData?.blocks && blocksData.blocks.length > 0) {
      const lastBlock = blocksData.blocks[blocksData.blocks.length - 1];
      setLastBlockNum(lastBlock.block_num);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      // For previous page, we need to calculate the starting block number
      // This is a simplified approach - in a real implementation, you might want to maintain a history
      setLastBlockNum(undefined);
      setCurrentPage(1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="glass-card p-6">
            <p className="text-red-500">Error loading blocks: {error.message}</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Blocks</h1>
          <p className="text-muted-foreground">
            Latest blocks on the STEEM blockchain
            {blocksData && (
              <span className="ml-2">
                (Total: {blocksData.total_blocks.toLocaleString()} blocks)
              </span>
            )}
          </p>
        </div>

        {/* Blocks List */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Blocks</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex items-center space-x-1"
                >
                  <List className="w-4 h-4" />
                  <span>List</span>
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center space-x-1"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Grid</span>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Page {currentPage}
              </div>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className={`p-4 rounded-lg bg-secondary/30 ${viewMode === 'grid' ? '' : ''}`}>
                  <div className={`flex items-center ${viewMode === 'grid' ? 'flex-col space-y-4' : 'justify-between'}`}>
                    <div className={`flex items-center space-x-4 ${viewMode === 'grid' ? 'flex-col space-x-0 space-y-2' : ''}`}>
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className={`space-y-2 ${viewMode === 'grid' ? 'text-center' : ''}`}>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <div className={`space-y-2 ${viewMode === 'grid' ? 'text-center' : ''}`}>
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              blocksData?.blocks.map((block, index) => (
                <Link 
                  key={block._id}
                  to={`/block/${block.block_num}`}
                  className={`block p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 cursor-pointer border border-border/30 ${viewMode === 'grid' ? 'text-center' : ''}`}
                >
                  <div className={`flex items-center ${viewMode === 'grid' ? 'flex-col space-y-4' : 'justify-between space-x-4'}`}>
                    <div className={`flex items-center space-x-4 ${viewMode === 'grid' ? 'flex-col space-x-0 space-y-2' : ''}`}>
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                        <Hash className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Block #{block.block_num.toLocaleString()}
                        </p>
                        <div className={`flex items-center space-x-4 text-xs text-muted-foreground ${viewMode === 'grid' ? 'flex-col space-x-0 space-y-1' : ''}`}>
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>@{block.witness}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="w-3 h-3" />
                            <span>{block.transactions_count} transactions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`${viewMode === 'grid' ? 'text-center' : 'text-right'}`}>
                      <div className={`flex items-center space-x-2 text-xs text-muted-foreground mb-1 ${viewMode === 'grid' ? 'justify-center' : ''}`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(block.timestamp)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(block.timestamp)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          {!isLoading && blocksData && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Showing {blocksData.blocks.length} blocks
              </div>
              
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={blocksData.blocks.length < limit}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Blocks;
