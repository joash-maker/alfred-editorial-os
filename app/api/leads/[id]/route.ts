import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return Response.json(
        { error: "Supabase environment variables are missing." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const supabase = createClient(supabaseUrl, supabaseKey);

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
