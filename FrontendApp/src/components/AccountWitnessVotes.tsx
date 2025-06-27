
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface AccountData {
  witness_votes: string[];
  witnesses_voted_for: number;
}

interface AccountWitnessVotesProps {
  accountData: AccountData;
}

const AccountWitnessVotes = ({ accountData }: AccountWitnessVotesProps) => {
  if (accountData.witness_votes.length === 0) {
    return null;
  }

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Witness Votes ({accountData.witnesses_voted_for})</h2>
      <div className="grid grid-cols-2 gap-2">
        {accountData.witness_votes.map((witness, index) => (
          <Link 
            key={witness}
            to={`/account/${witness}`}
            className="p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 text-steem-accent-blue hover:text-steem-purple-blue text-sm"
          >
            @{witness}
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default AccountWitnessVotes;
