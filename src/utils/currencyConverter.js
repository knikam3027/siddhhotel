// Currency conversion utility
// Exchange rate: 1 USD = 83.50 INR (as of Feb 2026)
const USD_TO_INR_RATE = 83.50;

/**
 * Converts USD to INR
 * @param {number} usdAmount - Amount in USD
 * @returns {number} Converted amount in INR
 */
export const convertUSDtoINR = (usdAmount) => {
  if (!usdAmount || isNaN(usdAmount)) return 0;
  return Math.round(usdAmount * USD_TO_INR_RATE);
};

/**
 * Formats price in INR with rupee symbol
 * @param {number} amount - Amount in INR
 * @returns {string} Formatted price string
 */
export const formatINRPrice = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Converts USD to INR and formats it
 * @param {number} usdAmount - Amount in USD
 * @returns {string} Formatted INR price
 */
export const convertAndFormatPrice = (usdAmount) => {
  const inrAmount = convertUSDtoINR(usdAmount);
  return formatINRPrice(inrAmount);
};

/**
 * Get the exchange rate
 * @returns {number} USD to INR exchange rate
 */
export const getExchangeRate = () => {
  return USD_TO_INR_RATE;
};
