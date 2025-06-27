
import { Card } from '@/components/ui/card';

interface AccountData {
  post_count: number;
  human_reputation: number;
  witnesses_voted_for: number;
  voting_power: number;
}

interface AccountStatsProps {
  accountData: AccountData;
}

const AccountStats = ({ accountData }: AccountStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="glass-card p-4">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">{accountData.post_count.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Posts</p>
        </div>
      </Card>
      <Card className="glass-card p-4">
        <div className="text-center">
          <p className="text-xl font-bold text-steem-accent-blue">{accountData.human_reputation.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">Reputation</p>
        </div>
      </Card>
      <Card className="glass-card p-4">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">{accountData.witnesses_voted_for}</p>
          <p className="text-sm text-muted-foreground">Witnesses</p>
        </div>
      </Card>
      <Card className="glass-card p-4">
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">{accountData.voting_power}%</p>
          <p className="text-sm text-muted-foreground">Voting Power</p>
        </div>
      </Card>
    </div>
  );
};

export default AccountStats;
