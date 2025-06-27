import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Hash, Clock, User, DollarSign, ArrowRight, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { useTransactionDetails } from '@/hooks/useTransactionDetails';
import { interpretOperation, getOperationIcon } from '@/lib/formatter.js';
import { useState, useEffect } from 'react';

const TransactionDetails = () => {
  const { txHash } = useParams();
  const { data: transactionData, isLoading, error } = useTransactionDetails(txHash);

  const formatTimestamp = (expiration: string) => {
    return new Date(expiration).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-steem-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading transaction details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !transactionData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Failed to load transaction details</p>
            <p className="text-muted-foreground mt-2">Transaction not found or API error</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explorer
            </Button>
          </Link>
        </div>

        {/* Transaction Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Transaction Details</h1>
          <p className="text-muted-foreground font-mono break-all">{transactionData.transaction_id}</p>
        </div>

        {/* Transaction Status */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Hash className="w-6 h-6 text-green-100" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Transaction Confirmed</h2>
                <p className="text-muted-foreground">Included in block {transactionData.block_num}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">
                confirmed
              </span>
            </div>
          </div>
        </Card>

        {/* Transaction Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Transaction Info</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Block:</span>
                <Link to={`/block/${transactionData.block_num}`} className="text-steem-accent hover:text-steem-bright transition-colors">
                  #{transactionData.block_num.toLocaleString()}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction #:</span>
                <span className="text-foreground">{transactionData.transaction_num}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expiration:</span>
                <span className="text-foreground">{formatTimestamp(transactionData.details.expiration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Operations:</span>
                <span className="text-foreground">{transactionData.operations.length}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Block References</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ref Block Num:</span>
                <span className="text-foreground font-mono">{transactionData.details.ref_block_num}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ref Block Prefix:</span>
                <span className="text-foreground font-mono">{transactionData.details.ref_block_prefix}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signatures:</span>
                <span className="text-foreground">{transactionData.details.signatures.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Operations */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Operations ({transactionData.operations.length})</h2>
          <div className="space-y-4">
            {transactionData.operations.map((operation, index) => (
              <OperationCard key={index} operation={operation} index={index} />
            ))}
          </div>
        </Card>

        {/* Raw Transaction Data */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Raw Transaction Data</h2>
          <div className="bg-secondary/30 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm text-foreground">
              {JSON.stringify(transactionData, null, 2)}
            </pre>
          </div>
        </Card>
      </main>
    </div>
  );
};

const OperationCard = ({ operation, index }: { operation: any, index: number }) => {
  const [formattedDescription, setFormattedDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const operationIcon = getOperationIcon(operation.type);

  useEffect(() => {
    const formatOperation = async () => {
      try {
        const formatted = await interpretOperation([operation.type, operation.data]);
        if (!formatted.startsWith('Unrecognized operation:')) {
          setFormattedDescription(formatted);
        }
      } catch (error) {
        console.error('Error formatting operation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    formatOperation();
  }, [operation]);

  // Check if this is a comment operation for post linking
  const isComment = operation.type === 'comment';
  const isPost = isComment && !operation.data.parent_author;

  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-secondary/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-xl">{operationIcon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <h4 className="text-lg font-bold text-foreground capitalize">
                {operation.type.replace(/_/g, ' ')}
              </h4>
              <div className="px-2 py-1 bg-steem-accent/20 text-steem-accent rounded text-xs font-medium">
                Operation #{index + 1}
              </div>
            </div>
            
            {isComment && operation.data.author && operation.data.permlink && (
              <Link 
                to={`/post/${operation.data.author}/${operation.data.permlink}`}
                className="text-xs text-steem-accent hover:text-steem-bright transition-colors flex items-center space-x-1 bg-secondary/30 px-3 py-2 rounded hover:bg-secondary/50"
              >
                <span>{isPost ? 'View Post' : 'View Comment'}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex items-center space-x-2 py-2">
              <div className="w-4 h-4 border-2 border-steem-accent border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground">Processing operation...</span>
            </div>
          ) : formattedDescription ? (
            <div 
              className="text-foreground leading-relaxed text-base mb-3 [&_a]:text-steem-accent [&_a]:hover:text-steem-bright [&_a]:transition-colors [&_a]:font-medium"
              dangerouslySetInnerHTML={{ __html: formattedDescription }}
            />
          ) : (
            <p className="text-muted-foreground text-sm mb-3">Raw operation data below</p>
          )}

          {/* Show key fields for comments/posts */}
          {isComment && (
            <div className="bg-secondary/20 p-3 rounded-lg mb-3">
              <div className="space-y-2">
                {operation.data.title && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Title:</span>
                    <p className="text-foreground">{operation.data.title}</p>
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Author:</span>
                    <Link to={`/account/${operation.data.author}`} className="text-steem-accent hover:text-steem-bright ml-1">
                      @{operation.data.author}
                    </Link>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Permlink:</span>
                    <Link 
                      to={`/post/${operation.data.author}/${operation.data.permlink}`}
                      className="text-steem-accent hover:text-steem-bright ml-1"
                    >
                      {operation.data.permlink}
                    </Link>
                  </div>
                </div>
                {operation.data.parent_author && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Parent:</span>
                    <Link 
                      to={`/post/${operation.data.parent_author}/${operation.data.parent_permlink}`}
                      className="text-steem-accent hover:text-steem-bright ml-1"
                    >
                      @{operation.data.parent_author}/{operation.data.parent_permlink}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key operation details */}
          <details className="group">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              View raw operation data
            </summary>
            <div className="mt-3 bg-background/80 p-4 rounded-lg border border-border/30">
              <pre className="text-xs font-mono overflow-x-auto">
                {JSON.stringify(operation.data, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
