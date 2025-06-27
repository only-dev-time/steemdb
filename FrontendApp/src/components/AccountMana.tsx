
import { Card } from '@/components/ui/card';

interface ManaBar {
  current_mana: string;
  last_update_time: number;
}

interface AccountData {
  voting_manabar: ManaBar;
  downvote_manabar: ManaBar;
}

interface AccountManaProps {
  accountData: AccountData;
}

const AccountMana = ({ accountData }: AccountManaProps) => {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="glass-card p-4">
        <h3 className="text-lg font-bold text-foreground mb-3">Voting Mana</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Current:</span>
            <span className="text-foreground font-mono text-sm">{parseInt(accountData.voting_manabar.current_mana).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Updated:</span>
            <span className="text-foreground text-xs">{formatTimestamp(accountData.voting_manabar.last_update_time)}</span>
          </div>
        </div>
      </Card>
      <Card className="glass-card p-4">
        <h3 className="text-lg font-bold text-foreground mb-3">Downvote Mana</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Current:</span>
            <span className="text-foreground font-mono text-sm">{parseInt(accountData.downvote_manabar.current_mana).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Updated:</span>
            <span className="text-foreground text-xs">{formatTimestamp(accountData.downvote_manabar.last_update_time)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountMana;
