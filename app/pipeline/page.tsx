"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, CalendarClock, Loader2, Target, TrendingUp } from "lucide-react";

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

const stageOrder = [
  "new",
  "contacted",
  "discovery",
  "demo-interest",
  "proposal-sent",
  "negotiation",
  "relationship-building",
];

const statusStyles: Record<string, string> = {
  new: "pipeline-status discovery",
  contacted: "pipeline-status discovery",
  discovery: "pipeline-status discovery",
  "demo-interest": "pipeline-status discovery",
  "proposal-sent": "pipeline-status proposal",
  negotiation: "pipeline-status proposal",
  won: "pipeline-status won",
  lost: "pipeline-status lost",
  "relationship-building": "pipeline-status relationship",
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

export default function PipelinePage() {
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
        setMessage(data.error || "Could not load pipeline.");
        return;
      }

      setLeads(data.leads || []);
      setMessage("Pipeline loaded from CRM.");
    } catch {
      setMessage("Something went wrong loading pipeline.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const openLeads = useMemo(() => leads.filter(isOpenOpportunity), [leads]);
  const highPriority = useMemo(
    () => openLeads.filter((lead) => Number(lead.lead_score ?? lead.score ?? 0) >= 30).length,
    [openLeads]
  );
  const potentialMrr = useMemo(
    () => openLeads.reduce((total, lead) => total + getMonthlyValue(lead), 0),
    [openLeads]
  );
  const dueActions = useMemo(
    () => openLeads.filter((lead) => isDueTodayOrOverdue(lead.next_action_date || lead.follow_up_date)),
    [openLeads]
  );

  const groupedByStage = useMemo(() => {
    return openLeads.reduce<Record<string, Lead[]>>((groups, lead) => {
      const stage = normaliseStage(lead.stage);
      groups[stage] = groups[stage] || [];
      groups[stage].push(lead);
      return groups;
    }, {});
  }, [openLeads]);

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Pipeline</div>
            <div className="logo-subtitle">Live opportunity tracker from CRM</div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Strategy OS · Step 24A</div>
          <h1>Active opportunities, next actions and revenue focus.</h1>
          <p className="lead">
            This page now reads live CRM data. Add or update a lead in CRM and the pipeline changes with it.
          </p>

          <div className="actions" style={{ marginTop: "18px" }}>
            <button className="btn btn-secondary" onClick={loadLeads} disabled={loading}>
              {loading ? "Loading..." : "Refresh Pipeline"}
            </button>
          </div>

          {message && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <strong>Status:</strong>
              <span>{message}</span>
            </div>
          )}

          <div className="section">
            <div className="mini-card">
              <h3>Active opportunities</h3>
              <p>{openLeads.length}</p>
            </div>

            <div className="mini-card">
              <h3>High priority</h3>
              <p>{highPriority}</p>
            </div>

            <div className="mini-card">
              <h3>Potential MRR</h3>
              <p>{formatMoney(potentialMrr)}</p>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Today&apos;s actions</div>

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
          <div className="panel-title">Pipeline board</div>

          {loading ? (
            <div className="mode">
              <Loader2 size={18} />
              <span>Loading CRM opportunities...</span>
            </div>
          ) : openLeads.length === 0 ? (
            <div className="mode">
              <strong>No active opportunities yet.</strong>
              <span>Add leads in CRM and they will appear here automatically.</span>
            </div>
          ) : (
            <div className="pipeline-stage-grid">
              {stageOrder.map((stage) => {
                const stageLeads = groupedByStage[stage] || [];

                return (
                  <section className="pipeline-stage" key={stage}>
                    <div className="pipeline-stage-header">
                      <h2>{stageLabels[stage]}</h2>
                      <span>{stageLeads.length}</span>
                    </div>

                    {stageLeads.length === 0 ? (
                      <p className="pipeline-empty">No leads.</p>
                    ) : (
                      <div className="pipeline-stack">
                        {stageLeads.map((lead) => {
                          const stageValue = normaliseStage(lead.stage);

                          return (
                            <article className="pipeline-card" key={lead.id}>
                              <div className="pipeline-card-top">
                                <div>
                                  <p className="pipeline-label">{lead.industry || "No industry"}</p>
                                  <h2>{lead.company || lead.name || "Unnamed lead"}</h2>
                                </div>

                                <span className={statusStyles[stageValue] || "pipeline-status"}>
                                  {stageLabels[stageValue] || stageValue}
                                </span>
                              </div>

                              <div className="pipeline-detail">
                                <Briefcase size={16} />
                                <span>Value: {formatMoney(getMonthlyValue(lead))}/month</span>
                              </div>

                              <div className="pipeline-detail">
                                <Target size={16} />
                                <span>Score: {lead.lead_score ?? lead.score ?? 0}/40</span>
                              </div>

                              <div className="pipeline-detail">
                                <TrendingUp size={16} />
                                <span>Source: {lead.source || "Not added"}</span>
                              </div>

                              <div className="pipeline-detail">
                                <CalendarClock size={16} />
                                <span>Next: {lead.next_action_date || lead.follow_up_date || "No date"}</span>
                              </div>

                              <div className="pipeline-next">
                                <p>Next action</p>
                                <strong>{lead.next_action || "Add next action in CRM."}</strong>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Pipeline rules</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Source of truth</strong>
              <span>CRM is now the source. Pipeline reads live leads from Supabase.</span>
            </div>

            <div className="mode">
              <strong>What counts</strong>
              <span>Won and lost leads are excluded from active pipeline.</span>
            </div>

            <div className="mode">
              <strong>Next upgrade</strong>
              <span>Add drag-and-drop stage updates directly from the pipeline board.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
