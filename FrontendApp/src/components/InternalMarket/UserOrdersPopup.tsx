
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, User, Loader2, AlertCircle } from 'lucide-react';
import { useUserOpenOrders } from '@/hooks/useUserOpenOrders';

const UserOrdersPopup = () => {
  const [username, setUsername] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { userOrders, isLoading, error } = useUserOpenOrders(searchUsername);

  const handleSearch = () => {
    if (username.trim()) {
      setSearchUsername(username.trim());
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <User className="h-4 w-4 mr-2" />
          View User Orders
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>User Open Orders</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Enter username (e.g., chain-stats)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={!username.trim() || isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load user orders: {error}</span>
              </div>
            </div>
          )}

          {!searchUsername && !isLoading && (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Enter a username to view their open orders</div>
            </div>
          )}

          {searchUsername && !isLoading && !error && userOrders && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Showing open orders for: <span className="font-medium text-foreground">@{searchUsername}</span>
                {userOrders.open_orders && (
                  <span className="ml-2">({userOrders.open_orders.length} orders)</span>
                )}
              </div>
              
              {!userOrders.open_orders || userOrders.open_orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">No open orders found</div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead className="text-xs p-2">Type</TableHead>
                      <TableHead className="text-xs p-2">Price (SBD)</TableHead>
                      <TableHead className="text-xs p-2">STEEM Amount</TableHead>
                      <TableHead className="text-xs p-2">SBD Amount</TableHead>
                      <TableHead className="text-xs p-2">Created</TableHead>
                      <TableHead className="text-xs p-2">Expires</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userOrders.open_orders.map((order) => (
                      <TableRow key={order.id} className="text-xs hover:bg-muted/20">
                        <TableCell className="p-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            order.order_type === 'buy' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {order.order_type === 'buy' ? '🟢 BUY' : '🔴 SELL'}
                          </span>
                        </TableCell>
                        <TableCell className="p-2 font-mono">{order.price.toFixed(6)}</TableCell>
                        <TableCell className="p-2 font-mono">{order.steem_amount.toLocaleString()}</TableCell>
                        <TableCell className="p-2 font-mono">{order.sbd_amount.toFixed(3)}</TableCell>
                        <TableCell className="p-2 text-muted-foreground text-xs">
                          {formatDate(order.created)}
                        </TableCell>
                        <TableCell className="p-2 text-muted-foreground text-xs">
                          {formatDate(order.expiration)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserOrdersPopup;
