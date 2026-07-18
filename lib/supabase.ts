import { createClient } from "@supabase/supabase-js";

// Use placeholder credentials during build/compilation if env variables are not provided
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    "Warning: Supabase environment variables are missing. " +
    "Initializing with placeholder credentials. Live database queries will fail " +
    "until NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
