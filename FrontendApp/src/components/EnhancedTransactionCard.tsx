
import EnhancedOperationItem from './EnhancedOperationItem';

interface Transaction {
  transaction_id: string;
  operations: [string, any][];
  expiration: string;
  ref_block_num: number;
  ref_block_prefix: number;
  signatures: string[];
}

interface EnhancedTransactionCardProps {
  transaction: Transaction;
  transactionIndex: number;
  getOperationColor: (type: string) => string;
}

const EnhancedTransactionCard = ({ 
  transaction, 
  transactionIndex, 
  getOperationColor 
}: EnhancedTransactionCardProps) => {
  return (
    <div className="space-y-3">
      {/* Operations - Primary Focus with embedded transaction info */}
      <div className="space-y-3">
        {transaction.operations.map((operation, opIndex) => (
          <EnhancedOperationItem
            key={opIndex}
            operation={operation}
            operationIndex={opIndex}
            transactionIndex={transactionIndex}
            transactionId={transaction.transaction_id}
            getOperationColor={getOperationColor}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedTransactionCard;
