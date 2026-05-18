import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("demos")
      .select("id, vertical, demo_url, cta, notes, status")
      .order("vertical", { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ demos: data });
  } catch {
    return Response.json(
      { error: "Something went wrong loading demos." },
      { status: 500 }
    );
  }
}
