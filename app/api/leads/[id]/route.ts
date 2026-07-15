import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("leads")
      .update({
        name: body.name || null,
        company: body.company || null,
        email: body.email || null,
        phone: body.phone || null,
        industry: body.industry || null,
        source: body.source || null,
        interest: body.interest || null,
        solution: body.solution || "Not decided",
        stage: body.stage || "new",
        notes: body.notes || null,
        follow_up_date: body.follow_up_date || body.next_action_date || null,
        estimated_value: body.estimated_value ?? body.monthly_value ?? null,
        monthly_value: body.monthly_value ?? body.estimated_value ?? null,
        score: body.score ?? body.lead_score ?? null,
        lead_score: body.lead_score ?? body.score ?? null,
        next_action: body.next_action || null,
        next_action_date: body.next_action_date || body.follow_up_date || null,
        region: body.region || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ lead: data });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong updating the lead." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong deleting the lead." },
      { status: 500 }
    );
  }
}
