import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const {
      name,
      company,
      email,
      phone,
      industry,
      source,
      interest,
      stage,
      notes,
      follow_up_date,
      estimated_value,
    } = await req.json();

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name: name || null,
        company: company || null,
        email: email || null,
        phone: phone || null,
        industry: industry || null,
        source: source || "manual",
        interest: interest || null,
        stage: stage || "new",
        notes: notes || null,
        follow_up_date: follow_up_date || null,
        estimated_value: estimated_value || null,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, lead: data });
  } catch {
    return Response.json(
      { error: "Something went wrong saving the lead." },
      { status: 500 }
    );
  }
}
