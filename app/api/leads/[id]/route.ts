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
        interest: body.interest || null,
        stage: body.stage || "new",
        notes: body.notes || null,
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
