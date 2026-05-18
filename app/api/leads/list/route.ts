import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ leads: data });
  } catch {
    return Response.json(
      { error: "Something went wrong loading leads." },
      { status: 500 }
    );
  }
}
