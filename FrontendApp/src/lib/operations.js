import { formatAmount, extractVestsAmount, formatAmountFromObject } from './formatters.js';
import { convertVestsToSP } from './api.js';

export const interpretOperation = async (operation) => {
  const [opType, opData] = operation;

  try {
    switch (opType) {
      case 'transfer':
        return `<a href="/account/${opData.from}">@${opData.from}</a> transferred ${formatAmount(opData.amount)} to <a href="/account/${opData.to}">@${opData.to}</a>`;
      case 'transfer_to_vesting':
        const recipient = opData.to || opData.from;
        return `<a href="/account/${opData.from}">@${opData.from}</a> powered up ${formatAmount(opData.amount)} to <a href="/account/${recipient}">@${recipient}</a>`;
      case 'withdraw_vesting':
        return `<a href="/account/${opData.account}">@${opData.account}</a> started power down of ${formatAmount(opData.vesting_shares)}`;
      case 'comment':
        if (opData.parent_author) {
          return `<a href="/account/${opData.author}">@${opData.author}</a> replied to <a href="/post/${opData.parent_author}/${opData.parent_permlink}">@${opData.parent_author}/${opData.parent_permlink}</a>`;
        } else {
          return `<a href="/account/${opData.author}">@${opData.author}</a> created post <a href="/post/${opData.author}/${opData.permlink}">${opData.title || opData.permlink}</a>`;
        }
      case 'vote':
        const voteType = opData.weight > 0 ? 'upvoted' : opData.weight < 0 ? 'downvoted' : 'removed vote on';
        return `<a href="/account/${opData.voter}">@${opData.voter}</a> ${voteType} <a href="/post/${opData.author}/${opData.permlink}">@${opData.author}/${opData.permlink}</a>`;
      case 'claim_reward_balance':
        const rewardVests = extractVestsAmount(opData.reward_vests);
        const rewardSP = await convertVestsToSP(rewardVests);
        const steemAmount = formatAmountFromObject(opData.reward_steem);
        const sbdAmount = formatAmountFromObject(opData.reward_sbd);
        
        // Build reward string with only non-zero values
        const rewardParts = [];
        if (steemAmount > 0) rewardParts.push(`${steemAmount.toFixed(3)} STEEM`);
        if (sbdAmount > 0) rewardParts.push(`${sbdAmount.toFixed(3)} SBD`);
        if (rewardSP > 0) rewardParts.push(`${rewardSP.toFixed(3)} SP`);
        
        const rewardString = rewardParts.length > 0 ? rewardParts.join(', ').replace(/, ([^,]*)$/, ' and $1') : 'rewards';
        
        return `@${opData.account} claimed ${rewardString}`;
      case 'claim_account':
        return `<a href="/account/${opData.creator}">@${opData.creator}</a> claimed account creation ticket`;
      case 'create_claimed_account':
        return `<a href="/account/${opData.creator}">@${opData.creator}</a> created account <a href="/account/${opData.new_account_name}">@${opData.new_account_name}</a>`;
      case 'account_update':
        return `<a href="/account/${opData.account}">@${opData.account}</a> updated their account`;
      case 'account_witness_vote':
        const witnessAction = opData.approve ? 'voted for' : 'removed vote from';
        return `<a href="/account/${opData.account}">@${opData.account}</a> ${witnessAction} witness <a href="/account/${opData.witness}">@${opData.witness}</a>`;
      case 'account_witness_proxy':
        if (!opData.proxy || opData.proxy === '') {
          return `<a href="/account/${opData.account}">@${opData.account}</a> cleared witness proxy`;
        }
        return `<a href="/account/${opData.account}">@${opData.account}</a> set witness proxy to <a href="/account/${opData.proxy}">@${opData.proxy}</a>`;
      case 'custom_json':
        return `<a href="/account/${opData.required_auths?.[0] || opData.required_posting_auths?.[0] || 'unknown'}">@${opData.required_auths?.[0] || opData.required_posting_auths?.[0] || 'unknown'}</a> executed custom JSON operation (${opData.id})`;
      case 'feed_publish':
        const baseRate = opData.exchange_rate?.base || 'N/A';
        const quoteRate = opData.exchange_rate?.quote || 'N/A';
        return `<a href="/account/${opData.publisher}">@${opData.publisher}</a> published feed with exchange rate ${baseRate} / ${quoteRate}`;
      case 'limit_order_create':
        return `<a href="/account/${opData.owner}">@${opData.owner}</a> created limit order to sell ${formatAmount(opData.amount_to_sell)} for ${formatAmount(opData.min_to_receive)}`;
      case 'limit_order_cancel':
        return `<a href="/account/${opData.owner}">@${opData.owner}</a> cancelled limit order #${opData.orderid}`;
      case 'delegate_vesting_shares':
        const delegateAction = parseFloat(formatAmount(opData.vesting_shares)) > 0 ? 'delegated' : 'removed delegation of';
        return `<a href="/account/${opData.delegator}">@${opData.delegator}</a> ${delegateAction} ${formatAmount(opData.vesting_shares)} to <a href="/account/${opData.delegatee}">@${opData.delegatee}</a>`;
      case 'escrow_transfer':
        return `<a href="/account/${opData.from}">@${opData.from}</a> started escrow transfer to <a href="/account/${opData.to}">@${opData.to}</a> with agent <a href="/account/${opData.agent}">@${opData.agent}</a>`;
      case 'escrow_approve':
        return `<a href="/account/${opData.who}">@${opData.who}</a> approved escrow transfer from <a href="/account/${opData.from}">@${opData.from}</a>`;
      case 'escrow_dispute':
        return `<a href="/account/${opData.who}">@${opData.who}</a> disputed escrow transfer from <a href="/account/${opData.from}">@${opData.from}</a>`;
      case 'escrow_release':
        return `<a href="/account/${opData.who}">@${opData.who}</a> released escrow transfer to <a href="/account/${opData.receiver}">@${opData.receiver}</a>`;
      case 'proposal_create':
        return `<a href="/account/${opData.creator}">@${opData.creator}</a> created proposal with subject: ${opData.subject}`;
      case 'proposal_update':
        return `<a href="/account/${opData.creator}">@${opData.creator}</a> updated proposal with subject: ${opData.subject}`;
      case 'proposal_vote':
        const proposalVote = opData.approve ? 'approved' : 'rejected';
        return `<a href="/account/${opData.voter}">@${opData.voter}</a> ${proposalVote} proposal by <a href="/account/${opData.proposal.creator}">@${opData.proposal.creator}</a>`;
      case 'witness_update':
        return `<a href="/account/${opData.owner}">@${opData.owner}</a> updated witness with block signing key`;
      
      // Virtual operations
      case 'producer_reward':
        const vestsAmount = extractVestsAmount(opData.vesting_shares);
        const spAmount = await convertVestsToSP(vestsAmount);
        return `@${opData.producer} produced block and received ${spAmount.toFixed(3)} SP as producer reward`;
      case 'curation_reward':
        const curationVests = extractVestsAmount(opData.reward);
        const curationSP = await convertVestsToSP(curationVests);
        return `@${opData.curator} received ${curationSP.toFixed(3)} SP as curation reward for voting on @${opData.comment_author}/${opData.comment_permlink}`;
      
      case 'author_reward':
        const steemReward = formatAmountFromObject(opData.steem_payout);
        const sbdReward = formatAmountFromObject(opData.sbd_payout);
        const authorVests = extractVestsAmount(opData.vesting_payout);
        const authorSP = await convertVestsToSP(authorVests);
        return `<a href="/account/${opData.author}">@${opData.author}</a> received ${steemReward.toFixed(3)} STEEM, ${sbdReward.toFixed(3)} SBD, and ${authorSP.toFixed(3)} SP as author reward for <a href="/post/${opData.author}/${opData.permlink}">@${opData.author}/${opData.permlink}</a>`;
      
      case 'comment_reward':
        return `<a href="/account/${opData.author}">@${opData.author}</a> received ${formatAmount(opData.payout)} as comment reward for <a href="/post/${opData.author}/${opData.permlink}">@${opData.author}/${opData.permlink}</a>`;
      case 'interest':
        return `<a href="/account/${opData.owner}">@${opData.owner}</a> received ${formatAmount(opData.interest)} SBD as interest payment`;
      case 'fill_vesting_withdraw':
        return `<a href="/account/${opData.from_account}">@${opData.from_account}</a> withdrew ${formatAmount(opData.withdrawn)} STEEM from vesting`;
      case 'fill_order':
        return `<a href="/account/${opData.current_owner}">@${opData.current_owner}</a> had limit order filled: ${formatAmount(opData.current_pays)} for ${formatAmount(opData.open_pays)}`;
      case 'effective_comment_vote':
        const effectiveVoteType = opData.weight > 0 ? 'upvote' : opData.weight < 0 ? 'downvote' : 'vote';
        return `<a href="/account/${opData.voter}">@${opData.voter}</a>'s ${effectiveVoteType} was applied to <a href="/post/${opData.author}/${opData.permlink}">@${opData.author}/${opData.permlink}</a>`;
      case 'ineffective_delete_comment':
        return `<a href="/account/${opData.author}">@${opData.author}</a>'s comment deletion attempt failed for <a href="/post/${opData.author}/${opData.permlink}">@${opData.author}/${opData.permlink}</a>`;
      case 'liquidity_reward':
        return `<a href="/account/${opData.owner}">@${opData.owner}</a> received ${formatAmount(opData.payout)} STEEM as liquidity reward`;
      case 'fill_convert_request':
        return `<a href="/account/${opData.owner}">@${opData.owner}</a> converted ${formatAmount(opData.amount_in)} SBD to ${formatAmount(opData.amount_out)} STEEM`;
      case 'comment_benefactor_reward':
        // Extract and format each payout type using the universal formatter
        const benefactorSbd = formatAmountFromObject(opData.sbd_payout);
        const benefactorSteem = formatAmountFromObject(opData.steem_payout);
        const benefactorVests = extractVestsAmount(opData.vesting_payout);
        const benefactorSP = await convertVestsToSP(benefactorVests);
        
        // Build reward string with only non-zero values
        const benefactorRewardParts = [];
        if (benefactorSbd > 0) benefactorRewardParts.push(`${benefactorSbd.toFixed(3)} SBD`);
        if (benefactorSteem > 0) benefactorRewardParts.push(`${benefactorSteem.toFixed(3)} STEEM`);
        if (benefactorSP > 0) benefactorRewardParts.push(`${benefactorSP.toFixed(3)} SP`);
        
        const benefactorRewardString = benefactorRewardParts.length > 0 ? benefactorRewardParts.join(', ').replace(/, ([^,]*)$/, ', and $1') : 'reward';
        
        return `<a href="/account/${opData.benefactor}">@${opData.benefactor}</a> received ${benefactorRewardString} as benefactor reward for <a href="/post/${opData.author}/${opData.permlink}">@${opData.author}/${opData.permlink}</a>`;
      case 'return_vesting_delegation':
        return `<a href="/account/${opData.account}">@${opData.account}</a> had ${formatAmount(opData.vesting_shares)} vesting delegation returned`;
      
      case 'update_proposal_votes':
        const voteAction = opData.approve ? 'voted for' : 'voted against';
        const proposalCount = opData.proposal_ids ? opData.proposal_ids.length : 0;
        
        if (proposalCount === 1) {
          return `<a href="/account/${opData.voter}">@${opData.voter}</a> ${voteAction} proposal #${opData.proposal_ids[0]}`;
        } else if (proposalCount > 1) {
          const proposalList = opData.proposal_ids.join(', ');
          return `<a href="/account/${opData.voter}">@${opData.voter}</a> ${voteAction} proposals #${proposalList}`;
        } else {
          return `<a href="/account/${opData.voter}">@${opData.voter}</a> updated proposal votes`;
        }
      
      default:
        return `Unrecognized operation: ${opType}`;
    }
  } catch (error) {
    console.error('Error interpreting operation:', error);
    return `Error formatting ${opType} operation`;
  }
};
