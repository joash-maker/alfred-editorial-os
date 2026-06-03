"use client";

import Link from "next/link";

export default function KnowledgeBasePage() {
  return (
    <main className="page">
      <div className="shell">

        <nav className="nav">
          <div className="logo">
            <div className="logo-title">
              Knowledge Base
            </div>
            <div className="logo-subtitle">
              Mediahubink Intelligence Layer
            </div>
          </div>

          <Link href="/" className="nav-pill">
            ← Back to Alfred OS
          </Link>
        </nav>

        {/* Core Positioning */}

        <section className="card">
          <div className="kicker">
            Core Positioning
          </div>

          <h1>
            What Mediahubink Does
          </h1>

          <p className="lead">
            I build AI agents that do the repetitive work your front-of-house
            staff shouldn't be doing, so you stop losing leads at 10pm and start
            conversations you didn't have to start yourself.
          </p>
        </section>

        {/* Offers */}

        <section className="card">
          <div className="panel-title">
            Offers
          </div>

          <div className="section">

            <div className="mini-card">
              <h3>Fredi Capture</h3>
              <p>£397/month</p>
            </div>

            <div className="mini-card">
              <h3>Fredi Capture+</h3>
              <p>£697/month</p>
            </div>

            <div className="mini-card">
              <h3>Enterprise</h3>
              <p>Custom Pricing</p>
            </div>

          </div>
        </section>

        {/* Story Library */}

        <section className="card">
          <div className="panel-title">
            Story Library
          </div>

          <div className="mode-grid">

            <div className="mode">
              <strong>The Hatch</strong>
              <span>
                Explains AI agents to local business owners.
              </span>
            </div>

            <div className="mode">
              <strong>The Helper Character</strong>
              <span>
                Best for schools and non-technical audiences.
              </span>
            </div>

            <div className="mode">
              <strong>The Chip Shop</strong>
              <span>
                Best for Yorkshire SMEs and trades.
              </span>
            </div>

          </div>
        </section>

        {/* Objections */}

        <section className="card">
          <div className="panel-title">
            Objection Library
          </div>

          <div className="mode">

            <strong>
              "It's just a chatbot."
            </strong>

            <span>
              A chatbot reads from a script. Our agents understand context,
              carry a conversation and know when to hand off to a human.
            </span>

          </div>

        </section>

        {/* Sector Playbooks */}

        <section className="card">
          <div className="panel-title">
            Sector Playbooks
          </div>

          <div className="section">

            <div className="mini-card">
              <h3>Trades</h3>
              <p>Capture+</p>
            </div>

            <div className="mini-card">
              <h3>Schools</h3>
              <p>Netty</p>
            </div>

            <div className="mini-card">
              <h3>Dental</h3>
              <p>Capture+</p>
            </div>

            <div className="mini-card">
              <h3>Serviced Offices</h3>
              <p>Enterprise</p>
            </div>

          </div>
        </section>

        {/* Case Studies */}

        <section className="card">
          <div className="panel-title">
            Case Study Vault
          </div>

          <div className="mode-grid">

            <div className="mode">
              <strong>BizSpace</strong>
              <span>
                Validated. Escalated to Germany.
              </span>
            </div>

            <div className="mode">
              <strong>Kolagri</strong>
              <span>
                Strategic SADC partner opportunity.
              </span>
            </div>

            <div className="mode">
              <strong>Netherton</strong>
              <span>
                Existing relationship and AI opportunity.
              </span>
            </div>

          </div>
        </section>

        {/* Revenue */}

        <section className="card">
          <div className="panel-title">
            Revenue Targets
          </div>

          <div className="section">

            <div className="mini-card">
              <h3>Target MRR</h3>
              <p>£25,500</p>
            </div>

            <div className="mini-card">
              <h3>Capture Clients</h3>
              <p>64</p>
            </div>

            <div className="mini-card">
              <h3>Capture+ Clients</h3>
              <p>37</p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
