/**
 * @jest-environment jsdom
 */
import React, { useState, useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { useUserCountry } from '../../src/hooks/useUserCountry';

// Mock the countryDetection module
const mockGetCountryFromCookie = jest.fn();
const mockDetectCountryFromIP = jest.fn();

jest.mock('../../src/utils/countryDetection', () => ({
  getCountryFromCookie: (...args: any[]) => mockGetCountryFromCookie(...args),
  detectCountryFromIP: (...args: any[]) => mockDetectCountryFromIP(...args),
  SUPPORTED_COUNTRIES: {
    US: { code: 'US', currency: 'USD', symbol: '$', name: 'United States' },
    GB: { code: 'GB', currency: 'GBP', symbol: '£', name: 'United Kingdom' },
    EU: { code: 'EU', currency: 'EUR', symbol: '€', name: 'European Union' },
    IN: { code: 'IN', currency: 'INR', symbol: '₹', name: 'India' },
  },
}));

describe('useUserCountry', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    mockGetCountryFromCookie.mockReturnValue('IN');
    mockDetectCountryFromIP.mockResolvedValue('IN');
  });

  afterEach(() => {
    container.remove();
    jest.clearAllMocks();
  });

  function renderHook<T>(fn: () => T): { result: { current: T }; unmount: () => void } {
    let result: { current: T };

    const TestComponent = () => {
      result = { current: fn() };
      return null;
    };

    const root = createRoot(container);
    act(() => {
      root.render(<TestComponent />);
    });

    return {
      get result() {
        return result!;
      },
      unmount: () => {
        act(() => {
          root.unmount();
        });
      },
    };
  }

  it('uses initialCountry when provided and ignores stale cookie', () => {
    mockGetCountryFromCookie.mockReturnValue('IN'); // stale cookie
    const { result } = renderHook(() => useUserCountry('US'));
    expect(result.current.userCountry).toBe('US');
  });

  it('falls back to cookie when no initialCountry', () => {
    mockGetCountryFromCookie.mockReturnValue('GB');
    const { result } = renderHook(() => useUserCountry());
    expect(result.current.userCountry).toBe('GB');
  });

  it('defaults to IN when neither initialCountry nor cookie available', () => {
    mockGetCountryFromCookie.mockReturnValue('IN');
    const { result } = renderHook(() => useUserCountry());
    expect(result.current.userCountry).toBe('IN');
  });

  it('updates when cookie changes and no initialCountry', () => {
    const { result, unmount } = renderHook(() => useUserCountry());
    expect(result.current.userCountry).toBe('IN');

    // Change cookie to US and re-render
    mockGetCountryFromCookie.mockReturnValue('US');
    unmount();

    const { result: result2 } = renderHook(() => useUserCountry());
    expect(result2.current.userCountry).toBe('US');
  });
});
