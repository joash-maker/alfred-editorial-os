"use client";

import Link from "next/link";
import { ArrowLeft, Lightbulb, MapPin, MessageSquare, Target } from "lucide-react";

const signals = [
  {
    date: "01 June 2026",
    contact: "Forrest",
    company: "Kolagri",
    region: "SADC",
    signal: "Large market for AI and automation in the SADC region.",
    opportunity: "Kolagri SARL may serve as an initial landing point for regional market exploration.",
    nextAction: "Reconnect after the Kolagri website launch and continue discovery without forcing a sale.",
    category: "Market access",
    priority: "Strategic",
  },
  {
    date: "To be updated",
    contact: "Woodley Dentist",
    company: "Dentopedia Group",
    region: "United Kingdom",
    signal: "Private dental practices have recurring enquiry capture and reception capacity problems.",
    opportunity: "Fredi Capture+ can be positioned around missed patient enquiries, after-hours capture and reception relief.",
    nextAction: "Follow up proposal and confirm next decision step.",
    category: "Dental",
    priority: "High",
  },
  {
    date: "To be updated",
    contact: "Trade Prospect",
    company: "To be confirmed",
    region: "United Kingdom",
    signal: "Trades businesses often lose work through missed calls, slow quote follow-up and out-of-hours enquiries.",
    opportunity: "Trades may be the fastest route to early Fredi retainer clients.",
    nextAction: "Identify one plumber, electrician or roofing company to audit.",
    category: "Trades",
    priority: "High",
  },
];

export default function SignalLogPage() {
  const strategicSignals = signals.filter((signal) => signal.priority === "Strategic").length;
  const highPrioritySignals = signals.filter((signal) => signal.priority === "High").length;

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Signal Log</div>
            <div className="logo-subtitle">
              Capture market signals before they disappear
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Strategy OS · Step 21C</div>
          <h1>Signals become content, strategy and commercial opportunities.</h1>
          <p className="lead">
            This page turns conversations, objections, market comments and client observations into reusable business memory.
          </p>

          <div className="section">
            <div className="mini-card">
              <h3>Signals logged</h3>
              <p>{signals.length}</p>
            </div>

            <div className="mini-card">
              <h3>High priority</h3>
              <p>{highPrioritySignals}</p>
            </div>

            <div className="mini-card">
              <h3>Strategic</h3>
              <p>{strategicSignals}</p>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Signal entries</div>

          <div className="signal-grid">
            {signals.map((item) => (
              <article className="signal-card" key={`${item.company}-${item.category}`}>
                <div className="signal-card-top">
                  <div>
                    <p className="signal-label">{item.category}</p>
                    <h2>{item.company}</h2>
                    <span>{item.contact}</span>
                  </div>

                  <span className={item.priority === "Strategic" ? "signal-priority strategic" : "signal-priority"}>
                    {item.priority}
                  </span>
                </div>

                <div className="signal-detail">
                  <MapPin size={16} />
                  <span>{item.region}</span>
                </div>

                <div className="signal-block">
                  <p>
                    <MessageSquare size={15} />
                    Signal
                  </p>
                  <strong>{item.signal}</strong>
                </div>

                <div className="signal-block">
                  <p>
                    <Lightbulb size={15} />
                    Opportunity
                  </p>
                  <strong>{item.opportunity}</strong>
                </div>

                <div className="signal-block">
                  <p>
                    <Target size={15} />
                    Next action
                  </p>
                  <strong>{item.nextAction}</strong>
                </div>

                <div className="signal-date">
                  Logged: {item.date}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">How to use this page</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Log what matters</strong>
              <span>Save objections, market comments, prospect pain points, client results and partnership signals.</span>
            </div>

            <div className="mode">
              <strong>Turn signals into assets</strong>
              <span>Each signal can become a LinkedIn post, Substack topic, proposal insert, outreach angle or case study note.</span>
            </div>

            <div className="mode">
              <strong>Next upgrade</strong>
              <span>Connect this page to Supabase so signals can be saved directly from Alfred conversations.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
