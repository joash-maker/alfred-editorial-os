import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("offers")
      .select("id, name, offer_type, description, price, cta, status")
      .order("name", { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ offers: data });
  } catch {
    return Response.json(
      { error: "Something went wrong loading offers." },
      { status: 500 }
    );
  }
}
