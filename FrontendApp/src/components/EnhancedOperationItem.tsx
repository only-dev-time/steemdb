
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Code, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { interpretOperation } from '@/lib/operations.js';
import { getOperationIcon } from '@/lib/icons.js';

interface EnhancedOperationItemProps {
  operation: [string, any];
  operationIndex: number;
  transactionIndex: number;
  transactionId: string;
  getOperationColor: (type: string) => string;
}

// Helper function to format complex values for display
const formatPreviewValue = (key: string, value: any): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  // Handle exchange_rate object specifically
  if (key === 'exchange_rate' && typeof value === 'object') {
    const base = value.base || 'N/A';
    const quote = value.quote || 'N/A';
    return `${base} / ${quote}`;
  }
  
  // Handle other objects
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
};

const EnhancedOperationItem = ({ 
  operation, 
  operationIndex, 
  transactionIndex,
  transactionId,
  getOperationColor 
}: EnhancedOperationItemProps) => {
  const [opType, opData] = operation;
  const [isExpanded, setIsExpanded] = useState(false);
  const [formattedDescription, setFormattedDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const color = getOperationColor(opType);
  const operationIcon = getOperationIcon(opType);

  useEffect(() => {
    const formatOperation = async () => {
      try {
        const formatted = await interpretOperation(operation);
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
  const isComment = opType === 'comment';
  const isPost = isComment && !opData.parent_author;

  return (
    <Card className="glass-card overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Operation Header - Primary Focus */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Operation Icon */}
            <div className="relative">
              <div className="w-10 h-10 bg-secondary/30 rounded-lg flex items-center justify-center">
                <span className="text-xl">{operationIcon}</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Operation Type & Transaction Reference */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-bold text-foreground capitalize">
                    {opType.replace(/_/g, ' ')}
                  </h4>
                  <div className="px-2 py-1 bg-steem-accent/20 text-steem-accent rounded text-xs font-medium">
                    {opType}
                  </div>
                </div>
                
                {/* Transaction ID and Details */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Tx #{transactionIndex + 1}</span>
                    <span>Op #{operationIndex + 1}</span>
                  </div>
                  <Link 
                    to={`/transaction/${transactionId}`}
                    className="text-xs text-steem-accent hover:text-steem-bright transition-colors font-mono flex items-center space-x-1 bg-secondary/30 px-2 py-1 rounded"
                  >
                    <span>{transactionId.slice(0, 8)}...{transactionId.slice(-8)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              
              {/* Formatted Description */}
              {isLoading ? (
                <div className="flex items-center space-x-2 py-2">
                  <div className="w-4 h-4 border-2 border-steem-accent border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-muted-foreground">Processing operation...</span>
                </div>
              ) : formattedDescription ? (
                <div 
                  className="text-foreground leading-relaxed text-base mb-3"
                  dangerouslySetInnerHTML={{ __html: formattedDescription }}
                />
              ) : (
                <p className="text-muted-foreground text-sm mb-3">Raw operation data available below</p>
              )}

              {/* Key operation details preview */}
              {opData && typeof opData === 'object' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(opData).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground capitalize min-w-0 flex-shrink-0">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <div className="text-sm font-mono bg-secondary/50 px-2 py-1 rounded text-foreground min-w-0 flex-1">
                        <span className="truncate block">{formatPreviewValue(key, value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 ml-4"
          >
            <Code className="w-4 h-4" />
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Raw Operation Data - Expandable */}
      {isExpanded && (
        <div className="px-5 pb-5 bg-secondary/20 border-t border-border/50">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm font-medium text-foreground">
              <Code className="w-4 h-4" />
              <span>Raw Operation Data</span>
            </div>
            
            <pre className="bg-background/80 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-border/30 max-h-64 overflow-y-auto">
              {JSON.stringify(opData, null, 2)}
            </pre>
            
            {/* Full operation details grid */}
            {opData && typeof opData === 'object' && Object.keys(opData).length > 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-border/30">
                {Object.entries(opData).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-xs text-muted-foreground capitalize font-medium">{key.replace(/_/g, ' ')}</div>
                    <div className="text-sm font-mono bg-background/60 p-2 rounded border border-border/30">
                      <span className="break-all">{formatPreviewValue(key, value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedOperationItem;
