import Header from '@/components/Header';
import StatsOverview from '@/components/StatsOverview';
import RecentBlocks from '@/components/RecentBlocks';
import NetworkProperties from '@/components/NetworkProperties';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Blaze Scanner
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the STEEM blockchain with Blaze Scanner. Track blocks, transactions, accounts, and network health in real-time.
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <RecentBlocks />
          </div>
          <div>
            <NetworkProperties />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
