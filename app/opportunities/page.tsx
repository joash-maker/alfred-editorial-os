"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Lightbulb,
  Loader2,
  MapPin,
  PauseCircle,
  PoundSterling,
  Target,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

type TimelineEvent = {
  date: string;
  title: string;
  detail: string;
};

type Opportunity = {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id: string | null;
  company: string | null;
  contact_name: string | null;
  website: string | null;
  industry: string | null;
  location: string | null;
  organisation_size: string | null;
  solution: string | null;
  potential_mrr: number | null;
  probability: number | null;
  stage: string | null;
  status: string | null;
  review_date: string | null;
  priority: string | null;
  champion: string | null;
  decision_maker: string | null;
  procurement: string | null;
  technical_contact: string | null;
  current_process: string | null;
  pain_points: string | null;
  desired_outcome: string | null;
  buying_concerns: string | null;
  success_looks_like: string | null;
  outcome_summary: string | null;
  lesson: string | null;
  next_action: string | null;
  timeline: TimelineEvent[] | null;
};

function formatMoney(value: number | null) {
  return `£${Number(value || 0).toLocaleString("en-GB")}`;
}

function statusClass(status: string | null) {
  return `opportunity-status ${(status || "Active").toLowerCase()}`;
}

export default function OpportunityHubPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadOpportunities() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/opportunities", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not load opportunities.");
        return;
      }

      const loaded = data.opportunities || [];
      setOpportunities(loaded);

      if (!selectedId && loaded.length > 0) {
        setSelectedId(loaded[0].id);
      }

      setMessage("Live opportunities loaded.");
    } catch {
      setMessage("Something went wrong loading opportunities.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOpportunities();
  }, []);

  const selected =
    opportunities.find((item) => item.id === selectedId) ||
    opportunities[0] ||
    null;

  const counts = useMemo(() => {
    const statusCount = (status: string) =>
      opportunities.filter(
        (item) => (item.status || "Active").toLowerCase() === status.toLowerCase()
      ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reviews = opportunities.filter((item) => {
      if (!item.review_date) return false;
      const review = new Date(item.review_date);
      review.setHours(0, 0, 0, 0);
      return review <= today;
    }).length;

    return {
      active: statusCount("Active"),
      won: statusCount("Won"),
      lost: statusCount("Lost"),
      watching: statusCount("Watching"),
      paused: statusCount("Paused"),
      reviews,
    };
  }, [opportunities]);

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Opportunity Hub</div>
            <div className="logo-subtitle">
              Live commercial memory from Alfred CRM
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card opportunity-hero">
          <div className="kicker">Step 42B · Opportunity Intelligence v2.0</div>
          <h1>Live opportunities, complete context and lessons that compound.</h1>
          <p className="lead">
            Convert a CRM lead into an opportunity and Alfred creates a permanent
            commercial case file linked to the original record.
          </p>

          <div className="actions" style={{ marginTop: "18px" }}>
            <button
              className="btn btn-secondary"
              onClick={loadOpportunities}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh Opportunities"}
            </button>
          </div>

          {message && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <strong>Status:</strong>
              <span>{message}</span>
            </div>
          )}
        </section>

        <section className="opportunity-summary-grid" style={{ marginTop: "28px" }}>
          <article className="opportunity-summary-card">
            <BriefcaseBusiness size={22} />
            <span>Active</span>
            <strong>{counts.active}</strong>
          </article>
          <article className="opportunity-summary-card">
            <CheckCircle2 size={22} />
            <span>Won</span>
            <strong>{counts.won}</strong>
          </article>
          <article className="opportunity-summary-card">
            <XCircle size={22} />
            <span>Lost</span>
            <strong>{counts.lost}</strong>
          </article>
          <article className="opportunity-summary-card">
            <Eye size={22} />
            <span>Watching</span>
            <strong>{counts.watching}</strong>
          </article>
          <article className="opportunity-summary-card">
            <PauseCircle size={22} />
            <span>Paused</span>
            <strong>{counts.paused}</strong>
          </article>
          <article className="opportunity-summary-card">
            <CalendarClock size={22} />
            <span>Reviews due</span>
            <strong>{counts.reviews}</strong>
          </article>
        </section>

        {loading ? (
          <section className="card" style={{ marginTop: "28px" }}>
            <div className="mode">
              <Loader2 size={18} />
              <span>Loading live opportunity records...</span>
            </div>
          </section>
        ) : opportunities.length === 0 ? (
          <section className="card" style={{ marginTop: "28px" }}>
            <div className="panel-title">No live opportunities yet</div>
            <div className="mode">
              <strong>Start from CRM.</strong>
              <span>
                Open Alfred CRM and click Convert to Opportunity on a lead.
              </span>
            </div>
          </section>
        ) : (
          <section className="opportunity-layout" style={{ marginTop: "28px" }}>
            <aside className="card opportunity-list-panel">
              <div className="panel-title">Opportunities</div>

              <div className="opportunity-list">
                {opportunities.map((opportunity) => (
                  <button
                    key={opportunity.id}
                    className={
                      selected?.id === opportunity.id
                        ? "opportunity-list-item active"
                        : "opportunity-list-item"
                    }
                    onClick={() => setSelectedId(opportunity.id)}
                  >
                    <div className="opportunity-list-top">
                      <strong>{opportunity.company || "Unnamed opportunity"}</strong>
                      <span className={statusClass(opportunity.status)}>
                        {opportunity.status || "Active"}
                      </span>
                    </div>

                    <span>{opportunity.solution || "Not decided"}</span>
                    <span>{opportunity.stage || "Discovery"}</span>
                    <small>
                      {opportunity.review_date
                        ? `Review ${opportunity.review_date}`
                        : "No review date"}
                    </small>
                  </button>
                ))}
              </div>
            </aside>

            {selected && (
              <div className="opportunity-record">
                <section className="card">
                  <div className="opportunity-record-header">
                    <div>
                      <div className="kicker">
                        {selected.industry || "No industry"}
                      </div>
                      <h2>{selected.company || "Unnamed opportunity"}</h2>
                      <p>
                        {selected.outcome_summary ||
                          "Add the commercial story as this opportunity develops."}
                      </p>
                    </div>

                    <span className={statusClass(selected.status)}>
                      {selected.status || "Active"}
                    </span>
                  </div>

                  <div className="opportunity-facts-grid">
                    <div className="opportunity-fact">
                      <Building2 size={17} />
                      <strong>Solution</strong>
                      <span>{selected.solution || "Not decided"}</span>
                    </div>
                    <div className="opportunity-fact">
                      <PoundSterling size={17} />
                      <strong>Potential MRR</strong>
                      <span>{formatMoney(selected.potential_mrr)}</span>
                    </div>
                    <div className="opportunity-fact">
                      <Target size={17} />
                      <strong>Probability</strong>
                      <span>{selected.probability || 0}%</span>
                    </div>
                    <div className="opportunity-fact">
                      <Clock3 size={17} />
                      <strong>Stage</strong>
                      <span>{selected.stage || "Discovery"}</span>
                    </div>
                    <div className="opportunity-fact">
                      <MapPin size={17} />
                      <strong>Location</strong>
                      <span>{selected.location || "Not added"}</span>
                    </div>
                    <div className="opportunity-fact">
                      <Users size={17} />
                      <strong>Organisation</strong>
                      <span>{selected.organisation_size || "Not added"}</span>
                    </div>
                  </div>
                </section>

                <section className="opportunity-two-column">
                  <article className="card">
                    <div className="opportunity-section-heading">
                      <UserRound size={20} />
                      <h2>People</h2>
                    </div>

                    <div className="opportunity-detail-list">
                      <div><strong>Champion</strong><span>{selected.champion || "Not added"}</span></div>
                      <div><strong>Decision maker</strong><span>{selected.decision_maker || "Not added"}</span></div>
                      <div><strong>Procurement</strong><span>{selected.procurement || "Not added"}</span></div>
                      <div><strong>Technical contact</strong><span>{selected.technical_contact || "Not added"}</span></div>
                    </div>
                  </article>

                  <article className="card">
                    <div className="opportunity-section-heading">
                      <CalendarClock size={20} />
                      <h2>Commercial review</h2>
                    </div>

                    <div className="opportunity-detail-list">
                      <div><strong>Priority</strong><span>{selected.priority || "Medium"}</span></div>
                      <div><strong>Review date</strong><span>{selected.review_date || "Not added"}</span></div>
                      <div><strong>Next action</strong><span>{selected.next_action || "Not added"}</span></div>
                      <div><strong>Website</strong><span>{selected.website || "Not added"}</span></div>
                    </div>
                  </article>
                </section>

                <section className="card">
                  <div className="opportunity-section-heading">
                    <FileText size={20} />
                    <h2>Opportunity story</h2>
                  </div>

                  <div className="opportunity-story-grid">
                    <div><strong>Current process</strong><p>{selected.current_process || "Not added"}</p></div>
                    <div><strong>Pain points</strong><p>{selected.pain_points || "Not added"}</p></div>
                    <div><strong>Desired outcome</strong><p>{selected.desired_outcome || "Not added"}</p></div>
                    <div><strong>Buying concerns</strong><p>{selected.buying_concerns || "Not added"}</p></div>
                    <div><strong>Success looks like</strong><p>{selected.success_looks_like || "Not added"}</p></div>
                  </div>
                </section>

                <section className="card">
                  <div className="opportunity-section-heading">
                    <Clock3 size={20} />
                    <h2>Timeline</h2>
                  </div>

                  <div className="opportunity-timeline">
                    {(selected.timeline || []).length === 0 ? (
                      <div className="mode">
                        <strong>No timeline events yet.</strong>
                        <span>Future versions will let you add events directly.</span>
                      </div>
                    ) : (
                      (selected.timeline || []).map((event, index) => (
                        <article
                          className="opportunity-timeline-item"
                          key={`${event.title}-${index}`}
                        >
                          <div className="opportunity-timeline-marker" />
                          <div>
                            <span>{event.date}</span>
                            <h3>{event.title}</h3>
                            <p>{event.detail}</p>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>

                <section className="card opportunity-lesson-card">
                  <div className="opportunity-section-heading">
                    <Lightbulb size={20} />
                    <h2>Lesson learned</h2>
                  </div>

                  <blockquote>
                    {selected.lesson ||
                      "No lesson recorded yet. Capture the lesson when the outcome becomes clear."}
                  </blockquote>
                </section>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
