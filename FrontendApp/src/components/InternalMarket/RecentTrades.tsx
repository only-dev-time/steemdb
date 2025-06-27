
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRecentTrades } from '@/hooks/useRecentTrades';

const RecentTrades = () => {
  const { trades, isLoading, error } = useRecentTrades();

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-muted-foreground text-sm">Loading trades...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">⚠️</span>
              </div>
              <p className="text-destructive text-sm font-medium">Failed to load trades</p>
              <p className="text-muted-foreground text-xs mt-1">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show no data state
  if (!trades || trades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">📊</span>
              </div>
              <p className="text-muted-foreground text-sm">No recent trades</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Check back later for trading activity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead className="text-xs p-2">Time</TableHead>
              <TableHead className="text-xs p-2">Price (SBD)</TableHead>
              <TableHead className="text-xs p-2">Amount (STEEM)</TableHead>
              <TableHead className="text-xs p-2">Total (SBD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade, index) => {
              // Format timestamp to time only
              const time = new Date(trade.timestamp).toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              });

              return (
                <TableRow key={index} className="text-xs hover:bg-muted/20">
                  <TableCell className="p-2 font-mono text-muted-foreground">{time}</TableCell>
                  <TableCell className={`p-2 font-mono ${
                    trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.price.toFixed(6)}
                  </TableCell>
                  <TableCell className="p-2 font-mono">{trade.amount.toLocaleString()}</TableCell>
                  <TableCell className="p-2 font-mono">{trade.total.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentTrades;
