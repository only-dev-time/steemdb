
import { User, Calendar, Award, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface AccountData {
  name: string;
  profile_pic?: string;
  cover_pic?: string;
  created: string;
  human_reputation: number;
  recovery_account: string;
}

interface AccountProfileProps {
  accountData: AccountData;
}

const AccountProfile = ({ accountData }: AccountProfileProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      {accountData.cover_pic && (
        <div className="rounded-lg overflow-hidden h-32 relative">
          <img 
            src={accountData.cover_pic} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}

      {/* Account Header */}
      <Card className="glass-card p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-steem-accent-blue to-steem-purple-blue flex items-center justify-center">
            {accountData.profile_pic ? (
              <img 
                src={accountData.profile_pic} 
                alt={`${accountData.name} profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-steem-light-blue" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">@{accountData.name}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(accountData.created)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Rep: {accountData.human_reputation.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Recovery: <Link to={`/account/${accountData.recovery_account}`} className="text-steem-accent hover:text-steem-bright">@{accountData.recovery_account}</Link></span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountProfile;
