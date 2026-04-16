import { formatCurrency, formatAmount, parseCurrency, convertUSDToINR, CURRENCY_SYMBOL, CURRENCY_CODE } from '../../src/utils/currency';

describe('currency utils', () => {
  describe('formatCurrency', () => {
    it('formats zero correctly', () => {
      const result = formatCurrency(0, { decimals: 0 });
      expect(result).toContain('0');
      expect(result).toContain('₹');
    });

    it('formats a positive integer with no decimals', () => {
      const result = formatCurrency(1000, { decimals: 0 });
      expect(result).toContain('1,000');
    });

    it('formats with two decimal places by default', () => {
      const result = formatCurrency(1234.5);
      expect(result).toMatch(/1,234\.50/);
    });

    it('falls back gracefully on unsupported locale', () => {
      // Should not throw even with an unusual locale
      expect(() => formatCurrency(100, { locale: 'invalid-LOCALE' })).not.toThrow();
    });
  });

  describe('formatAmount', () => {
    it('prepends the rupee symbol', () => {
      expect(formatAmount(500)).toBe('₹500.00');
    });

    it('respects custom decimal places', () => {
      expect(formatAmount(1234, 0)).toBe('₹1234');
    });
  });

  describe('parseCurrency', () => {
    it('strips the rupee symbol and parses', () => {
      expect(parseCurrency('₹1,234.56')).toBeCloseTo(1234.56);
    });

    it('returns 0 for empty or invalid strings', () => {
      expect(parseCurrency('')).toBe(0);
      expect(parseCurrency('not-a-number')).toBe(0);
    });

    it('strips dollar sign', () => {
      expect(parseCurrency('$99.99')).toBeCloseTo(99.99);
    });
  });

  describe('convertUSDToINR', () => {
    it('converts at the default rate of 83', () => {
      expect(convertUSDToINR(1)).toBe(83);
    });

    it('uses a custom rate when provided', () => {
      expect(convertUSDToINR(10, 90)).toBe(900);
    });
  });

  describe('constants', () => {
    it('exports the correct symbol and code', () => {
      expect(CURRENCY_SYMBOL).toBe('₹');
      expect(CURRENCY_CODE).toBe('INR');
    });
  });
});
