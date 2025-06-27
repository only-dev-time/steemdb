
import React, { memo, useMemo } from 'react';
import EnhancedTransactionCard from './EnhancedTransactionCard';

interface Transaction {
  transaction_id: string;
  operations: [string, any][];
  expiration: string;
  ref_block_num: number;
  ref_block_prefix: number;
  signatures: string[];
}

interface TransactionsListProps {
  transactions: Transaction[];
  getOperationColor: (type: string) => string;
}

const TransactionsList = memo(({ transactions, getOperationColor }: TransactionsListProps) => {
  // Memoize the total operations calculation
  const totalOperations = useMemo(() => {
    if (!transactions) return 0;
    return transactions.reduce((sum, tx) => sum + tx.operations.length, 0);
  }, [transactions]);

  // Early return for no transactions
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-muted-foreground text-lg">No transactions in this block</p>
        <p className="text-muted-foreground/70 text-sm mt-1">This block contains only virtual operations</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Block Operations</h3>
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 bg-steem-accent/20 text-steem-accent rounded-full text-sm font-medium">
            {totalOperations} Operation{totalOperations !== 1 ? 's' : ''}
          </div>
          <div className="px-3 py-1 bg-muted/20 text-muted-foreground rounded-full text-xs">
            {transactions.length} Tx{transactions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
      
      {transactions.map((transaction, index) => (
        <EnhancedTransactionCard
          key={transaction.transaction_id}
          transaction={transaction}
          transactionIndex={index}
          getOperationColor={getOperationColor}
        />
      ))}
    </div>
  );
});

TransactionsList.displayName = 'TransactionsList';

export default TransactionsList;
