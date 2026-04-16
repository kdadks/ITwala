// Mock the Supabase clients so tests can import supabaseService
// without needing live environment variables.
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {},
  supabaseAdmin: null,
  supabaseUrl: 'https://example.supabase.co',
}));
