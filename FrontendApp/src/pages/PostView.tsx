import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Heart, MessageCircle, DollarSign, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { usePostDetails } from '@/hooks/usePostDetails';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PostView = () => {
  const { author, permlink } = useParams();
  const { data: postData, isLoading, error } = usePostDetails(author, permlink);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    });
  };

  const formatVoteWeight = (weight: number) => {
    if (weight >= 1000000) {
      return `${(weight / 1000000).toFixed(1)}M`;
    } else if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)}K`;
    }
    return weight.toString();
  };

  const formatVotePercent = (percent: number) => {
    return `${(percent / 100).toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-steem-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading post...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Failed to load post</p>
            <p className="text-muted-foreground mt-2">Post not found or API error</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explorer
            </Button>
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Post Content - Takes up 3/4 of the width */}
          <div className="lg:col-span-3">
            {/* Post Header */}
            <Card className="p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-4">{postData.title}</h1>
                  <div className="flex items-center space-x-6 text-muted-foreground mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <Link to={`/account/${postData.author}`} className="text-steem-accent hover:text-steem-bright transition-colors font-medium">
                        @{postData.author}
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatTimestamp(postData.created)}</span>
                    </div>
                  </div>

                  {/* Post Stats */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span>{postData.stats.net_votes} votes</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <MessageCircle className="w-4 h-4" />
                      <span>{postData.stats.children} comments</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>{postData.stats.payout}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {postData.metadata.tags && postData.metadata.tags.length > 0 && (
                <div className="flex items-start space-x-2 mb-4">
                  <Tag className="w-4 h-4 text-muted-foreground mt-1" />
                  <div className="flex flex-wrap gap-2">
                    {postData.metadata.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Community:</span>
                <span className="px-2 py-1 bg-steem-accent/20 text-steem-accent rounded text-sm font-medium">
                  {postData.category}
                </span>
              </div>
            </Card>

            {/* Post Content */}
            <Card className="p-6">
              <div className="prose prose-invert max-w-none prose-lg">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Style images
                    img: ({ ...props }) => (
                      <img 
                        {...props} 
                        className="max-w-full h-auto rounded-lg my-4" 
                        loading="lazy"
                      />
                    ),
                    // Style links
                    a: ({ href, children, ...props }) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-steem-accent hover:text-steem-bright transition-colors underline"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    // Style tables
                    table: ({ children, ...props }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border border-border rounded-lg" {...props}>
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children, ...props }) => (
                      <th className="border border-border bg-secondary/50 px-4 py-2 text-left font-semibold" {...props}>
                        {children}
                      </th>
                    ),
                    td: ({ children, ...props }) => (
                      <td className="border border-border px-4 py-2" {...props}>
                        {children}
                      </td>
                    ),
                    // Style blockquotes
                    blockquote: ({ children, ...props }) => (
                      <blockquote className="border-l-4 border-steem-accent pl-4 my-4 italic text-muted-foreground" {...props}>
                        {children}
                      </blockquote>
                    ),
                    // Style code blocks
                    code: ({ className, children, ...props }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-secondary px-1 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-secondary p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                          {children}
                        </code>
                      );
                    },
                    // Style headings
                    h1: ({ children, ...props }) => (
                      <h1 className="text-3xl font-bold text-foreground mb-4 mt-6" {...props}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2 className="text-2xl font-bold text-foreground mb-3 mt-5" {...props}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3 className="text-xl font-bold text-foreground mb-2 mt-4" {...props}>
                        {children}
                      </h3>
                    ),
                    // Style paragraphs
                    p: ({ children, ...props }) => (
                      <p className="text-foreground leading-relaxed mb-4" {...props}>
                        {children}
                      </p>
                    ),
                    // Style lists
                    ul: ({ children, ...props }) => (
                      <ul className="list-disc list-inside mb-4 space-y-1" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-1" {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-foreground" {...props}>
                        {children}
                      </li>
                    ),
                  }}
                >
                  {postData.body}
                </ReactMarkdown>
              </div>
            </Card>
          </div>

          {/* Sidebar - Post Information - Takes up 1/4 of the width */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <Card className="p-4">
                <h3 className="text-lg font-bold text-foreground mb-4">Post Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Details</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Post ID:</span>
                        <span className="text-foreground">{postData.id}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="text-foreground text-xs">{formatTimestamp(postData.created)}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground">Last Update:</span>
                        <span className="text-foreground text-xs">{formatTimestamp(postData.last_update)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">App:</span>
                        <span className="text-foreground">{postData.metadata.app}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Links</h4>
                    <div className="space-y-2">
                      <a 
                        href={postData.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-steem-accent hover:text-steem-bright transition-colors text-xs block"
                      >
                        View on Steemit →
                      </a>
                      <div className="text-xs text-muted-foreground break-all">
                        Permalink: {postData.permlink}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Voters Section */}
              {postData.voters && postData.voters.length > 0 && (
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">Voters</h3>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">{postData.voters_count}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {postData.voters.slice(0, 50).map((voter, index) => (
                      <div key={voter.voter} className="flex items-center justify-between p-2 bg-secondary/20 rounded text-xs">
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/account/${voter.voter}`} 
                            className="text-steem-accent hover:text-steem-bright transition-colors font-medium truncate block"
                          >
                            @{voter.voter}
                          </Link>
                          <div className="text-muted-foreground text-xs mt-1">
                            {formatTimestamp(voter.time)}
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-foreground font-medium">
                            {formatVotePercent(voter.percent)}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {formatVoteWeight(voter.weight)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {postData.voters.length > 50 && (
                      <div className="text-center text-muted-foreground text-xs py-2">
                        Showing top 50 of {postData.voters_count} voters
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostView;
