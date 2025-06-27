
import config from '@/config.json';

export const convertVestsToSP = async (vests) => {
  try {
    const response = await fetch(`${config.blazer_api}/blocks_api/convertVestsToSteem?vests=${vests}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.steem; // Return the SP amount directly
  } catch (error) {
    console.error('Error converting VESTS to SP:', error);
    return vests; // Return original value if conversion fails
  }
};

export const fetchAccountData = async (accountName) => {
  try {
    const response = await fetch(`${config.blazer_api}/account_api/getAccount?account=${accountName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch account data:", error);
    return null;
  }
};
