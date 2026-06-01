"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  Globe2,
  Target,
} from "lucide-react";

const revenue = {
  goal: "£25,500",
  current: "£0",
  gap: "£25,500",
};

const pipelineMetrics = [
  { label: "Active opportunities", value: "3" },
  { label: "Proposals sent", value: "1" },
  { label: "Discovery calls", value: "0" },
  { label: "Clients won", value: "0" },
];

const contentMetrics = [
  { label: "LinkedIn posts this month", value: "0" },
  { label: "Substack posts this month", value: "0" },
  { label: "Content-sourced conversations", value: "0" },
];

const marketMetrics = [
  { label: "Signals logged", value: "3" },
  { label: "Strategic relationships", value: "1" },
  { label: "Markets tracked", value: "2" },
];

const funnel = [
  { stage: "Prospects", value: 10 },
  { stage: "Discovery calls", value: 3 },
  { stage: "Proposals", value: 2 },
  { stage: "Clients", value: 1 },
];

const priorities = [
  "Follow up Woodley Dentist.",
  "Identify one strong trade prospect.",
  "Log all Kolagri and SADC market signals.",
  "Publish one problem-led LinkedIn post.",
];

export default function AnalyticsPage() {
  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Analytics</div>
            <div className="logo-subtitle">
              Manual pipeline and revenue dashboard
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Strategy OS · Step 22A</div>
          <h1>Measure the work that moves Mediahubink forward.</h1>
          <p className="lead">
            This dashboard tracks the numbers that matter before connecting automation:
            revenue, pipeline, content conversations and market signals.
          </p>

          <div className="analytics-revenue-grid">
            <div className="analytics-revenue-card">
              <TrendingUp size={22} />
              <span>Revenue goal</span>
              <strong>{revenue.goal}</strong>
            </div>

            <div className="analytics-revenue-card">
              <BarChart3 size={22} />
              <span>Current MRR</span>
              <strong>{revenue.current}</strong>
            </div>

            <div className="analytics-revenue-card">
              <Target size={22} />
              <span>Gap</span>
              <strong>{revenue.gap}</strong>
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
              {pipelineMetrics.map((metric) => (
                <div className="analytics-metric-row" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="card">
            <div className="analytics-section-heading">
              <FileText size={20} />
              <h2>Content</h2>
            </div>

            <div className="analytics-metric-list">
              {contentMetrics.map((metric) => (
                <div className="analytics-metric-row" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="card">
            <div className="analytics-section-heading">
              <Globe2 size={20} />
              <h2>Market intelligence</h2>
            </div>

            <div className="analytics-metric-list">
              {marketMetrics.map((metric) => (
                <div className="analytics-metric-row" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Conversion funnel</div>

          <div className="analytics-funnel">
            {funnel.map((item, index) => (
              <div className="analytics-funnel-step" key={item.stage}>
                <div className="analytics-funnel-top">
                  <span>{item.stage}</span>
                  <strong>{item.value}</strong>
                </div>

                <div className="analytics-bar">
                  <div
                    className="analytics-bar-fill"
                    style={{ width: `${Math.max((item.value / funnel[0].value) * 100, 8)}%` }}
                  />
                </div>

                {index < funnel.length - 1 && (
                  <p>
                    Next conversion target: move prospects into {funnel[index + 1].stage.toLowerCase()}.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="analytics-section-heading">
            <MessageSquare size={20} />
            <h2>Next best actions</h2>
          </div>

          <div className="mode-grid">
            {priorities.map((priority, index) => (
              <div className="mode" key={priority}>
                <strong>Action {index + 1}</strong>
                <span>{priority}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Operating rule</div>

          <div className="mode">
            <strong>Track outcomes, not vanity metrics.</strong>
            <span>
              Ignore likes, impressions and follower count for now. Watch DMs, calls, proposals, retainers and MRR.
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
