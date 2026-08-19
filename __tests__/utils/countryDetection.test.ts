import { resolveCountryFromRequest, fromNextRequest, fromPagesReq, validateCountry, SUPPORTED_COUNTRIES } from '../../src/utils/countryDetection';

function mockReq(overrides: {
  cookies?: Record<string, string>;
  headers?: Record<string, string | string[] | undefined>;
} = {}): any {
  return {
    cookies: overrides.cookies ?? {},
    headers: overrides.headers ?? {},
  };
}

describe('resolveCountryFromRequest', () => {
  it('returns cookie when present and valid', () => {
    const req = mockReq({ cookies: { user_country: 'US' } });
    const result = resolveCountryFromRequest(req);
    expect(result.country).toBe('US');
    expect(result.detected).toBe(true);
    expect(result.source).toBe('cookie');
  });

  it('ignores invalid cookie value', () => {
    const req = mockReq({ cookies: { user_country: 'XX' } });
    const result = resolveCountryFromRequest(req);
    expect(result.country).toBe('IN');
    expect(result.detected).toBe(false);
    expect(result.source).toBe('default');
  });

  it('falls back to Cloudflare when no cookie', () => {
    const req = mockReq({
      cookies: {},
      headers: { 'cf-ipcountry': 'IE' },
    });
    const result = resolveCountryFromRequest(req);
    expect(result.country).toBe('EU');
    expect(result.detected).toBe(true);
    expect(result.source).toBe('cloudflare');
  });

  it('maps EU country codes to EU grouping', () => {
    const req = mockReq({
      cookies: {},
      headers: { 'cf-ipcountry': 'DE' },
    });
    const result = resolveCountryFromRequest(req);
    expect(result.country).toBe('EU');
    expect(result.detected).toBe(true);
  });

  it('falls back to Vercel header when no cookie or Cloudflare', () => {
    const req = mockReq({
      cookies: {},
      headers: { 'x-vercel-ip-country': 'GB' },
    });
    const result = resolveCountryFromRequest(req);
    expect(result.country).toBe('GB');
    expect(result.detected).toBe(true);
    expect(result.source).toBe('vercel');
  });

  it('defaults to IN when no headers and no cookie', () => {
    const req = mockReq({ cookies: {} });
    const result = resolveCountryFromRequest(req);
    expect(result.country).toBe('IN');
    expect(result.detected).toBe(false);
    expect(result.source).toBe('default');
  });

  it('cookie takes precedence over Cloudflare', () => {
    const req = mockReq({
      cookies: { user_country: 'IN' },
      headers: { 'cf-ipcountry': 'US' },
    });
    const result = resolveCountryFromRequest(req);
    expect(result.country).toBe('IN');
    expect(result.detected).toBe(true);
    expect(result.source).toBe('cookie');
  });

  it('Cloudflare IN is detected (not defaulted)', () => {
    const req = mockReq({
      cookies: {},
      headers: { 'cf-ipcountry': 'IN' },
    });
    const result = resolveCountryFromRequest(req);
    expect(result.country).toBe('IN');
    expect(result.detected).toBe(true);
    expect(result.source).toBe('cloudflare');
  });

  it('handles case-insensitive Cloudflare header', () => {
    const req = mockReq({
      cookies: {},
      headers: { 'cf-ipcountry': 'ie' },
    });
    const result = resolveCountryFromRequest(req);
    expect(result.country).toBe('EU');
    expect(result.detected).toBe(true);
  });
});

describe('fromNextRequest adapter', () => {
  it('converts NextRequest cookies and headers', () => {
    const headerEntries: [string, string][] = [
      ['cf-ipcountry', 'GB'],
      ['x-vercel-ip-country', 'IE'],
    ];
    const mockNextRequest = {
      cookies: {
        getAll: () => [{ name: 'user_country', value: 'US' }],
      },
      headers: {
        get: (name: string) => {
          const entry = headerEntries.find(([k]) => k === name);
          return entry ? entry[1] : null;
        },
        forEach: (cb: (value: string, key: string) => void) => {
          headerEntries.forEach(([k, v]) => cb(v, k));
        },
      },
    } as any;

    const raw = fromNextRequest(mockNextRequest);
    expect(raw.cookies['user_country']).toBe('US');
    expect(resolveCountryFromRequest(raw).country).toBe('US');
  });
});

describe('fromPagesReq adapter', () => {
  it('parses cookies from raw cookie header', () => {
    const req = {
      headers: {
        cookie: 'user_country=GB; session=abc123',
      },
    };
    const raw = fromPagesReq(req);
    expect(raw.cookies['user_country']).toBe('GB');
    expect(raw.cookies['session']).toBe('abc123');
  });

  it('resolves country from Pages Router request', () => {
    const req = {
      headers: {
        cookie: '',
        'cf-ipcountry': 'IE',
      },
    };
    const raw = fromPagesReq(req);
    const result = resolveCountryFromRequest(raw);
    expect(result.country).toBe('EU');
    expect(result.detected).toBe(true);
    expect(result.source).toBe('cloudflare');
  });
});

describe('validateCountry', () => {
  it.each(['US', 'GB', 'EU', 'IN'])('accepts %s', (code) => {
    expect(validateCountry(code)).toBe(code);
  });

  it('rejects unsupported codes', () => {
    expect(validateCountry('XX')).toBeNull();
    expect(validateCountry('')).toBeNull();
    expect(validateCountry(undefined)).toBeNull();
  });

  it('maps EU member states to EU', () => {
    expect(validateCountry('DE')).toBe('EU');
    expect(validateCountry('fr')).toBe('EU');
  });
});
