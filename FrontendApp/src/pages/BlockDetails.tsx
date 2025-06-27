
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, MessageSquare, Heart, Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlockHeader from '@/components/BlockHeader';
import BlockNavigation from '@/components/BlockNavigation';
import BlockInfo from '@/components/BlockInfo';
import BlockHashes from '@/components/BlockHashes';
import WitnessInfo from '@/components/WitnessInfo';
import TransactionsList from '@/components/TransactionsList';
import VirtualOperationsList from '@/components/VirtualOperationsList';
import { useBlockDetails } from '@/hooks/useBlockDetails';

const BlockDetails = () => {
  const { blockNumber } = useParams();
  const navigate = useNavigate();
  const { data: blockData, isLoading, error } = useBlockDetails(blockNumber);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const blockTime = new Date(timestamp + 'Z');
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
    const utcDate = new Date(timestamp + 'Z');
    return utcDate.toLocaleString();
  };

  const getOperationColor = (type: string) => {
    switch (type) {
      case 'transfer': return 'text-green-500';
      case 'comment': return 'text-steem-accent-blue';
      case 'vote': return 'text-red-500';
      case 'claim_reward_balance': return 'text-yellow-500';
      default: return 'text-foreground';
    }
  };

  const handlePreviousBlock = () => {
    if (blockData && blockData.block_num > 1) {
      navigate(`/block/${blockData.block_num - 1}`);
    }
  };

  const handleNextBlock = () => {
    if (blockData) {
      navigate(`/block/${blockData.block_num + 1}`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="glass-card p-6">
            <p className="text-red-500">Error loading block: {error.message}</p>
          </Card>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Card className="glass-card p-6">
            <Skeleton className="h-64 w-full" />
          </Card>
        </main>
      </div>
    );
  }

  if (!blockData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="glass-card p-6">
            <p className="text-muted-foreground">Block not found</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8 flex-grow">
        <BlockNavigation 
          blockNumber={blockData.block_num}
          onPrevious={handlePreviousBlock}
          onNext={handleNextBlock}
        />

        <BlockHeader blockNumber={blockData.block_num} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BlockInfo 
            blockNumber={blockData.block_num}
            timestamp={blockData.timestamp}
            transactionsCount={blockData.transactions_count}
            virtualOpsCount={blockData.virtual_ops.length}
            formatTimestamp={formatTimestamp}
            formatTimeAgo={formatTimeAgo}
          />
          <BlockHashes 
            blockId={blockData.block_id}
            previous={blockData.previous}
          />
        </div>

        <WitnessInfo 
          witness={blockData.witness}
          witnessSignature={blockData.witness_signature}
        />

        <Card className="glass-card p-8">
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="transactions" className="text-base">
                Transactions ({blockData.transactions_count})
              </TabsTrigger>
              <TabsTrigger value="virtual-ops" className="text-base">
                Virtual Operations ({blockData.virtual_ops.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions">
              <TransactionsList 
                transactions={blockData.transactions}
                getOperationColor={getOperationColor}
              />
            </TabsContent>
            
            <TabsContent value="virtual-ops">
              <VirtualOperationsList 
                virtualOps={blockData.virtual_ops}
                getOperationIcon={() => null}
                getOperationColor={getOperationColor}
                formatTimestamp={formatTimestamp}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default BlockDetails;
