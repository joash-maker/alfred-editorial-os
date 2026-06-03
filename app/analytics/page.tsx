"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CalendarClock,
  FileText,
  Globe2,
  Loader2,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

type Lead = {
  id: string;
  created_at: string;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
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
  last_contacted: string | null;
  region: string | null;
};

const targetMrr = 25500;

const stageLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  discovery: "Discovery",
  "demo-interest": "Demo Interest",
  "proposal-sent": "Proposal Sent",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
  "relationship-building": "Relationship Building",
};

function formatMoney(value: number) {
  return `£${value.toLocaleString("en-GB")}`;
}

function normaliseStage(stage: string | null) {
  return stage || "new";
}

function getMonthlyValue(lead: Lead) {
  return Number(lead.monthly_value ?? lead.estimated_value ?? 0);
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

export default function AnalyticsPage() {
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
        setMessage(data.error || "Could not load analytics.");
        return;
      }

      setLeads(data.leads || []);
      setMessage("Analytics loaded from CRM.");
    } catch {
      setMessage("Something went wrong loading analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const openLeads = useMemo(() => leads.filter(isOpenOpportunity), [leads]);
  const wonLeads = useMemo(() => leads.filter((lead) => normaliseStage(lead.stage) === "won"), [leads]);
  const lostLeads = useMemo(() => leads.filter((lead) => normaliseStage(lead.stage) === "lost"), [leads]);
  const proposalsSent = useMemo(() => leads.filter((lead) => normaliseStage(lead.stage) === "proposal-sent").length, [leads]);
  const discoveryCalls = useMemo(() => leads.filter((lead) => normaliseStage(lead.stage) === "discovery").length, [leads]);
  const negotiationLeads = useMemo(() => leads.filter((lead) => normaliseStage(lead.stage) === "negotiation").length, [leads]);
  const potentialMrr = useMemo(() => openLeads.reduce((total, lead) => total + getMonthlyValue(lead), 0), [openLeads]);
  const wonMrr = useMemo(() => wonLeads.reduce((total, lead) => total + getMonthlyValue(lead), 0), [wonLeads]);
  const gap = Math.max(targetMrr - wonMrr, 0);
  const winRate = leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0;
  const dueActions = useMemo(
    () => openLeads.filter((lead) => isDueTodayOrOverdue(lead.next_action_date || lead.follow_up_date)),
    [openLeads]
  );

  const stageBreakdown = useMemo(() => {
    const stages = [
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

    return stages.map((stage) => ({
      stage,
      label: stageLabels[stage],
      count: leads.filter((lead) => normaliseStage(lead.stage) === stage).length,
    }));
  }, [leads]);

  const sourceBreakdown = useMemo(() => {
    return leads.reduce<Record<string, number>>((groups, lead) => {
      const source = lead.source || "Unknown";
      groups[source] = (groups[source] || 0) + 1;
      return groups;
    }, {});
  }, [leads]);

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Analytics</div>
            <div className="logo-subtitle">Live revenue dashboard from CRM</div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Strategy OS · Step 24B</div>
          <h1>Measure the work that moves Mediahubink forward.</h1>
          <p className="lead">
            This dashboard now reads live CRM data. Add leads, update stages and enter monthly value to keep revenue tracking current.
          </p>

          <div className="actions" style={{ marginTop: "18px" }}>
            <button className="btn btn-secondary" onClick={loadLeads} disabled={loading}>
              {loading ? "Loading..." : "Refresh Analytics"}
            </button>
          </div>

          {message && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <strong>Status:</strong>
              <span>{message}</span>
            </div>
          )}

          <div className="analytics-revenue-grid">
            <div className="analytics-revenue-card">
              <Target size={22} />
              <span>Target MRR</span>
              <strong>{formatMoney(targetMrr)}</strong>
            </div>

            <div className="analytics-revenue-card">
              <TrendingUp size={22} />
              <span>Potential MRR</span>
              <strong>{formatMoney(potentialMrr)}</strong>
            </div>

            <div className="analytics-revenue-card">
              <BarChart3 size={22} />
              <span>Won MRR</span>
              <strong>{formatMoney(wonMrr)}</strong>
            </div>

            <div className="analytics-revenue-card">
              <Target size={22} />
              <span>Revenue Gap</span>
              <strong>{formatMoney(gap)}</strong>
            </div>
          </div>
        </section>

        <section className="analytics-grid" style={{ marginTop: "28px" }}>
          <article className="card">
            <div className="analytics-section-heading">
              <Users size={20} />
              <h2>Pipeline</h2>
            </div>

            <div className="analytics-metric-list">
              <div className="analytics-metric-row"><span>Total leads</span><strong>{leads.length}</strong></div>
              <div className="analytics-metric-row"><span>Active opportunities</span><strong>{openLeads.length}</strong></div>
              <div className="analytics-metric-row"><span>Proposals sent</span><strong>{proposalsSent}</strong></div>
              <div className="analytics-metric-row"><span>Discovery</span><strong>{discoveryCalls}</strong></div>
              <div className="analytics-metric-row"><span>Negotiation</span><strong>{negotiationLeads}</strong></div>
            </div>
          </article>

          <article className="card">
            <div className="analytics-section-heading">
              <FileText size={20} />
              <h2>Outcomes</h2>
            </div>

            <div className="analytics-metric-list">
              <div className="analytics-metric-row"><span>Won clients</span><strong>{wonLeads.length}</strong></div>
              <div className="analytics-metric-row"><span>Lost leads</span><strong>{lostLeads.length}</strong></div>
              <div className="analytics-metric-row"><span>Win rate</span><strong>{winRate}%</strong></div>
              <div className="analytics-metric-row"><span>Due actions</span><strong>{dueActions.length}</strong></div>
            </div>
          </article>

          <article className="card">
            <div className="analytics-section-heading">
              <Globe2 size={20} />
              <h2>Sources</h2>
            </div>

            <div className="analytics-metric-list">
              {Object.keys(sourceBreakdown).length === 0 ? (
                <div className="analytics-metric-row"><span>No sources yet</span><strong>0</strong></div>
              ) : (
                Object.entries(sourceBreakdown).map(([source, count]) => (
                  <div className="analytics-metric-row" key={source}>
                    <span>{source}</span>
                    <strong>{count}</strong>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Stage breakdown</div>

          {loading ? (
            <div className="mode">
              <Loader2 size={18} />
              <span>Loading CRM metrics...</span>
            </div>
          ) : (
            <div className="analytics-funnel">
              {stageBreakdown.map((item) => (
                <div className="analytics-funnel-step" key={item.stage}>
                  <div className="analytics-funnel-top">
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </div>

                  <div className="analytics-bar">
                    <div
                      className="analytics-bar-fill"
                      style={{
                        width: `${leads.length > 0 ? Math.max((item.count / leads.length) * 100, item.count > 0 ? 8 : 0) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="analytics-section-heading">
            <CalendarClock size={20} />
            <h2>Today&apos;s actions</h2>
          </div>

          {dueActions.length === 0 ? (
            <div className="mode">
              <strong>No overdue actions.</strong>
              <span>Add next action dates in CRM to make this section useful.</span>
            </div>
          ) : (
            <div className="mode-grid">
              {dueActions.map((lead) => (
                <div className="mode" key={lead.id}>
                  <strong>{lead.company || lead.name || "Unnamed lead"}</strong>
                  <span>{lead.next_action || "Follow up"}</span>
                  <span>Due: {lead.next_action_date || lead.follow_up_date || "No date"}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="analytics-section-heading">
            <MessageSquare size={20} />
            <h2>Next best actions</h2>
          </div>

          <div className="mode-grid">
            <div className="mode">
              <strong>1. Update CRM daily</strong>
              <span>Every lead needs a stage, monthly value, score and next action date.</span>
            </div>
            <div className="mode">
              <strong>2. Work the due actions</strong>
              <span>Follow-up discipline is now visible. Do not ignore overdue actions.</span>
            </div>
            <div className="mode">
              <strong>3. Convert potential MRR</strong>
              <span>Pipeline value is not revenue until the stage is won.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
