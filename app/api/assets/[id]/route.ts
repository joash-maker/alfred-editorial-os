"use server";

import { NextRequest } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

function cleanArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function cleanText(value: unknown) {
  const cleaned = String(value ?? "").trim();
  return cleaned || null;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const payload = {
      name: String(body.name ?? "").trim(),
      slug: String(body.slug ?? "").trim(),
      url: String(body.url ?? "").trim(),
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

    if (!payload.name || !payload.slug || !payload.url) {
      return Response.json(
        { error: "Name, slug and URL are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("solution_assets")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ asset: data });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not update solution asset.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { error } = await supabaseAdmin
      .from("solution_assets")
      .delete()
      .eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not delete solution asset.",
      },
      { status: 500 }
    );
  }
}
