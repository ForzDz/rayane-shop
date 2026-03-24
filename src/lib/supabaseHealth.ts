import { supabase } from "@/lib/supabaseClient";

export async function checkSupabaseConnection(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    // On fait un select très simple pour valider URL/clé + accès DB.
    const { error } = await supabase.from("products").select("id").limit(1);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

