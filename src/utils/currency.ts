/**
 * Currency formatting utilities for ITwala Academy
 * Default currency: INR (Indian Rupees)
 */

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/**
 * Format a number as a currency string.
 * @param amount  - The amount to format (in full units, e.g. 2999 for ₹2,999)
 * @param options - currency: ISO 4217 code (default 'INR'); decimals; symbol fallback
 */
export const formatCurrency = (
  amount: number, 
  options: {
    currency?: string;
    symbol?: string;
    decimals?: number;
    locale?: string;
  } = {}
): string => {
  const currency = options.currency ?? CURRENCY_CODE;
  const decimals = options.decimals ?? 2;

  // Infer a sensible locale when not explicitly provided
  const defaultLocale: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    GBP: 'en-GB',
    EUR: 'de-DE',
  };
  const locale = options.locale ?? (defaultLocale[currency] || 'en-IN');

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    // Fallback when Intl is unavailable or currency code is unrecognised
    const symbol = options.symbol ?? CURRENCY_SYMBOL;
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