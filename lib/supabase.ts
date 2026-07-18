import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Helper to validate if the Supabase URL is syntactically correct
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const supabaseUrl = isValidUrl(rawUrl) ? rawUrl : "https://placeholder-project.supabase.co";
const supabaseAnonKey = rawKey && rawKey !== "your-supabase-anon-key-here" ? rawKey : "placeholder-anon-key";

if (!isValidUrl(rawUrl) || !rawKey || rawKey === "your-supabase-anon-key-here") {
  console.warn(
    "Warning: Valid Supabase environment variables are missing. " +
    "Initializing with placeholder credentials. Live database queries will fail " +
    "until NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
