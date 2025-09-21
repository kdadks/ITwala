/**
 * Currency formatting utilities for ITwala Academy
 * Default currency: INR (Indian Rupees)
 */

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/**
 * Format a number as INR currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number, 
  options: {
    symbol?: string;
    decimals?: number;
    locale?: string;
  } = {}
): string => {
  const {
    symbol = CURRENCY_SYMBOL,
    decimals = 2,
    locale = 'en-IN'
  } = options;

  try {
    // Use Intl.NumberFormat for proper localization
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: CURRENCY_CODE,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    
    return formatter.format(amount);
  } catch (error) {
    // Fallback to manual formatting if Intl is not supported
    return `${symbol}${amount.toFixed(decimals)}`;
  }
};

/**
 * Format amount with just the symbol (for backward compatibility)
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with currency symbol
 */
export const formatAmount = (amount: number, decimals: number = 2): string => {
  return `${CURRENCY_SYMBOL}${amount.toFixed(decimals)}`;
};

/**
 * Parse a currency string back to a number
 * @param currencyString - The currency string to parse
 * @returns Parsed number or 0 if invalid
 */
export const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;
  
  // Remove currency symbols and parse
  const cleanString = currencyString
    .replace(/[₹$,\s]/g, '')
    .replace(/[^\d.-]/g, '');
    
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Convert USD to INR (for data migration if needed)
 * Note: This uses a rough conversion rate. For real applications,
 * use a proper currency conversion API
 * @param usdAmount - Amount in USD
 * @param conversionRate - USD to INR rate (default: 83)
 * @returns Amount in INR
 */
export const convertUSDToINR = (usdAmount: number, conversionRate: number = 83): number => {
  return usdAmount * conversionRate;
};