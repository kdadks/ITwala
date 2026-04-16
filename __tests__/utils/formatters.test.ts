import { formatDate, truncate } from '../../src/utils/formatters';

describe('formatters', () => {
  describe('formatDate', () => {
    it('formats an ISO date string', () => {
      const result = formatDate('2024-01-15');
      // In en-IN locale the month is written out in full
      expect(result).toContain('2024');
      expect(result).toContain('15');
    });

    it('accepts a Date object', () => {
      const date = new Date(2024, 0, 15); // January 15 2024 (local)
      const result = formatDate(date);
      expect(result).toContain('2024');
    });

    it('accepts custom locale and options', () => {
      const result = formatDate('2024-01-15', 'en-US', { month: 'short', year: 'numeric' });
      expect(result).toMatch(/Jan\s?2024/);
    });
  });

  describe('truncate', () => {
    it('returns the string unchanged when it is short enough', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('truncates and appends an ellipsis', () => {
      const result = truncate('hello world', 8);
      expect(result).toHaveLength(8);
      expect(result.endsWith('…')).toBe(true);
    });

    it('handles exact-length strings without truncation', () => {
      expect(truncate('hello', 5)).toBe('hello');
    });
  });
});
