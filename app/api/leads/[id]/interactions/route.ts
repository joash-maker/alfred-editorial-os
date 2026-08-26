import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const VALID_STAGES = [
  "new",
  "contacted",
  "discovery",
  "demo-interest",
  "proposal-sent",
  "negotiation",
  "relationship-building",
  "won",
  "lost",
];

const VALID_CHANNELS = [
  "email",
  "phone",
  "linkedin",
  "whatsapp",
  "meeting",
  "demo",
  "website",
  "other",
];

const VALID_DIRECTIONS = [
  "outbound",
  "inbound",
];

function getSupabaseAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase environment variables are missing."
    );
  }

  return createClient(
    supabaseUrl,
    supabaseKey
  );
}

function cleanString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  return cleaned || null;
}

function cleanDate(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(cleaned)
  ) {
    return null;
  }

  return cleaned;
}

function cleanDateTime(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  if (!cleaned) {
    return null;
  }

  const parsed = new Date(cleaned);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

export async function GET(
  _req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const supabase =
      getSupabaseAdminClient();

    const { data, error } =
      await supabase
        .from("lead_interactions")
        .select("*")
        .eq("lead_id", id)
        .order("occurred_at", {
          ascending: false,
        });

    if (error) {
      return Response.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    return Response.json({
      interactions: data || [],
    });
  } catch (error) {
    console.error(
      "Interaction history error:",
      error
    );

    return Response.json(
      {
        error:
          "Something went wrong loading interaction history.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    const supabase =
      getSupabaseAdminClient();

    const summary =
      cleanString(body.summary);

    if (!summary) {
      return Response.json(
        {
          error:
            "Interaction summary is required.",
        },
        {
          status: 400,
        }
      );
    }

    const rawChannel =
      cleanString(body.channel) ||
      "other";

    const channel =
      VALID_CHANNELS.includes(
        rawChannel.toLowerCase()
      )
        ? rawChannel.toLowerCase()
        : "other";

    const rawDirection =
      cleanString(body.direction) ||
      "outbound";

    const direction =
      VALID_DIRECTIONS.includes(
        rawDirection.toLowerCase()
      )
        ? rawDirection.toLowerCase()
        : "outbound";

    const occurredAt =
      cleanDateTime(body.occurred_at) ||
      new Date().toISOString();

    const contactName =
      cleanString(body.contact_name);

    const outcome =
      cleanString(body.outcome);

    const nextAction =
      cleanString(body.next_action);

    const nextActionDate =
      cleanDate(body.next_action_date);

    const requestedStage =
      cleanString(body.stage);

    const stage =
      requestedStage &&
      VALID_STAGES.includes(
        requestedStage
      )
        ? requestedStage
        : null;

    const { data: lead, error: leadError } =
      await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

    if (leadError || !lead) {
      return Response.json(
        {
          error:
            leadError?.message ||
            "Lead not found.",
        },
        {
          status: 404,
        }
      );
    }

    const {
      data: interaction,
      error: interactionError,
    } = await supabase
      .from("lead_interactions")
      .insert({
        lead_id: id,
        occurred_at: occurredAt,
        contact_name: contactName,
        channel,
        direction,
        outcome,
        summary,
        next_action: nextAction,
        next_action_date:
          nextActionDate,
        source:
          cleanString(body.source) ||
          "alfred-command",
      })
      .select()
      .single();

    if (interactionError) {
      return Response.json(
        {
          error:
            interactionError.message,
        },
        {
          status: 400,
        }
      );
    }

    const leadUpdates: Record<
      string,
      unknown
    > = {};

    if (stage) {
      leadUpdates.stage = stage;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "next_action"
      )
    ) {
      leadUpdates.next_action =
        nextAction;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "next_action_date"
      )
    ) {
      leadUpdates.next_action_date =
        nextActionDate;

      leadUpdates.follow_up_date =
        nextActionDate;
    }

    if (body.mark_contacted !== false) {
      leadUpdates.last_contacted =
        occurredAt.slice(0, 10);
    }

    if (
      Object.keys(leadUpdates).length > 0
    ) {
      const {
        data: updatedLead,
        error: updateError,
      } = await supabase
        .from("leads")
        .update(leadUpdates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        await supabase
          .from("lead_interactions")
          .delete()
          .eq(
            "id",
            interaction.id
          );

        return Response.json(
          {
            error:
              updateError.message,
          },
          {
            status: 400,
          }
        );
      }

      return Response.json({
        interaction,
        lead: updatedLead,
      });
    }

    return Response.json({
      interaction,
      lead,
    });
  } catch (error) {
    console.error(
      "Record interaction error:",
      error
    );

    return Response.json(
      {
        error:
          "Something went wrong recording the interaction.",
      },
      {
        status: 500,
      }
    );
  }
}
