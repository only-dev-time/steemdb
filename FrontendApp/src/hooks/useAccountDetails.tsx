
import { useQuery } from '@tanstack/react-query';
import config from '../config.json';

interface AccountAuth {
  account: string;
  weight: number;
}

interface AccountAuths {
  owner: AccountAuth[];
  active: AccountAuth[];
  posting: AccountAuth[];
}

interface AccountDetails {
  id: number;
  name: string;
  profile_pic: string;
  cover_pic: string;
  last_owner_update: string;
  last_account_update: string;
  created: string;
  recovery_account: string;
  post_count: number;
  voting_manabar: {
    current_mana: string;
    last_update_time: number;
  };
  downvote_manabar: {
    current_mana: string;
    last_update_time: number;
  };
  voting_power: number;
  balance: string;
  savings_balance: string;
  sbd_balance: string;
  savings_sbd_balance: string;
  reward_sbd_balance: string;
  reward_steem_balance: string;
  reward_vesting_balance: string;
  reward_vesting_steem: string;
  vesting_shares: string;
  delegated_vesting_shares: string;
  received_vesting_shares: string;
  vesting_withdraw_rate: string;
  next_vesting_withdrawal: string;
  withdrawn: string;
  to_withdraw: string;
  witnesses_voted_for: number;
  witness_votes: string[];
  reputation: string;
  human_reputation: number;
  public_keys: {
    owner: string;
    active: string;
    posting: string;
    memo: string;
  };
  account_auths: AccountAuths;
}

export const useAccountDetails = (username: string) => {
  return useQuery<AccountDetails>({
    queryKey: ['account-details', username],
    queryFn: async () => {
      const response = await fetch(`${config.blazer_api}/accounts_api/getAccount/${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch account details');
      }
      return response.json();
    },
    enabled: !!username,
  });
};
