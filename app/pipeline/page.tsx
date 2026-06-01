"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Target, TrendingUp } from "lucide-react";

const pipelineItems = [
  {
    company: "Woodley Dentist",
    vertical: "Dental",
    status: "Proposal Sent",
    value: "£697/month",
    nextAction: "Follow up on proposal and confirm decision-maker.",
    priority: "High",
  },
  {
    company: "Kolagri",
    vertical: "Agriculture",
    status: "Relationship Building",
    value: "TBC",
    nextAction: "Reconnect after website launch and discuss SADC opportunity.",
    priority: "Strategic",
  },
  {
    company: "Trade Prospect 1",
    vertical: "Trades",
    status: "Discovery",
    value: "£397 to £697/month",
    nextAction: "Identify missed-call pain and offer enquiry system audit.",
    priority: "High",
  },
];

const statusStyles: Record<string, string> = {
  "Proposal Sent": "pipeline-status proposal",
  "Relationship Building": "pipeline-status relationship",
  Discovery: "pipeline-status discovery",
  Won: "pipeline-status won",
  Lost: "pipeline-status lost",
};

export default function PipelinePage() {
  const activeOpportunities = pipelineItems.length;
  const highPriority = pipelineItems.filter((item) => item.priority === "High").length;
  const strategic = pipelineItems.filter((item) => item.priority === "Strategic").length;

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Pipeline</div>
            <div className="logo-subtitle">
              Mediahubink opportunity tracker
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Strategy OS · Step 21B</div>
          <h1>Active opportunities, next actions and revenue focus.</h1>
          <p className="lead">
            This page keeps your active prospects visible so Alfred supports the work that matters:
            revenue, relationships and reputation.
          </p>

          <div className="section">
            <div className="mini-card">
              <h3>Active opportunities</h3>
              <p>{activeOpportunities}</p>
            </div>

            <div className="mini-card">
              <h3>High priority</h3>
              <p>{highPriority}</p>
            </div>

            <div className="mini-card">
              <h3>Strategic relationships</h3>
              <p>{strategic}</p>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Pipeline board</div>

          <div className="pipeline-grid">
            {pipelineItems.map((item) => (
              <article className="pipeline-card" key={item.company}>
                <div className="pipeline-card-top">
                  <div>
                    <p className="pipeline-label">{item.vertical}</p>
                    <h2>{item.company}</h2>
                  </div>

                  <span className={statusStyles[item.status] || "pipeline-status"}>
                    {item.status}
                  </span>
                </div>

                <div className="pipeline-detail">
                  <Briefcase size={16} />
                  <span>Value: {item.value}</span>
                </div>

                <div className="pipeline-detail">
                  <Target size={16} />
                  <span>Priority: {item.priority}</span>
                </div>

                <div className="pipeline-next">
                  <p>Next action</p>
                  <strong>{item.nextAction}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Pipeline rules</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Status options</strong>
              <span>New, Discovery, Demo, Proposal Sent, Negotiation, Won, Lost, Relationship Building.</span>
            </div>

            <div className="mode">
              <strong>What counts</strong>
              <span>Only track opportunities with a real company, contact, sector signal or next action.</span>
            </div>

            <div className="mode">
              <strong>Next upgrade</strong>
              <span>Connect this page to Supabase so new leads and opportunities can be saved from Alfred.</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Next best actions</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>1. Woodley Dentist</strong>
              <span>Follow up the Fredi Capture+ proposal and clarify next decision step.</span>
            </div>

            <div className="mode">
              <strong>2. Trades</strong>
              <span>Identify one plumber, electrician or roofing company with obvious missed-call exposure.</span>
            </div>

            <div className="mode">
              <strong>3. Kolagri</strong>
              <span>Maintain relationship, gather SADC signals and avoid premature selling.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
