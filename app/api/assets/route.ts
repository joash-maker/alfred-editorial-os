"use server";

import { NextRequest } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

function cleanArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function cleanText(value: unknown) {
  const cleaned = String(value ?? "").trim();
  return cleaned || null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const activeOnly =
      request.nextUrl.searchParams.get("active_only") !== "false";

    let query = supabaseAdmin
      .from("solution_assets")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ assets: data || [] });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not load solution assets.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const url = String(body.url ?? "").trim();

    if (!name || !url) {
      return Response.json(
        { error: "Name and URL are required." },
        { status: 400 }
      );
    }

    const slug =
      String(body.slug ?? slugify(name)).trim() || slugify(name);

    const payload = {
      name,
      slug,
      url,
      family: cleanText(body.family),
      asset_type:
        String(body.asset_type ?? "proof-asset").trim() || "proof-asset",
      markets: cleanArray(body.markets),
      sectors: cleanArray(body.sectors),
      use_cases: cleanArray(body.use_cases),
      commercial_status:
        String(body.commercial_status ?? "active").trim() || "active",
      description: cleanText(body.description),
      best_used_for: cleanText(body.best_used_for),
      related_products: cleanArray(body.related_products),
      notes: cleanText(body.notes),
      last_reviewed_date: cleanText(body.last_reviewed_date),
      is_active: body.is_active !== false,
      sort_order: Number(body.sort_order ?? 0) || 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("solution_assets")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ asset: data }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create solution asset.",
      },
      { status: 500 }
    );
  }
}
