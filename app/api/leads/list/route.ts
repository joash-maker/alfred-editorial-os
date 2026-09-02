"use server";

import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

const PAGE_SIZE = 1000;

export async function GET() {
  try {
    const allLeads: Record<string, unknown>[] = [];
    let from = 0;
    let databaseTotal: number | null = null;

    while (true) {
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabaseAdmin
        .from("leads")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        return Response.json(
          { error: error.message },
          { status: 500 }
        );
      }

      const page = data || [];

      if (databaseTotal === null && typeof count === "number") {
        databaseTotal = count;
      }

      allLeads.push(...page);

      if (page.length < PAGE_SIZE) {
        break;
      }

      from += PAGE_SIZE;

      // Safety valve in case the database/API behaves unexpectedly.
      if (from > 100000) {
        break;
      }
    }

    return Response.json({
      leads: allLeads,
      total:
        databaseTotal ??
        allLeads.length,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not load leads.",
      },
      { status: 500 }
    );
  }
}
