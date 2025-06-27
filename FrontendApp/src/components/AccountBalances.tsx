
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { convertVestsToSP, extractVestsAmount } from '@/lib/formatter.js';

interface AccountData {
  balance: string;
  sbd_balance: string;
  vesting_shares: string;
  delegated_vesting_shares: string;
  received_vesting_shares: string;
}

interface AccountBalancesProps {
  accountData: AccountData;
}

const AccountBalances = ({ accountData }: AccountBalancesProps) => {
  const [vestingSharesSP, setVestingSharesSP] = useState<number | null>(null);
  const [delegatedSP, setDelegatedSP] = useState<number | null>(null);
  const [receivedSP, setReceivedSP] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const convertVestsValues = async () => {
      try {
        const vestingVests = extractVestsAmount(accountData.vesting_shares);
        const delegatedVests = extractVestsAmount(accountData.delegated_vesting_shares);
        const receivedVests = extractVestsAmount(accountData.received_vesting_shares);

        const [vestingSP, delegatedSPValue, receivedSPValue] = await Promise.all([
          convertVestsToSP(vestingVests),
          convertVestsToSP(delegatedVests),
          convertVestsToSP(receivedVests)
        ]);

        setVestingSharesSP(vestingSP);
        setDelegatedSP(delegatedSPValue);
        setReceivedSP(receivedSPValue);
      } catch (error) {
        console.error('Error converting VESTS to SP:', error);
      } finally {
        setIsLoading(false);
      }
    };

    convertVestsValues();
  }, [accountData]);

  if (isLoading) {
    return (
      <Card className="glass-card p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Account Balances</h2>
        <div className="text-center text-muted-foreground">Converting VESTS to SP...</div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Account Balances</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">STEEM:</span>
          <span className="text-foreground font-bold">{accountData.balance}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">SBD:</span>
          <span className="text-foreground font-bold">{accountData.sbd_balance}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Steem Power:</span>
          <span className="text-foreground font-bold">
            {vestingSharesSP !== null ? `${vestingSharesSP.toFixed(3)} SP` : accountData.vesting_shares}
          </span>
        </div>
        <div className="border-t border-border pt-3 mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground text-sm">Delegated Out:</span>
            <span className="text-red-500 text-sm">
              -{delegatedSP !== null ? `${delegatedSP.toFixed(3)} SP` : accountData.delegated_vesting_shares}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Delegated In:</span>
            <span className="text-green-500 text-sm">
              +{receivedSP !== null ? `${receivedSP.toFixed(3)} SP` : accountData.received_vesting_shares}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AccountBalances;
