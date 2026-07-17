export type MissionLead = {
  id: string;
  name: string | null;
  company: string | null;
  stage: string | null;
  follow_up_date: string | null;
  estimated_value: number | null;
  monthly_value: number | null;
  score: number | null;
  lead_score: number | null;
  next_action: string | null;
  next_action_date: string | null;
};

export type MissionIntelligence = {
  mission: string;
  insights: string[];
  recommendedActions: string[];
  ceoQuestion: string;
  readinessScore: number;
};

type MissionInput = {
  leads: MissionLead[];
  targetMrr: number;
};

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

function isDueTodayOrOverdue(dateValue: string | null) {
  if (!dateValue) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);

  return date <= today;
}

function formatMoney(value: number) {
  return `£${value.toLocaleString("en-GB")}`;
}

function formatDate(dateValue: string | null) {
  if (!dateValue) return "No date";

  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function generateMissionIntelligence({
  leads,
  targetMrr,
}: MissionInput): MissionIntelligence {
  const openLeads = leads.filter(isOpenOpportunity);
  const potentialMrr = openLeads.reduce(
    (total, lead) => total + getMonthlyValue(lead),
    0,
  );

  const dueActions = openLeads
    .filter((lead) =>
      isDueTodayOrOverdue(lead.next_action_date || lead.follow_up_date),
    )
    .sort((a, b) => {
      const aDate = new Date(
        a.next_action_date || a.follow_up_date || "2999-12-31",
      ).getTime();
      const bDate = new Date(
        b.next_action_date || b.follow_up_date || "2999-12-31",
      ).getTime();
      return aDate - bDate;
    });

  const highestValueLead =
    [...openLeads].sort((a, b) => getMonthlyValue(b) - getMonthlyValue(a))[0] ||
    null;

  const highestScoreLead =
    [...openLeads].sort((a, b) => getLeadScore(b) - getLeadScore(a))[0] || null;

  const oldestFollowUp = dueActions[0] || null;

  const missingNextActions = openLeads.filter(
    (lead) =>
      !lead.next_action && !lead.next_action_date && !lead.follow_up_date,
  );

  const pipelinePercentage =
    targetMrr > 0 ? Math.round((potentialMrr / targetMrr) * 100) : 0;

  let mission = "Give every active opportunity a clear next action and date.";

  if (dueActions.length > 0) {
    mission = `Clear ${dueActions.length} due ${
      dueActions.length === 1 ? "follow-up" : "follow-ups"
    } before starting new work.`;
  } else if (highestValueLead) {
    mission = `Move ${getLeadName(
      highestValueLead,
    )} one stage closer to becoming a client.`;
  } else if (openLeads.length === 0) {
    mission =
      "Create one genuine sales conversation with a qualified prospect.";
  }

  const insights: string[] = [];

  if (highestValueLead) {
    insights.push(
      `${getLeadName(
        highestValueLead,
      )} is the highest-value open opportunity at ${formatMoney(
        getMonthlyValue(highestValueLead),
      )} per month.`,
    );
  } else {
    insights.push(
      "No open opportunity has a monthly value yet. Add values so Alfred can rank commercial priorities.",
    );
  }

  if (dueActions.length > 0) {
    insights.push(
      `${dueActions.length} ${
        dueActions.length === 1 ? "follow-up is" : "follow-ups are"
      } due today or overdue.`,
    );
  } else {
    insights.push(
      "No follow-ups are overdue. Use the space to create new conversations or strengthen an active opportunity.",
    );
  }

  if (missingNextActions.length > 0) {
    insights.push(
      `${missingNextActions.length} active ${
        missingNextActions.length === 1 ? "lead has" : "leads have"
      } no clear next action or date.`,
    );
  } else {
    insights.push(
      `Your current pipeline represents approximately ${pipelinePercentage}% of the £${targetMrr.toLocaleString(
        "en-GB",
      )} MRR target.`,
    );
  }

  const recommendedActions = [
    highestValueLead
      ? `Move the highest-value opportunity forward: ${getLeadName(
          highestValueLead,
        )} (${formatMoney(getMonthlyValue(highestValueLead))}/month).`
      : "Add monthly values to CRM so Alfred can identify the highest-value opportunity.",

    highestScoreLead
      ? `Prioritise the strongest-fit lead: ${getLeadName(
          highestScoreLead,
        )} (score ${getLeadScore(highestScoreLead)}).`
      : "Add lead scores to CRM so Alfred can identify the strongest-fit lead.",

    oldestFollowUp
      ? `Clear the oldest due follow-up: ${getLeadName(
          oldestFollowUp,
        )} (${formatDate(
          oldestFollowUp.next_action_date || oldestFollowUp.follow_up_date,
        )}).`
      : "Give the strongest active lead a dated next action.",
  ];

  const readinessScore = Math.min(
    10,
    Math.max(
      1,
      Math.round(
        (openLeads.length > 0 ? 3 : 0) +
          (potentialMrr > 0 ? 2 : 0) +
          (highestScoreLead ? 2 : 0) +
          (missingNextActions.length === 0 ? 2 : 0) +
          (dueActions.length === 0 ? 1 : 0),
      ),
    ),
  );

  return {
    mission,
    insights,
    recommendedActions,
    ceoQuestion: `If today ended in one hour, what single action would move Mediahubink closest to ${formatMoney(
      targetMrr,
    )} MRR?`,
    readinessScore,
  };
}
