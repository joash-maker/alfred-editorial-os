import Anthropic from "@anthropic-ai/sdk";

import type { ExecutiveBriefing } from "./executive";

export type ClaudeExecutiveBriefing = {
  source: "claude";
  headline: string;
  summary: string;
  priority: string;
  reason: string;
  risk: string;
  opportunity: string;
  question: string;
};

type GenerateClaudeExecutiveBriefingInput = {
  ruleBriefing: ExecutiveBriefing;
  currentDate?: Date;
};

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function extractText(
  content: Anthropic.Messages.Message["content"]
): string {
  return content
    .filter(
      (
        block
      ): block is Anthropic.Messages.TextBlock =>
        block.type === "text"
    )
    .map((block) => block.text)
    .join("\n");
}

function parseJsonResponse(text: string): ClaudeExecutiveBriefing {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  const parsed = JSON.parse(cleaned) as Partial<ClaudeExecutiveBriefing>;

  const requiredFields: Array<
    keyof Omit<ClaudeExecutiveBriefing, "source">
  > = [
    "headline",
    "summary",
    "priority",
    "reason",
    "risk",
    "opportunity",
    "question",
  ];

  for (const field of requiredFields) {
    if (
      typeof parsed[field] !== "string" ||
      !parsed[field]?.trim()
    ) {
      throw new Error(
        `Claude response is missing a valid ${field}.`
      );
    }
  }

  return {
    source: "claude",
    headline: parsed.headline!.trim(),
    summary: parsed.summary!.trim(),
    priority: parsed.priority!.trim(),
    reason: parsed.reason!.trim(),
    risk: parsed.risk!.trim(),
    opportunity: parsed.opportunity!.trim(),
    question: parsed.question!.trim(),
  };
}

export async function generateClaudeExecutiveBriefing({
  ruleBriefing,
  currentDate = new Date(),
}: GenerateClaudeExecutiveBriefingInput): Promise<ClaudeExecutiveBriefing> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const model =
    process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  const response = await anthropic.messages.create({
    model,
    max_tokens: 900,

    system: `
You are Alfred, a calm and commercially disciplined Chief of Staff
supporting the founder of Mediahubink.

Your role is to interpret business information and recommend the single
most important action.

Operating rules:

1. Use natural British English.
2. Never use em dashes.
3. Never flatter the founder.
4. Never exaggerate.
5. Prioritise revenue, customer relationships and execution.
6. Challenge distraction, unnecessary building and avoidance.
7. Do not invent facts, values, client details or deadlines.
8. Use only the information provided.
9. Give one main priority, not a long list.
10. Be direct, thoughtful and human.
11. Keep every field concise.
12. Return valid JSON only.
13. Do not use markdown or code fences.

Return exactly this JSON structure:

{
  "headline": "A clear diagnosis of the business situation",
  "summary": "A concise executive interpretation",
  "priority": "The single most important action",
  "reason": "Why this action matters now",
  "risk": "The most important current risk",
  "opportunity": "The strongest available opportunity",
  "question": "One challenging CEO question"
}
`.trim(),

    messages: [
      {
        role: "user",
        content: JSON.stringify(
          {
            currentDate: currentDate.toISOString(),
            ruleBasedAnalysis: {
              headline: ruleBriefing.headline,
              summary: ruleBriefing.summary,
              priority: ruleBriefing.priority,
              reason: ruleBriefing.reason,
              risk: ruleBriefing.risk,
              opportunity: ruleBriefing.opportunity,
              question: ruleBriefing.question,
              readinessScore:
                ruleBriefing.missionIntelligence.readinessScore,
              mission:
                ruleBriefing.missionIntelligence.mission,
              insights:
                ruleBriefing.missionIntelligence.insights,
              recommendedActions:
                ruleBriefing.missionIntelligence
                  .recommendedActions,
            },
          },
          null,
          2
        ),
      },
    ],
  });

  const text = extractText(response.content);

  if (!text) {
    throw new Error("Claude returned no text.");
  }

  return parseJsonResponse(text);
}
