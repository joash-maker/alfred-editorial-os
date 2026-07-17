import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

import type { ExecutiveBriefing } from "./executive";

export type CachedExecutiveBriefing = {
  briefing: ExecutiveBriefing;
  source: "claude" | "rules";
  inputHash: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

type SaveExecutiveBriefingInput = {
  cacheKey: string;
  briefing: ExecutiveBriefing;
  inputHash: string;
  source: "claude" | "rules";
  ttlMinutes?: number;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  if (!supabaseSecretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not configured.");
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export function createExecutiveInputHash(
  value: unknown
): string {
  return createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}

export async function getCachedExecutiveBriefing(
  cacheKey: string,
  inputHash: string
): Promise<CachedExecutiveBriefing | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("executive_intelligence_cache")
    .select(
      `
        briefing,
        source,
        input_hash,
        expires_at,
        created_at,
        updated_at
      `
    )
    .eq("cache_key", cacheKey)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to read executive intelligence cache:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  const isExpired =
    new Date(data.expires_at).getTime() <= Date.now();

  const inputHasChanged = data.input_hash !== inputHash;

  if (isExpired || inputHasChanged) {
    return null;
  }

  return {
    briefing: data.briefing as ExecutiveBriefing,
    source: data.source as "claude" | "rules",
    inputHash: data.input_hash,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function saveExecutiveBriefing({
  cacheKey,
  briefing,
  inputHash,
  source,
  ttlMinutes = 15,
}: SaveExecutiveBriefingInput): Promise<void> {
  const supabase = getSupabaseAdmin();

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + ttlMinutes * 60 * 1000
  );

  const { error } = await supabase
    .from("executive_intelligence_cache")
    .upsert(
      {
        cache_key: cacheKey,
        briefing,
        input_hash: inputHash,
        source,
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      },
      {
        onConflict: "cache_key",
      }
    );

  if (error) {
    throw new Error(
      `Failed to save executive intelligence cache: ${error.message}`
    );
  }
}
