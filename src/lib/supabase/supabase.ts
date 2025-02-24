// lib/supabase.js
import { createClient } from '@supabase/supabase-js';
import {Database} from "../../../supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key are required');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);