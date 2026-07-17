import {
  generateMissionIntelligence,
  type MissionIntelligence,
  type MissionLead,
} from "./engine";

export type ExecutiveBriefing = {
  source: "rules" | "claude";
  headline: string;
  summary: string;
  priority: string;
  reason: string;
  risk: string;
  opportunity: string;
  question: string;
  principlesApplied: string[];
  missionIntelligence: MissionIntelligence;
};

type ExecutiveBriefingInput = {
  leads: MissionLead[];
  targetMrr: number;
  currentDate?: Date;
};

const operatingPrinciples = [
  "Revenue before features.",
  "Conversations before code.",
  "Relationships before automation.",
  "Finish before starting.",
  "Protect focus.",
  "Solve the bottleneck, not the symptom.",
  "Steward time wisely.",
];

function normaliseStage(stage: string | null) {
  return (stage || "new").toLowerCase();
}

function getMonthlyValue(lead: MissionLead) {
  return Number(lead.monthly_value ?? lead.estimated_value ?? 0);
}

function getLeadScore(lead: MissionLead) {
  return Number(lead.lead_score ?? lead.score ?? 0);
}

function getLeadName(lead: MissionLead | null) {
  if (!lead) return "Unnamed lead";
  return lead.company || lead.name || "Unnamed lead";
}

function isOpenOpportunity(lead: MissionLead) {
  const stage = normaliseStage(lead.stage);
  return stage !== "won" && stage !== "lost";
}

function isDueTodayOrOverdue(dateValue: string | null, currentDate: Date) {
  if (!dateValue) return false;

  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(dateValue);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate <= today;
}

function formatMoney(value: number) {
  return `£${value.toLocaleString("en-GB")}`;
}

function getTimeContext(date: Date) {
  const hour = date.getHours();

  if (hour < 9) return "before the working day begins";
  if (hour < 12) return "this morning";
  if (hour < 17) return "this afternoon";
  if (hour < 22) return "this evening";
  return "before finishing today";
}

export function generateExecutiveBriefing({
  leads,
  targetMrr,
  currentDate = new Date(),
}: ExecutiveBriefingInput): ExecutiveBriefing {
  const missionIntelligence = generateMissionIntelligence({
    leads,
    targetMrr,
  });

  const openLeads = leads.filter(isOpenOpportunity);

  const dueActions = openLeads.filter((lead) =>
    isDueTodayOrOverdue(
      lead.next_action_date || lead.follow_up_date,
      currentDate,
    ),
  );

  const missingNextActions = openLeads.filter(
    (lead) =>
      !lead.next_action && !lead.next_action_date && !lead.follow_up_date,
  );

  const highestValueLead =
    [...openLeads].sort((a, b) => getMonthlyValue(b) - getMonthlyValue(a))[0] ||
    null;

  const highestScoreLead =
    [...openLeads].sort((a, b) => getLeadScore(b) - getLeadScore(a))[0] || null;

  const pipelineMrr = openLeads.reduce(
    (total, lead) => total + getMonthlyValue(lead),
    0,
  );

  const pipelinePercentage =
    targetMrr > 0 ? Math.round((pipelineMrr / targetMrr) * 100) : 0;

  const timeContext = getTimeContext(currentDate);

  let headline =
    "The business needs one clear commercial action, not more activity.";

  let summary =
    "Alfred has reviewed the current CRM data and identified the most important next move.";

  let priority = "Give every active opportunity a clear next action and date.";

  let reason =
    "Clear next actions reduce uncertainty and make the pipeline easier to manage.";

  let risk =
    "Opportunities without clear ownership or dates can quietly become stale.";

  let opportunity =
    "A cleaner pipeline will make future sales decisions faster and more reliable.";

  if (dueActions.length > 0 && highestValueLead) {
    headline = "Execution is the current bottleneck, not lead generation.";

    summary = `There are ${dueActions.length} due ${
      dueActions.length === 1 ? "follow-up" : "follow-ups"
    }, while ${getLeadName(
      highestValueLead,
    )} remains the strongest immediate revenue opportunity.`;

    priority = `Contact ${getLeadName(
      highestValueLead,
    )} ${timeContext}, then clear the oldest overdue follow-ups.`;

    reason = `${getLeadName(highestValueLead)} represents ${formatMoney(
      getMonthlyValue(highestValueLead),
    )} in potential monthly recurring revenue.`;

    risk = `${dueActions.length} overdue ${
      dueActions.length === 1 ? "follow-up suggests" : "follow-ups suggest"
    } that opportunities may be ageing without a decision.`;

    opportunity =
      "Moving the strongest existing opportunity forward is likely to create value faster than starting another build.";
  } else if (dueActions.length > 0) {
    headline = "Follow-through is the most important job today.";

    summary = `${dueActions.length} ${
      dueActions.length === 1 ? "follow-up is" : "follow-ups are"
    } due or overdue. The immediate priority is restoring momentum across the pipeline.`;

    priority = `Clear the three oldest follow-ups ${timeContext}.`;

    reason =
      "Existing conversations are closer to revenue than unqualified new activity.";

    risk =
      "Delayed responses can reduce trust and make otherwise viable opportunities go cold.";

    opportunity =
      "A focused follow-up block could quickly reopen conversations that already have context.";
  } else if (highestValueLead) {
    headline = "The pipeline is under control. Now move the best opportunity.";

    summary = `${getLeadName(
      highestValueLead,
    )} is the highest-value active opportunity at ${formatMoney(
      getMonthlyValue(highestValueLead),
    )} per month.`;

    priority = `Move ${getLeadName(
      highestValueLead,
    )} one clear stage forward ${timeContext}.`;

    reason =
      "The strongest opportunity deserves attention before new projects or content work.";

    risk =
      "A healthy-looking pipeline can still stall when the best opportunity has no decisive next step.";

    opportunity = `The current pipeline represents approximately ${pipelinePercentage}% of the ${formatMoney(
      targetMrr,
    )} MRR target.`;
  } else if (openLeads.length === 0) {
    headline = "The immediate challenge is creating qualified conversations.";

    summary = "There are currently no active opportunities in the CRM.";

    priority = `Start one genuine conversation with a qualified prospect ${timeContext}.`;

    reason =
      "Without active opportunities, there is no reliable path to recurring revenue.";

    risk =
      "Continuing to build without creating demand will widen the gap between product development and sales.";

    opportunity =
      "One well-chosen conversation can create more value than another internal feature.";
  }

  if (missingNextActions.length > 0) {
    risk = `${missingNextActions.length} active ${
      missingNextActions.length === 1 ? "lead has" : "leads have"
    } no next action or follow-up date. This weakens pipeline control.`;
  }

  if (
    highestScoreLead &&
    highestValueLead &&
    highestScoreLead.id !== highestValueLead.id
  ) {
    opportunity = `${getLeadName(
      highestScoreLead,
    )} has the strongest lead score, while ${getLeadName(
      highestValueLead,
    )} has the highest monthly value. Decide whether fit or immediate revenue should lead today's effort.`;
  }

  return {
    source: "rules",
    headline,
    summary,
    priority,
    reason,
    risk,
    opportunity,
    question:
      "What are you tempted to work on today that is less important than the priority Alfred has identified?",
    principlesApplied: operatingPrinciples,
    missionIntelligence,
  };
}
