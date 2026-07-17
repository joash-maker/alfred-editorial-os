import { NextResponse } from "next/server";

import {
  createExecutiveInputHash,
  getCachedExecutiveBriefing,
  saveExecutiveBriefing,
} from "../../../../lib/intelligence/cache";

import {
  generateClaudeExecutiveBriefing,
} from "../../../../lib/intelligence/claude";

import type {
  ExecutiveBriefing,
} from "../../../../lib/intelligence/executive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_KEY = "mission-control";
const CACHE_TTL_MINUTES = 15;

type ExecutiveRequestBody = {
  ruleBriefing?: ExecutiveBriefing;
  forceRefresh?: boolean;
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

function createHashInput(ruleBriefing: ExecutiveBriefing) {
  return {
    headline: ruleBriefing.headline,
    summary: ruleBriefing.summary,
    priority: ruleBriefing.priority,
    reason: ruleBriefing.reason,
    risk: ruleBriefing.risk,
    opportunity: ruleBriefing.opportunity,
    question: ruleBriefing.question,
    principlesApplied: ruleBriefing.principlesApplied,
    missionIntelligence: ruleBriefing.missionIntelligence,
  };
}

export async function POST(request: Request) {
  let ruleBriefing: ExecutiveBriefing | null = null;

  try {
    const body =
      (await request.json()) as ExecutiveRequestBody;

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

    const inputHash = createExecutiveInputHash(
      createHashInput(ruleBriefing)
    );

    if (!body.forceRefresh) {
      const cached = await getCachedExecutiveBriefing(
        CACHE_KEY,
        inputHash
      );

      if (cached) {
        return NextResponse.json({
          briefing: cached.briefing,
          source: cached.source,
          fallbackUsed: cached.source === "rules",
          cacheHit: true,
          cachedAt: cached.updatedAt,
          expiresAt: cached.expiresAt,
        });
      }
    }

    const claudeBriefing =
      await generateClaudeExecutiveBriefing({
        ruleBriefing,
      });

    const enhancedBriefing: ExecutiveBriefing = {
      ...ruleBriefing,
      ...claudeBriefing,
      principlesApplied:
        ruleBriefing.principlesApplied,
      missionIntelligence:
        ruleBriefing.missionIntelligence,
    };

    await saveExecutiveBriefing({
      cacheKey: CACHE_KEY,
      briefing: enhancedBriefing,
      inputHash,
      source: "claude",
      ttlMinutes: CACHE_TTL_MINUTES,
    });

    return NextResponse.json({
      briefing: enhancedBriefing,
      source: "claude",
      fallbackUsed: false,
      cacheHit: false,
    });
  } catch (error) {
    console.error(
      "Claude executive intelligence failed:",
      error
    );

    if (ruleBriefing) {
      const inputHash = createExecutiveInputHash(
        createHashInput(ruleBriefing)
      );

      try {
        await saveExecutiveBriefing({
          cacheKey: CACHE_KEY,
          briefing: ruleBriefing,
          inputHash,
          source: "rules",
          ttlMinutes: 5,
        });
      } catch (cacheError) {
        console.error(
          "Failed to cache rule-based fallback:",
          cacheError
        );
      }

      return NextResponse.json({
        briefing: ruleBriefing,
        source: "rules",
        fallbackUsed: true,
        cacheHit: false,
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
