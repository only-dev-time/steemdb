
import { useState, useEffect } from 'react';
import { interpretOperation } from '@/lib/operations.js';

interface OperationItemProps {
  operation: [string, any];
  color: string;
  opType: string;
  opData: any;
}

const OperationItem = ({ operation, color, opType, opData }: OperationItemProps) => {
  const [formattedDescription, setFormattedDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const formatOperation = async () => {
      try {
        const formatted = await interpretOperation(operation);
        if (formatted.startsWith('Unrecognized operation:')) {
          setFormattedDescription(null);
        } else {
          setFormattedDescription(formatted);
        }
      } catch (error) {
        console.error('Error formatting operation:', error);
        setFormattedDescription(null);
      } finally {
        setIsLoading(false);
      }
    };

    formatOperation();
  }, [operation]);

  return (
    <div className="flex items-center space-x-3 p-2 rounded bg-secondary/20">
      <div className={`w-3 h-3 rounded-full ${color.replace('text-', 'bg-')}`} />
      <div className="flex-1">
        <span className="text-sm font-medium text-foreground capitalize">{opType}</span>
        <div className="text-xs text-muted-foreground mt-1">
          {isLoading ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : formattedDescription ? (
            <span className="text-foreground">{formattedDescription}</span>
          ) : (
            <span>{JSON.stringify(opData, null, 2).slice(0, 100)}...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperationItem;
