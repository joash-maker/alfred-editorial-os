import { NextResponse } from "next/server";

import {
  generateClaudeExecutiveBriefing,
} from "../../../../lib/intelligence/claude";

import type {
  ExecutiveBriefing,
} from "../../../../lib/intelligence/executive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ExecutiveRequestBody = {
  ruleBriefing?: ExecutiveBriefing;
};

function isValidRuleBriefing(
  value: unknown
): value is ExecutiveBriefing {
  if (!value || typeof value !== "object") {
    return false;
  }

  const briefing = value as Partial<ExecutiveBriefing>;

  return (
    typeof briefing.headline === "string" &&
    typeof briefing.summary === "string" &&
    typeof briefing.priority === "string" &&
    typeof briefing.reason === "string" &&
    typeof briefing.risk === "string" &&
    typeof briefing.opportunity === "string" &&
    typeof briefing.question === "string" &&
    Array.isArray(briefing.principlesApplied) &&
    typeof briefing.missionIntelligence === "object" &&
    briefing.missionIntelligence !== null
  );
}

export async function POST(request: Request) {
  let ruleBriefing: ExecutiveBriefing | null = null;

  try {
    const body = (await request.json()) as ExecutiveRequestBody;

    if (!isValidRuleBriefing(body.ruleBriefing)) {
      return NextResponse.json(
        {
          error: "A valid rule-based briefing is required.",
        },
        {
          status: 400,
        }
      );
    }

    ruleBriefing = body.ruleBriefing;

    const claudeBriefing =
      await generateClaudeExecutiveBriefing({
        ruleBriefing,
      });

    return NextResponse.json({
      briefing: {
        ...ruleBriefing,
        ...claudeBriefing,
        principlesApplied:
          ruleBriefing.principlesApplied,
        missionIntelligence:
          ruleBriefing.missionIntelligence,
      },
      source: "claude",
      fallbackUsed: false,
    });
  } catch (error) {
    console.error(
      "Claude executive intelligence failed:",
      error
    );

    if (ruleBriefing) {
      return NextResponse.json({
        briefing: ruleBriefing,
        source: "rules",
        fallbackUsed: true,
      });
    }

    return NextResponse.json(
      {
        error:
          "Executive intelligence could not be generated.",
      },
      {
        status: 500,
      }
    );
  }
}
