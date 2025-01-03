import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tzwmuvdnwxbhodguqdid.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6d211dmRud3hiaG9kZ3VxZGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNTEyOTEsImV4cCI6MjA1MDcyNzI5MX0.W0pgCKSUihTg4zMeh8jR8bgQLt8nJIICrW2HSgwenUw";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);