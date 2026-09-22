import { createBrowserClient } from '@supabase/ssr'

let _supabase: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
  if (!_supabase) {
    _supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    )
  }
  return _supabase
}

// Keep backward-compatible named export for existing imports
// This is safe because it's only used in "use client" components at runtime
export const supabase = typeof window !== 'undefined'
  ? getSupabase()
  : (null as unknown as ReturnType<typeof createBrowserClient>)