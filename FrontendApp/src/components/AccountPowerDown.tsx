
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, TrendingDown } from 'lucide-react';
import { convertVestsToSP, extractVestsAmount } from '@/lib/formatter.js';

interface AccountData {
  vesting_withdraw_rate: string;
  next_vesting_withdrawal: string;
  withdrawn: string;
  to_withdraw: string;
}

interface AccountPowerDownProps {
  accountData: AccountData;
}

const AccountPowerDown = ({ accountData }: AccountPowerDownProps) => {
  const [withdrawRateSP, setWithdrawRateSP] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if power down is active
  const withdrawRate = extractVestsAmount(accountData.vesting_withdraw_rate);
  const isPowerDownActive = withdrawRate > 0;

  useEffect(() => {
    const convertValues = async () => {
      try {
        // Convert withdraw rate to SP
        const sp = await convertVestsToSP(withdrawRate);
        setWithdrawRateSP(sp);
      } catch (error) {
        console.error('Error converting values to SP:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isPowerDownActive) {
      convertValues();
    } else {
      setIsLoading(false);
    }
  }, [accountData, withdrawRate, isPowerDownActive]);

  // Don't render if power down is not active
  if (!isPowerDownActive) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card className="glass-card p-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
          <TrendingDown className="w-5 h-5 mr-2 text-destructive" />
          Power Down Active
        </h2>
        <div className="text-center text-muted-foreground">Converting VESTS to SP...</div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6 border-destructive/20">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
        <TrendingDown className="w-5 h-5 mr-2 text-destructive" />
        Power Down Active
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Weekly Withdrawal:</span>
          <span className="text-destructive font-bold">
            {withdrawRateSP !== null ? `${withdrawRateSP.toFixed(3)} SP` : accountData.vesting_withdraw_rate}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Next Withdrawal:</span>
          <span className="text-foreground font-medium flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatDate(accountData.next_vesting_withdrawal)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default AccountPowerDown;
