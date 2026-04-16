/**
 * Barrel re-export for all formatting utilities.
 *
 * Import from here instead of reaching into individual util files when you
 * need multiple formatters in the same module.
 */

export {
  formatCurrency,
  formatAmount,
  parseCurrency,
  convertUSDToINR,
  CURRENCY_SYMBOL,
  CURRENCY_CODE,
} from './currency';

/**
 * Format a date string (or Date object) into a human-readable string.
 */
export function formatDate(
  value: string | Date,
  locale = 'en-IN',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Truncate a string to `maxLength` characters, appending an ellipsis if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}\u2026`;
}
