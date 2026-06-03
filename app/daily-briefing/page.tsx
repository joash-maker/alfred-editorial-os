"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Loader2,
  PoundSterling,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

type Lead = {
  id: string;
  created_at: string;
  name: string | null;
  company: string | null;
  industry: string | null;
  source: string | null;
  interest: string | null;
  stage: string | null;
  notes: string | null;
  follow_up_date: string | null;
  estimated_value: number | null;
  monthly_value: number | null;
  score: number | null;
  lead_score: number | null;
  priority: string | null;
  next_action: string | null;
  next_action_date: string | null;
  region: string | null;
};

const targetMrr = 25500;

function formatMoney(value: number) {
  return `£${value.toLocaleString("en-GB")}`;
}

function normaliseStage(stage: string | null) {
  return stage || "new";
}

function getMonthlyValue(lead: Lead) {
  return Number(lead.monthly_value ?? lead.estimated_value ?? 0);
}

function getLeadScore(lead: Lead) {
  return Number(lead.lead_score ?? lead.score ?? 0);
}

function isOpenOpportunity(lead: Lead) {
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

function formatDate(dateValue: string | null) {
  if (!dateValue) return "No date";

  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DailyBriefingPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadLeads() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/leads/list", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not load daily briefing.");
        return;
      }

      setLeads(data.leads || []);
      setMessage("Daily briefing loaded from CRM.");
    } catch {
      setMessage("Something went wrong loading daily briefing.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const openLeads = useMemo(() => leads.filter(isOpenOpportunity), [leads]);
  const wonLeads = useMemo(
    () => leads.filter((lead) => normaliseStage(lead.stage) === "won"),
    [leads]
  );

  const potentialMrr = useMemo(
    () => openLeads.reduce((total, lead) => total + getMonthlyValue(lead), 0),
    [openLeads]
  );

  const wonMrr = useMemo(
    () => wonLeads.reduce((total, lead) => total + getMonthlyValue(lead), 0),
    [wonLeads]
  );

  const revenueGap = Math.max(targetMrr - wonMrr, 0);

  const dueActions = useMemo(
    () =>
      openLeads
        .filter((lead) => isDueTodayOrOverdue(lead.next_action_date || lead.follow_up_date))
        .sort((a, b) => {
          const aDate = new Date(a.next_action_date || a.follow_up_date || "2999-12-31").getTime();
          const bDate = new Date(b.next_action_date || b.follow_up_date || "2999-12-31").getTime();
          return aDate - bDate;
        }),
    [openLeads]
  );

  const highestValueLead = useMemo(() => {
    return [...openLeads].sort((a, b) => getMonthlyValue(b) - getMonthlyValue(a))[0] || null;
  }, [openLeads]);

  const highestScoreLead = useMemo(() => {
    return [...openLeads].sort((a, b) => getLeadScore(b) - getLeadScore(a))[0] || null;
  }, [openLeads]);

  const oldestFollowUp = dueActions[0] || null;

  const recommendedActions = [
    highestValueLead
      ? `Move the highest-value opportunity forward: ${highestValueLead.company || highestValueLead.name || "Unnamed lead"} (${formatMoney(getMonthlyValue(highestValueLead))}/month).`
      : "Add monthly values to CRM so Alfred can identify the highest-value opportunity.",
    highestScoreLead
      ? `Prioritise the strongest-fit lead: ${highestScoreLead.company || highestScoreLead.name || "Unnamed lead"} (${getLeadScore(highestScoreLead)}/40).`
      : "Add lead scores to CRM so Alfred can identify the strongest-fit lead.",
    oldestFollowUp
      ? `Clear the oldest due follow-up: ${oldestFollowUp.company || oldestFollowUp.name || "Unnamed lead"} (${formatDate(oldestFollowUp.next_action_date || oldestFollowUp.follow_up_date)}).`
      : "Add next action dates to CRM so Alfred can surface due follow-ups.",
  ];

  const focusScore = Math.min(
    10,
    Math.max(
      1,
      Math.round(
        (openLeads.length > 0 ? 3 : 0) +
          (dueActions.length > 0 ? 2 : 0) +
          (potentialMrr > 0 ? 2 : 0) +
          (highestScoreLead ? getLeadScore(highestScoreLead) / 15 : 0)
      )
    )
  );

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Daily Briefing</div>
            <div className="logo-subtitle">
              Alfred&apos;s morning command centre
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Step 30 · Daily Briefing Engine</div>
          <h1>Good morning, Joash. Here is what needs attention today.</h1>
          <p className="lead">
            This page reads live CRM data and turns it into a simple daily focus:
            revenue, relationships, pipeline and follow-up.
          </p>

          <div className="actions" style={{ marginTop: "18px" }}>
            <button className="btn btn-secondary" onClick={loadLeads} disabled={loading}>
              {loading ? "Loading..." : "Refresh Briefing"}
            </button>
          </div>

          {message && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <strong>Status:</strong>
              <span>{message}</span>
            </div>
          )}

          {loading && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <Loader2 size={18} />
              <span>Loading CRM briefing...</span>
            </div>
          )}
        </section>

        <section className="daily-briefing-grid" style={{ marginTop: "28px" }}>
          <div className="daily-briefing-card">
            <Target size={22} />
            <span>Target MRR</span>
            <strong>{formatMoney(targetMrr)}</strong>
          </div>

          <div className="daily-briefing-card">
            <TrendingUp size={22} />
            <span>Potential MRR</span>
            <strong>{formatMoney(potentialMrr)}</strong>
          </div>

          <div className="daily-briefing-card">
            <PoundSterling size={22} />
            <span>Won MRR</span>
            <strong>{formatMoney(wonMrr)}</strong>
          </div>

          <div className="daily-briefing-card">
            <Target size={22} />
            <span>Revenue Gap</span>
            <strong>{formatMoney(revenueGap)}</strong>
          </div>

          <div className="daily-briefing-card">
            <Users size={22} />
            <span>Active Opportunities</span>
            <strong>{openLeads.length}</strong>
          </div>

          <div className="daily-briefing-card">
            <CalendarClock size={22} />
            <span>Follow-ups Due</span>
            <strong>{dueActions.length}</strong>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Today&apos;s Focus</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Highest value opportunity</strong>
              {highestValueLead ? (
                <>
                  <span>{highestValueLead.company || highestValueLead.name || "Unnamed lead"}</span>
                  <span>{formatMoney(getMonthlyValue(highestValueLead))}/month</span>
                  <span>Stage: {normaliseStage(highestValueLead.stage)}</span>
                </>
              ) : (
                <span>No value data yet. Add monthly value to CRM leads.</span>
              )}
            </div>

            <div className="mode">
              <strong>Highest score lead</strong>
              {highestScoreLead ? (
                <>
                  <span>{highestScoreLead.company || highestScoreLead.name || "Unnamed lead"}</span>
                  <span>Score: {getLeadScore(highestScoreLead)}/40</span>
                  <span>Next: {highestScoreLead.next_action || "No next action"}</span>
                </>
              ) : (
                <span>No score data yet. Add lead scores to CRM leads.</span>
              )}
            </div>

            <div className="mode">
              <strong>Oldest follow-up due</strong>
              {oldestFollowUp ? (
                <>
                  <span>{oldestFollowUp.company || oldestFollowUp.name || "Unnamed lead"}</span>
                  <span>{oldestFollowUp.next_action || "Follow up"}</span>
                  <span>Due: {formatDate(oldestFollowUp.next_action_date || oldestFollowUp.follow_up_date)}</span>
                </>
              ) : (
                <span>No overdue follow-ups. Keep every lead dated.</span>
              )}
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Recommended Actions</div>

          <div className="mode-grid">
            {recommendedActions.map((action, index) => (
              <div className="mode" key={action}>
                <strong>Action {index + 1}</strong>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Due Follow-ups</div>

          {dueActions.length === 0 ? (
            <div className="mode">
              <strong>Nothing overdue.</strong>
              <span>Nice. Now add tomorrow&apos;s next actions before you forget.</span>
            </div>
          ) : (
            <div className="mode-grid">
              {dueActions.slice(0, 9).map((lead) => (
                <div className="mode" key={lead.id}>
                  <strong>{lead.company || lead.name || "Unnamed lead"}</strong>
                  <span>{lead.next_action || "Follow up"}</span>
                  <span>Due: {formatDate(lead.next_action_date || lead.follow_up_date)}</span>
                  <span>Value: {formatMoney(getMonthlyValue(lead))}/month</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Focus Score</div>

          <div className="daily-focus-score">
            <CheckCircle2 size={28} />
            <strong>{focusScore}/10</strong>
            <span>
              This score rises when Alfred has active opportunities, due follow-ups,
              clear monthly values and lead scores. Better data means better advice.
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
