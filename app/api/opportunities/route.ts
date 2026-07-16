import { createClient } from "@supabase/supabase-js";

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ opportunities: data || [] });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong loading opportunities." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdminClient();

    if (!body.lead_id) {
      return Response.json(
        { error: "A CRM lead ID is required." },
        { status: 400 }
      );
    }

    const initialTimeline = [
      {
        date: new Date().toISOString().slice(0, 10),
        title: "Converted from CRM",
        detail: "Opportunity record created from the live CRM lead.",
      },
    ];

    const { data, error } = await supabase
      .from("opportunities")
      .upsert(
        {
          lead_id: body.lead_id,
          company: body.company || body.name || null,
          contact_name: body.name || null,
          industry: body.industry || null,
          location: body.region || null,
          solution: body.solution || "Not decided",
          potential_mrr:
            body.monthly_value ?? body.estimated_value ?? null,
          probability: Number(body.probability ?? 25),
          stage: body.stage || "Discovery",
          status:
            body.stage === "won"
              ? "Won"
              : body.stage === "lost"
                ? "Lost"
                : "Active",
          priority: body.priority || "Medium",
          current_process: body.notes || null,
          outcome_summary:
            "Live opportunity created from Alfred CRM. Add the full commercial story as the opportunity develops.",
          lesson: null,
          next_action: body.next_action || null,
          review_date:
            body.next_action_date || body.follow_up_date || null,
          timeline: initialTimeline,
        },
        { onConflict: "lead_id" }
      )
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ opportunity: data });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong creating the opportunity." },
      { status: 500 }
    );
  }
}
