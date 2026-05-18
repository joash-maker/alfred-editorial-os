import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("thoughts")
      .select("id, created_at, title, category, content, status")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ thoughts: data });
  } catch {
    return Response.json(
      { error: "Something went wrong loading thoughts." },
      { status: 500 }
    );
  }
}
