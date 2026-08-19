import { validateCountry, SUPPORTED_COUNTRIES } from '../../src/utils/countryDetection';

// Mock countryDetection — keep validateCountry real, mock rest
jest.mock('../../src/utils/countryDetection', () => ({
  ...jest.requireActual('../../src/utils/countryDetection'),
  detectCountryFromIP: jest.fn(() => Promise.resolve('IN')),
  getCoursePrice: jest.fn(),
}));

// Mock supabase with a chainable query builder
const mockSupabaseChain = () => ({
  select: jest.fn(() => mockSupabaseChain()),
  eq: jest.fn(() => mockSupabaseChain()),
  ilike: jest.fn(() => mockSupabaseChain()),
  textSearch: jest.fn(() => mockSupabaseChain()),
  order: jest.fn(() => mockSupabaseChain()),
  range: jest.fn(() => mockSupabaseChain()),
  in: jest.fn(() => mockSupabaseChain()),
  single: jest.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } })),
  then: jest.fn((cb: any) => cb({ data: [], error: null })),
});

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => mockSupabaseChain()),
  },
}));

import handler from '../../src/pages/api/courses/index';
import pricingHandler from '../../src/pages/api/pricing/course';

function createMockReq(query: Record<string, any>, cookies: Record<string, string> = {}): any {
  return {
    method: 'GET',
    query,
    cookies,
  };
}

function createMockRes() {
  const res: any = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    setHeader: jest.fn(() => res),
    headersSent: false,
  };
  return res;
}

describe('GET /api/courses — country validation', () => {
  it('defaults to IN when no country and no cookie', async () => {
    const req = createMockReq({});
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('rejects invalid country query param', async () => {
    const req = createMockReq({ country: 'XX' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid country code' });
  });

  it('uses cookie over query param', async () => {
    const req = createMockReq({ country: 'US' }, { user_country: 'GB' });
    const res = createMockRes();

    await handler(req, res);

    // Should succeed with cookie country (GB)
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('accepts valid country query param when no cookie', async () => {
    const req = createMockReq({ country: 'US' });
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});

describe('GET /api/pricing/course — country validation', () => {
  it('defaults to IN when no country and no cookie', async () => {
    const req = createMockReq({ courseId: '123' });
    const res = createMockRes();

    await pricingHandler(req, res);

    // Will return 404 from supabase, not 400 for country
    expect(res.status).not.toHaveBeenCalledWith(400);
  });

  it('rejects invalid country query param', async () => {
    const req = createMockReq({ courseId: '123', country: 'XX' });
    const res = createMockRes();

    await pricingHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid country code' });
  });

  it('requires courseId', async () => {
    const req = createMockReq({});
    const res = createMockRes();

    await pricingHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Course ID is required' });
  });
});
