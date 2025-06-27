
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrderBook } from '@/hooks/useOrderBook';
import { useMarketPrice } from '@/hooks/useMarketPrice';

const OrderBook = () => {
  const { orderBookData, isLoading, error } = useOrderBook();
  const { priceData } = useMarketPrice();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Book</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-3 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !orderBookData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Book</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <div className="text-red-500">Failed to load order book</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort and limit orders for display - increased to 12 each
  const sellOrders = orderBookData.asks
    .sort((a, b) => a.price - b.price)
    .slice(0, 12);
  
  const buyOrders = orderBookData.bids
    .sort((a, b) => b.price - a.price)
    .slice(0, 12);

  const lastPrice = priceData?.last_price || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Order Book
          <span className="text-sm font-normal text-muted-foreground">
            {lastPrice.toFixed(6)} SBD
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {/* Sell Orders */}
          <div>
            <div className="px-4 py-2 bg-red-500/10 border-b">
              <h4 className="text-sm font-medium text-red-400">🔴 Sell Orders</h4>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="text-xs p-2">Price (SBD)</TableHead>
                  <TableHead className="text-xs p-2">STEEM</TableHead>
                  <TableHead className="text-xs p-2">Total (SBD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellOrders.reverse().map((order, index) => (
                  <TableRow 
                    key={index} 
                    className="text-xs hover:bg-red-500/5 order-sell-bg"
                  >
                    <TableCell className="p-2 font-mono text-red-400">{order.price.toFixed(6)}</TableCell>
                    <TableCell className="p-2 font-mono">{order.steem.toLocaleString()}</TableCell>
                    <TableCell className="p-2 font-mono">{order.sbd.toFixed(3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Buy Orders */}
          <div>
            <div className="px-4 py-2 bg-green-500/10 border-b">
              <h4 className="text-sm font-medium text-green-400">🟢 Buy Orders</h4>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="text-xs p-2">Price (SBD)</TableHead>
                  <TableHead className="text-xs p-2">STEEM</TableHead>
                  <TableHead className="text-xs p-2">Total (SBD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buyOrders.map((order, index) => (
                  <TableRow 
                    key={index} 
                    className="text-xs hover:bg-green-500/5 order-buy-bg"
                  >
                    <TableCell className="p-2 font-mono text-green-400">{order.price.toFixed(6)}</TableCell>
                    <TableCell className="p-2 font-mono">{order.steem.toLocaleString()}</TableCell>
                    <TableCell className="p-2 font-mono">{order.sbd.toFixed(3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBook;
