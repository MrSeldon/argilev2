/** Public Supabase settings (safe in the browser; row-level security does the guarding). */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

/** Private bucket for shelf photos and receipts: <user id>/<file>. */
export const UPLOAD_BUCKET = "argile-uploads";
