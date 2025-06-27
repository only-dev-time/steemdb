import Header from '@/components/Header';
import { useWitnesses } from '@/hooks/useWitnesses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ExternalLink, Globe, Key, Calendar, Users, LayoutGrid, List, AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Witnesses = () => {
  const { data: witnesses, isLoading, error } = useWitnesses();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const formatVests = (vests: number) => {
    if (vests >= 1e15) {
      return (vests / 1e15).toFixed(3) + ' Peta VESTS';
    } else if (vests >= 1e12) {
      return (vests / 1e12).toFixed(3) + ' Tera VESTS';
    } else if (vests >= 1e9) {
      return (vests / 1e9).toFixed(3) + ' Giga VESTS';
    } else if (vests >= 1e6) {
      return (vests / 1e6).toFixed(3) + ' Million VESTS';
    } else if (vests >= 1e3) {
      return (vests / 1e3).toFixed(3) + 'K VESTS';
    } else {
      return vests.toFixed(3) + ' VESTS';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTimeSince = (dateString: string) => {
    const now = new Date();
    // Ensure the dateString is treated as UTC by adding 'Z' if not present
    const utcDateString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const feedTime = new Date(utcDateString);
    const diffMs = now.getTime() - feedTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffYears > 0) {
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${diffYears}y ${remainingMonths}m ago`;
    } else if (diffMonths > 0) {
      const remainingDays = diffDays % 30;
      return `${diffMonths}mo ${remainingDays}d ago`;
    } else if (diffDays > 0) {
      const remainingHours = diffHours % 24;
      return `${diffDays}d ${remainingHours}h ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes % 60}m ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  };

  const isOldFeed = (dateString: string) => {
    const now = new Date();
    // Ensure the dateString is treated as UTC by adding 'Z' if not present
    const utcDateString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const feedTime = new Date(utcDateString);
    const diffMs = now.getTime() - feedTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 2.5;
  };

  const isInactiveWitness = (signingKey: string) => {
    return signingKey === 'STM1111111111111111111111111111111114T1Anm';
  };

  const isOutdatedVersion = (version: string) => {
    return version !== '0.23.1';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">STEEM Witnesses</h1>
            <p className="text-muted-foreground">
              Active witnesses securing the STEEM blockchain and producing blocks
            </p>
            <div className="mt-2 text-sm text-muted-foreground space-y-1">
              <div><span className="text-red-500">■</span> Inactive witnesses (disabled signing key)</div>
              <div><span className="text-yellow-500">■</span> Witnesses with old price feeds (&gt;2.5h)</div>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'list' | 'grid')}>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">Loading witnesses...</div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-destructive">Error loading witnesses data</div>
            </CardContent>
          </Card>
        )}

        {witnesses && viewMode === 'list' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Top Witnesses ({witnesses.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Witness</TableHead>
                      <TableHead>Votes (VESTS)</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Missed Blocks</TableHead>
                      <TableHead>Price Feed</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {witnesses.map((witness) => {
                      const inactive = isInactiveWitness(witness.signing_key);
                      const outdated = isOutdatedVersion(witness.running_version);
                      const oldFeed = witness.last_feed_publish && isOldFeed(witness.last_feed_publish);
                      
                      let rowClass = "";
                      if (inactive) {
                        rowClass = "bg-red-50 hover:bg-red-100 border-red-200";
                      } else if (oldFeed) {
                        rowClass = "bg-yellow-50 hover:bg-yellow-100 border-yellow-200";
                      }
                      
                      return (
                        <TableRow 
                          key={witness._id}
                          className={rowClass}
                        >
                          <TableCell>
                            <Badge variant={witness.rank <= 20 ? "default" : "secondary"} className={inactive ? "bg-red-500 text-white" : oldFeed ? "bg-yellow-500 text-white" : ""}>
                              #{witness.rank}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <Link 
                                to={`/account/${witness._id}`}
                                className={`font-medium transition-colors ${
                                  inactive 
                                    ? "text-red-600 hover:text-red-700 line-through" 
                                    : oldFeed
                                    ? "text-yellow-700 hover:text-yellow-800"
                                    : "text-steem-accent-blue hover:text-steem-purple-blue"
                                }`}
                              >
                                @{witness._id}
                              </Link>
                              {witness.url && (
                                <a 
                                  href={witness.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-xs hover:text-foreground flex items-center gap-1 mt-1 ${
                                    inactive ? "text-red-400" : oldFeed ? "text-yellow-600" : "text-muted-foreground"
                                  }`}
                                >
                                  <Globe className="w-3 h-3" />
                                  Website
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`font-mono text-sm ${inactive ? "text-red-600" : oldFeed ? "text-yellow-700" : ""}`}>
                              {formatVests(witness.votes)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className={inactive ? "border-red-300 text-red-600" : oldFeed ? "border-yellow-300 text-yellow-700" : ""}>
                                {witness.running_version}
                              </Badge>
                              {outdated && !inactive && (
                                <div title="Outdated version">
                                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={
                              inactive 
                                ? "text-red-600" 
                                : oldFeed
                                ? "text-yellow-700"
                                : witness.total_missed > 1000 
                                  ? "text-orange-500" 
                                  : "text-muted-foreground"
                            }>
                              {witness.total_missed.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className={`text-sm flex items-center gap-1 ${inactive ? "text-red-600" : oldFeed ? "text-yellow-700" : ""}`}>
                                {witness.sbd_exchange_rate.base}
                                {oldFeed && !inactive && (
                                  <div title="Old price feed (>2.5h)">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                  </div>
                                )}
                              </div>
                              {witness.last_feed_publish && (
                                <div className={`flex items-center gap-1 text-xs ${
                                  inactive ? "text-red-400" : oldFeed ? "text-yellow-600" : "text-muted-foreground"
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  {formatTimeSince(witness.last_feed_publish)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-1 text-sm ${inactive ? "text-red-500" : oldFeed ? "text-yellow-600" : "text-muted-foreground"}`}>
                              <Calendar className="w-3 h-3" />
                              {formatDate(witness.created)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <button 
                                title="Signing Key"
                                className={`p-1 transition-colors ${
                                  inactive 
                                    ? "text-red-500 hover:text-red-600" 
                                    : oldFeed
                                    ? "text-yellow-600 hover:text-yellow-700"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                <Key className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {witnesses && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {witnesses.map((witness) => {
              const inactive = isInactiveWitness(witness.signing_key);
              const outdated = isOutdatedVersion(witness.running_version);
              const oldFeed = witness.last_feed_publish && isOldFeed(witness.last_feed_publish);
              
              let cardClass = "glass-card p-6 transition-colors h-full ";
              if (inactive) {
                cardClass += "border-red-300 bg-red-50 hover:bg-red-100";
              } else if (oldFeed) {
                cardClass += "border-yellow-300 bg-yellow-50 hover:bg-yellow-100";
              } else {
                cardClass += "hover:bg-secondary/5";
              }
              
              return (
                <Card 
                  key={witness._id} 
                  className={cardClass}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={witness.rank <= 20 ? "default" : "secondary"} className={inactive ? "bg-red-500 text-white" : oldFeed ? "bg-yellow-500 text-white" : ""}>
                        #{witness.rank}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className={inactive ? "border-red-300 text-red-600" : oldFeed ? "border-yellow-300 text-yellow-700" : ""}>
                          {witness.running_version}
                        </Badge>
                        {outdated && !inactive && (
                          <div title="Outdated version">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Link 
                        to={`/account/${witness._id}`}
                        className={`text-xl font-semibold transition-colors ${
                          inactive 
                            ? "text-red-600 hover:text-red-700 line-through" 
                            : oldFeed
                            ? "text-yellow-700 hover:text-yellow-800"
                            : "text-steem-accent-blue hover:text-steem-purple-blue"
                        }`}
                      >
                        @{witness._id}
                      </Link>
                      {witness.url && (
                        <a 
                          href={witness.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm hover:text-foreground flex items-center gap-1 mt-1 ${
                            inactive ? "text-red-400" : oldFeed ? "text-yellow-600" : "text-muted-foreground"
                          }`}
                        >
                          <Globe className="w-3 h-3" />
                          Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="space-y-3 flex-1">
                      <div>
                        <div className={`text-sm ${inactive ? "text-red-500" : oldFeed ? "text-yellow-600" : "text-muted-foreground"}`}>Votes</div>
                        <div className={`font-mono text-sm font-medium ${inactive ? "text-red-600" : oldFeed ? "text-yellow-700" : ""}`}>
                          {formatVests(witness.votes)}
                        </div>
                      </div>
                      
                      <div>
                        <div className={`text-sm ${inactive ? "text-red-500" : oldFeed ? "text-yellow-600" : "text-muted-foreground"}`}>Missed Blocks</div>
                        <span className={
                          inactive 
                            ? "text-red-600 font-medium" 
                            : oldFeed
                            ? "text-yellow-700 font-medium"
                            : witness.total_missed > 1000 
                              ? "text-orange-500 font-medium" 
                              : "text-foreground"
                        }>
                          {witness.total_missed.toLocaleString()}
                        </span>
                      </div>
                      
                      <div>
                        <div className={`text-sm ${inactive ? "text-red-500" : oldFeed ? "text-yellow-600" : "text-muted-foreground"}`}>Price Feed</div>
                        <div className={`text-sm flex items-center gap-1 ${inactive ? "text-red-600" : oldFeed ? "text-yellow-700" : ""}`}>
                          {witness.sbd_exchange_rate.base}
                          {oldFeed && !inactive && (
                            <div title="Old price feed (>2.5h)">
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            </div>
                          )}
                        </div>
                        {witness.last_feed_publish && (
                          <div className={`flex items-center gap-1 text-xs mt-1 ${inactive ? "text-red-400" : oldFeed ? "text-yellow-600" : "text-muted-foreground"}`}>
                            <Clock className="w-3 h-3" />
                            {formatTimeSince(witness.last_feed_publish)}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className={`text-sm ${inactive ? "text-red-500" : oldFeed ? "text-yellow-600" : "text-muted-foreground"}`}>Created</div>
                        <div className={`flex items-center gap-1 text-sm ${inactive ? "text-red-500" : oldFeed ? "text-yellow-600" : ""}`}>
                          <Calendar className="w-3 h-3" />
                          {formatDate(witness.created)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                      <Button 
                        title="Signing Key"
                        variant="outline"
                        size="sm"
                        className={`flex items-center gap-1 ${
                          inactive 
                            ? "border-red-300 text-red-600 hover:bg-red-50" 
                            : oldFeed
                            ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                            : ""
                        }`}
                      >
                        <Key className="w-4 h-4" />
                        View Key
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Witnesses;
