
import { useState, useEffect } from 'react';
import { interpretOperation } from '@/lib/operations.js';

interface OperationDescriptionProps {
  operation: [string, any];
  opData: any;
}

const OperationDescription = ({ operation, opData }: OperationDescriptionProps) => {
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

  if (isLoading) {
    return <span className="text-muted-foreground">Loading...</span>;
  }

  return (
    <div className="text-xs text-muted-foreground">
      {formattedDescription ? (
        <span 
          className="text-foreground"
          dangerouslySetInnerHTML={{ __html: formattedDescription }}
        />
      ) : (
        <span>{JSON.stringify(opData, null, 2).slice(0, 150)}...</span>
      )}
    </div>
  );
};

export default OperationDescription;
