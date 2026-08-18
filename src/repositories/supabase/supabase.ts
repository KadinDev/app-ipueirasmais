import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/infra/env";

export const supabase = createClient(
  env.supabaseUrl || "https://example.supabase.co",
  env.supabaseAnonKey || "anon",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
);
