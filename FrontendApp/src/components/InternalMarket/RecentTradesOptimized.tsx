
import React, { memo, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRecentTradesOptimized } from '@/hooks/useRecentTradesOptimized';

const RecentTradesOptimized = memo(() => {
  const { trades, isLoading, error } = useRecentTradesOptimized();
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 10;

  // Memoize the paginated trades
  const paginatedData = useMemo(() => {
    const indexOfLastTrade = currentPage * tradesPerPage;
    const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
    const currentTrades = trades.slice(indexOfFirstTrade, indexOfLastTrade);
    const totalPages = Math.ceil(trades.length / tradesPerPage);

    return {
      currentTrades: currentTrades.map((trade, index) => {
        const time = new Date(trade.timestamp).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        });

        return {
          ...trade,
          time,
          key: `${trade.timestamp}-${index}` // Stable key for React
        };
      }),
      totalPages
    };
  }, [trades, currentPage, tradesPerPage]);

  const handleNextPage = () => {
    if (currentPage < paginatedData.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

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

  if (!paginatedData.currentTrades || paginatedData.currentTrades.length === 0) {
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
        <div className="flex items-center justify-between">
          <CardTitle>Recent Trades</CardTitle>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {paginatedData.totalPages}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead className="text-xs p-2">Time</TableHead>
              <TableHead className="text-xs p-2">Type</TableHead>
              <TableHead className="text-xs p-2">Price (SBD)</TableHead>
              <TableHead className="text-xs p-2">Amount (STEEM)</TableHead>
              <TableHead className="text-xs p-2">Total (SBD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.currentTrades.map((trade) => (
              <TableRow key={trade.key} className="text-xs hover:bg-muted/20">
                <TableCell className="p-2 font-mono text-muted-foreground">{trade.time}</TableCell>
                <TableCell className="p-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.type === 'buy' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className={`p-2 font-mono ${
                  trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trade.price.toFixed(6)}
                </TableCell>
                <TableCell className="p-2 font-mono">{trade.amount.toLocaleString()}</TableCell>
                <TableCell className="p-2 font-mono">{trade.total.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Showing {paginatedData.currentTrades.length} of {trades.length} trades
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === paginatedData.totalPages}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

RecentTradesOptimized.displayName = 'RecentTradesOptimized';

export default RecentTradesOptimized;
