import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const createSupabaseClient = (
  supabaseUrl: string,
  supabaseKey: string
) => {
  return createClient<Database>(supabaseUrl, supabaseKey);
};

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;