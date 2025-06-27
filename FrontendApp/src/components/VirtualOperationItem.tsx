
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { interpretOperation } from '@/lib/operations.js';
import { getOperationIcon } from '@/lib/icons.js';

interface VirtualOperation {
  op: [string, any];
  timestamp: string;
  trx_id: string;
  block: number;
  trx_in_block: number;
  op_in_trx: number;
  virtual_op: number;
}

interface VirtualOperationItemProps {
  virtualOp: VirtualOperation;
  index: number;
  getOperationColor: (type: string) => string;
  formatTimestamp: (timestamp: string) => string;
}

const VirtualOperationItem = ({ 
  virtualOp, 
  index, 
  getOperationColor, 
  formatTimestamp 
}: VirtualOperationItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formattedDescription, setFormattedDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [opType, opData] = virtualOp.op;
  const iconEmoji = getOperationIcon(opType);

  useEffect(() => {
    const formatOperation = async () => {
      try {
        const formatted = await interpretOperation(virtualOp.op);
        if (!formatted.startsWith('Unrecognized operation:')) {
          setFormattedDescription(formatted);
        }
      } catch (error) {
        console.error('Error formatting virtual operation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    formatOperation();
  }, [virtualOp.op]);

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">{iconEmoji}</span>
            </div>
            <CardTitle className="text-lg font-semibold capitalize">
              {opType.replace(/_/g, ' ')}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">
              #{index + 1}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1"
            >
              <Code className="w-4 h-4" />
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Formatted Description */}
          {isLoading ? (
            <div className="flex items-center space-x-2 py-2">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground">Processing operation...</span>
            </div>
          ) : formattedDescription ? (
            <div 
              className="text-foreground leading-relaxed text-base mb-3 p-3 bg-secondary/30 rounded-lg"
              dangerouslySetInnerHTML={{ __html: formattedDescription }}
            />
          ) : (
            <p className="text-muted-foreground text-sm mb-3">Raw operation data available below</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">
              <span className="font-medium">Transaction:</span> {virtualOp.trx_id}
            </div>
            <div className="text-muted-foreground">
              <span className="font-medium">Timestamp:</span> {formatTimestamp(virtualOp.timestamp)}
            </div>
          </div>

          {/* Raw Operation Data - Expandable */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-medium text-foreground">
                  <Code className="w-4 h-4" />
                  <span>Raw Operation Data</span>
                </div>
                
                <pre className="bg-background/80 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-border/30 max-h-64 overflow-y-auto">
                  {JSON.stringify(opData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualOperationItem;
