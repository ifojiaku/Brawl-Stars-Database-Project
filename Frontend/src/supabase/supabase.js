import { createClient } from '@supabase/supabase-js';

// console.log(import.meta.env.VITE_SUPABASE_URL);
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; 
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase_connection = createClient(supabaseUrl, supabaseKey);

