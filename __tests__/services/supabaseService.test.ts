// Mock the Supabase client so this unit test file stays isolated
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {},
  supabaseAdmin: null,
  supabaseUrl: 'https://example.supabase.co',
}));

import { ServiceError, unwrap, unwrapOrNull } from '../../src/services/supabaseService';
import type { PostgrestError } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePostgrestError(message: string, code = 'PGRST116'): PostgrestError {
  return { message, code, details: null, hint: null, name: 'PostgrestError' };
}

// ---------------------------------------------------------------------------
// ServiceError
// ---------------------------------------------------------------------------

describe('ServiceError', () => {
  it('sets the name and message', () => {
    const err = new ServiceError('something went wrong');
    expect(err.name).toBe('ServiceError');
    expect(err.message).toBe('something went wrong');
  });

  it('copies code and details from the cause', () => {
    const cause = makePostgrestError('db error', '23505');
    const err = new ServiceError('wrapper message', cause);
    expect(err.code).toBe('23505');
  });
});

// ---------------------------------------------------------------------------
// unwrap
// ---------------------------------------------------------------------------

describe('unwrap', () => {
  it('returns data when there is no error', () => {
    const result = { data: { id: '1' }, error: null };
    expect(unwrap(result)).toEqual({ id: '1' });
  });

  it('throws ServiceError when error is present', () => {
    const result = { data: null, error: makePostgrestError('query failed') };
    expect(() => unwrap(result)).toThrow(ServiceError);
    expect(() => unwrap(result)).toThrow('query failed');
  });

  it('throws ServiceError when data is null with no error', () => {
    const result = { data: null, error: null };
    expect(() => unwrap(result)).toThrow(ServiceError);
    expect(() => unwrap(result)).toThrow('No data returned');
  });
});

// ---------------------------------------------------------------------------
// unwrapOrNull
// ---------------------------------------------------------------------------

describe('unwrapOrNull', () => {
  it('returns data when there is no error', () => {
    const result = { data: { id: '1' }, error: null };
    expect(unwrapOrNull(result)).toEqual({ id: '1' });
  });

  it('returns null when data is null and no error', () => {
    const result = { data: null, error: null };
    expect(unwrapOrNull(result)).toBeNull();
  });

  it('throws ServiceError when error is present', () => {
    const result = { data: null, error: makePostgrestError('not found') };
    expect(() => unwrapOrNull(result)).toThrow(ServiceError);
  });
});
