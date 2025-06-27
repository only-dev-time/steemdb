
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAccountDetails } from '@/hooks/useAccountDetails';
import AccountHistory from '@/components/AccountHistory';
import AccountProfile from '@/components/AccountProfile';
import AccountStats from '@/components/AccountStats';
import AccountBalances from '@/components/AccountBalances';
import AccountMana from '@/components/AccountMana';
import AccountWitnessVotes from '@/components/AccountWitnessVotes';
import AccountPowerDown from '@/components/AccountPowerDown';
import AccountPublicKeys from '@/components/AccountPublicKeys';
import AccountAuths from '@/components/AccountAuths';

const AccountDetails = () => {
  const { username } = useParams();
  const { data: accountData, isLoading, error } = useAccountDetails(username || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="glass-card p-8">
            <div className="text-center">
              <div className="text-muted-foreground">Loading account details...</div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="glass-card p-8">
            <div className="text-center">
              <div className="text-destructive">Error loading account details</div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explorer
            </Button>
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Account Info */}
          <div className="space-y-6">
            <AccountProfile accountData={accountData} />
            <AccountStats accountData={accountData} />
            <AccountBalances accountData={accountData} />
            <AccountPowerDown accountData={accountData} />
            <AccountMana accountData={accountData} />
            <AccountWitnessVotes accountData={accountData} />
            <AccountAuths accountData={accountData} />
            <AccountPublicKeys accountData={accountData} />
          </div>

          {/* Right Column - Account History */}
          <div>
            <AccountHistory username={username || ''} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountDetails;
