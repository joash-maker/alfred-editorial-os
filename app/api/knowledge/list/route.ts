import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("knowledge")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ knowledge: data });
  } catch {
    return Response.json(
      { error: "Something went wrong loading knowledge." },
      { status: 500 }
    );
  }
}
