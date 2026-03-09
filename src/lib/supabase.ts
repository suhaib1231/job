import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isMockMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL';

let _supabase: SupabaseClient | null = null;

const createMockClient = () => {
  const mockFn: any = () => ({
    data: null,
    error: null,
    count: 0,
    single: () => Promise.resolve({ data: null, error: null }),
    select: () => mockFn(),
    insert: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    eq: () => mockFn(),
    order: () => mockFn(),
    upload: () => Promise.resolve({ data: null, error: null }),
    getPublicUrl: () => ({ data: { publicUrl: '' } }),
  });

  const mockAuth: any = {
    signUp: () => Promise.resolve({ data: { user: { id: 'mock-user' } }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: { id: 'mock-user' }, session: { user: { id: 'mock-user' } } }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: () => Promise.resolve({ data: { session: null } }),
  };

  const mockStorage: any = {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    })
  };

  return {
    auth: mockAuth,
    from: () => mockFn(),
    storage: mockStorage,
  } as unknown as SupabaseClient;
};

export const supabase = isMockMode 
  ? createMockClient() 
  : createClient(supabaseUrl, supabaseAnonKey);
