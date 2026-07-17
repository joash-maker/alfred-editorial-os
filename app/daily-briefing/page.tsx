"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Loader2,
  PoundSterling,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  generateMissionIntelligence,
  type MissionLead,
} from "../../lib/intelligence/engine";
import { generateExecutiveBriefing } from "../../lib/intelligence/executive";

type Lead = MissionLead & {
  created_at: string;
  industry: string | null;
  source: string | null;
  interest: string | null;
  notes: string | null;
  priority: string | null;
  region: string | null;
};

type MissionMode = {
  title: string;
  greeting: string;
  objective: string;
};

type CreativeFocus = {
  title: string;
  status: string;
  href: string;
};

const targetMrr = 25500;

function formatMoney(value: number) {
  return `£${value.toLocaleString("en-GB")}`;
}

function normaliseStage(stage: string | null) {
  return (stage || "new").toLowerCase();
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

function formatFullDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCurrentMode(date: Date): MissionMode {
  const hour = date.getHours();

  if (hour < 9) {
    return {
      title: "Morning Startup",
      greeting: "Good morning",
      objective:
        "Prepare your mind, review the business and choose the right first move.",
    };
  }

  if (hour < 12) {
    return {
      title: "Morning Focus",
      greeting: "Good morning",
      objective:
        "Protect your focus and move the strongest opportunity forward.",
    };
  }

  if (hour < 17) {
    return {
      title: "Afternoon Briefing",
      greeting: "Good afternoon",
      objective:
        "Keep momentum, clear follow-ups and close important conversations.",
    };
  }

  if (hour < 22) {
    return {
      title: "Evening Builder",
      greeting: "Good evening",
      objective:
        "Build the asset or system that creates the greatest future value.",
    };
  }

  return {
    title: "Close Down Review",
    greeting: "Good evening",
    objective: "Finish well, capture the lesson and prepare tomorrow.",
  };
}

function getCreativeFocus(date: Date): CreativeFocus {
  const day = date.getDay();

  if (day === 2) {
    return {
      title: "Creative Guide",
      status: "Tuesday publishing focus",
      href: "/creative-desk",
    };
  }

  if (day === 4) {
    return {
      title: "Tech Thursday",
      status: "Thursday publishing focus",
      href: "/creative-desk",
    };
  }

  if (day === 0) {
    return {
      title: "Mindset Reset",
      status: "Sunday publishing focus",
      href: "/creative-desk",
    };
  }

  return {
    title: "No publication scheduled",
    status: "Use today to research, outline or improve the next issue.",
    href: "/creative-desk",
  };
}

function getLeadName(lead: Lead | null) {
  if (!lead) return "Unnamed lead";
  return lead.company || lead.name || "Unnamed lead";
}

export default function DailyBriefingPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [now, setNow] = useState<Date | null>(null);

  async function loadLeads() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/leads/list", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not load Mission Control.");
        return;
      }

      setLeads(data.leads || []);
      setMessage("Mission Control loaded from live CRM data.");
    } catch {
      setMessage("Something went wrong loading Mission Control.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setNow(new Date());
    loadLeads();

    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const currentDate = now ?? new Date();
  const mode = getCurrentMode(currentDate);
  const creativeFocus = getCreativeFocus(currentDate);

  const openLeads = useMemo(() => leads.filter(isOpenOpportunity), [leads]);

  const wonLeads = useMemo(
    () => leads.filter((lead) => normaliseStage(lead.stage) === "won"),
    [leads],
  );

  const potentialMrr = useMemo(
    () => openLeads.reduce((total, lead) => total + getMonthlyValue(lead), 0),
    [openLeads],
  );

  const wonMrr = useMemo(
    () => wonLeads.reduce((total, lead) => total + getMonthlyValue(lead), 0),
    [wonLeads],
  );

  const revenueGap = Math.max(targetMrr - wonMrr, 0);

  const dueActions = useMemo(
    () =>
      openLeads
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
        }),
    [openLeads],
  );

  const highestValueLead = useMemo(
    () =>
      [...openLeads].sort(
        (a, b) => getMonthlyValue(b) - getMonthlyValue(a),
      )[0] || null,
    [openLeads],
  );

  const highestScoreLead = useMemo(
    () =>
      [...openLeads].sort((a, b) => getLeadScore(b) - getLeadScore(a))[0] ||
      null,
    [openLeads],
  );

  const oldestFollowUp = dueActions[0] || null;

  const intelligence = useMemo(
    () =>
      generateMissionIntelligence({
        leads,
        targetMrr,
      }),
    [leads],
  );

  const executiveBriefing = useMemo(
    () =>
      generateExecutiveBriefing({
        leads,
        targetMrr,
        currentDate,
      }),
    [leads, currentDate],
  );

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Mission Control</div>
            <div className="logo-subtitle">
              Alfred&apos;s adaptive business command centre
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Step 45 · Alfred Executive Intelligence</div>

          <h1>{mode.greeting}, Joash. Here is what matters now.</h1>

          <p className="lead">{mode.objective}</p>

          <div className="mode-grid" style={{ marginTop: "18px" }}>
            <div className="mode">
              <strong>{mode.title}</strong>
              <span>{formatFullDate(currentDate)}</span>
              <span>{formatTime(currentDate)}</span>
            </div>

            <div className="mode">
              <strong>Today&apos;s Mission</strong>
              <span>{intelligence.mission}</span>
            </div>
          </div>

          <div className="actions" style={{ marginTop: "18px" }}>
            <button
              className="btn btn-secondary"
              onClick={loadLeads}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh Mission Control"}
            </button>
          </div>

          {message && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <strong>Status</strong>
              <span>{message}</span>
            </div>
          )}

          {loading && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <Loader2 size={18} />
              <span>Loading live business data...</span>
            </div>
          )}
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="kicker">Alfred Executive Brief</div>

          <div className="mode-grid" style={{ marginTop: "18px" }}>
            <div className="mode" style={{ gridColumn: "1 / -1" }}>
              <div
                className="actions"
                style={{ justifyContent: "space-between" }}
              >
                <strong>{executiveBriefing.headline}</strong>
                <span className="nav-pill">{executiveBriefing.source}</span>
              </div>
              <span>{executiveBriefing.summary}</span>
            </div>

            <div className="mode">
              <Target size={18} />
              <strong>Priority</strong>
              <span>{executiveBriefing.priority}</span>
              <span>{executiveBriefing.reason}</span>
            </div>

            <div className="mode">
              <Clock3 size={18} />
              <strong>Risk</strong>
              <span>{executiveBriefing.risk}</span>
            </div>

            <div className="mode">
              <TrendingUp size={18} />
              <strong>Opportunity</strong>
              <span>{executiveBriefing.opportunity}</span>
            </div>

            <div className="mode">
              <Sparkles size={18} />
              <strong>CEO Question</strong>
              <span>{executiveBriefing.question}</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Revenue Snapshot</div>

          <div className="daily-briefing-grid" style={{ marginTop: "18px" }}>
            <div className="daily-briefing-card">
              <Target size={22} />
              <span>Target MRR</span>
              <strong>{formatMoney(targetMrr)}</strong>
            </div>

            <div className="daily-briefing-card">
              <TrendingUp size={22} />
              <span>Pipeline MRR</span>
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
              <span>Open Opportunities</span>
              <strong>{openLeads.length}</strong>
            </div>

            <div className="daily-briefing-card">
              <CalendarClock size={22} />
              <span>Follow-ups Due</span>
              <strong>{dueActions.length}</strong>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Alfred Intelligence</div>

          <div className="mode-grid">
            {intelligence.insights.map((insight, index) => (
              <div className="mode" key={insight}>
                <Sparkles size={18} />
                <strong>Insight {index + 1}</strong>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Commercial Focus</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Highest value opportunity</strong>
              {highestValueLead ? (
                <>
                  <span>{getLeadName(highestValueLead)}</span>
                  <span>
                    {formatMoney(getMonthlyValue(highestValueLead))}/month
                  </span>
                  <span>Stage: {normaliseStage(highestValueLead.stage)}</span>
                </>
              ) : (
                <span>No value data yet. Add monthly values to CRM leads.</span>
              )}
            </div>

            <div className="mode">
              <strong>Highest score lead</strong>
              {highestScoreLead ? (
                <>
                  <span>{getLeadName(highestScoreLead)}</span>
                  <span>Score: {getLeadScore(highestScoreLead)}</span>
                  <span>
                    Next: {highestScoreLead.next_action || "No next action"}
                  </span>
                </>
              ) : (
                <span>No score data yet. Add lead scores to CRM leads.</span>
              )}
            </div>

            <div className="mode">
              <strong>Oldest follow-up due</strong>
              {oldestFollowUp ? (
                <>
                  <span>{getLeadName(oldestFollowUp)}</span>
                  <span>{oldestFollowUp.next_action || "Follow up"}</span>
                  <span>
                    Due:{" "}
                    {formatDate(
                      oldestFollowUp.next_action_date ||
                        oldestFollowUp.follow_up_date,
                    )}
                  </span>
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
            {intelligence.recommendedActions.map((action, index) => (
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
              <span>
                Use the space to strengthen your best opportunity or create a
                new sales conversation.
              </span>
            </div>
          ) : (
            <div className="mode-grid">
              {dueActions.slice(0, 9).map((lead) => (
                <div className="mode" key={lead.id}>
                  <strong>{getLeadName(lead)}</strong>
                  <span>{lead.next_action || "Follow up"}</span>
                  <span>
                    Due:{" "}
                    {formatDate(lead.next_action_date || lead.follow_up_date)}
                  </span>
                  <span>Value: {formatMoney(getMonthlyValue(lead))}/month</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Creative Desk</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Today&apos;s publication</strong>
              <span>{creativeFocus.title}</span>
              <span>{creativeFocus.status}</span>
            </div>

            <div className="mode">
              <strong>Publishing action</strong>
              <span>
                Open the Creative Desk to research, outline, write or prepare
                the next issue.
              </span>

              <Link className="nav-pill" href={creativeFocus.href}>
                Open Creative Desk
              </Link>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Divine Intelligence</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Pause before action</strong>
              <span>
                Seek wisdom, clarity and peace before making the next business
                decision.
              </span>
            </div>

            <div className="mode">
              <strong>Today&apos;s reflection</strong>
              <span>
                What would faithful stewardship look like in the next hour?
              </span>

              <Link className="nav-pill" href="/divine-intelligence">
                Open Divine Intelligence
              </Link>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">CEO Question</div>

          <div className="daily-focus-score">
            <Clock3 size={28} />
            <strong>One decision</strong>
            <span>{intelligence.ceoQuestion}</span>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Mission Readiness</div>

          <div className="daily-focus-score">
            <CheckCircle2 size={28} />
            <strong>{intelligence.readinessScore}/10</strong>
            <span>
              Better data creates better decisions. Keep opportunity values,
              lead scores and next actions current.
            </span>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Mission Complete</div>

          <div className="mode">
            <strong>Revenue before content.</strong>
            <span>Conversations before code.</span>
            <span>Relationships before automation.</span>
            <span>Build only what removes the next bottleneck.</span>
          </div>
        </section>
      </div>
    </main>
  );
}
