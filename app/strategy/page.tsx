import Link from "next/link";
import { ArrowLeft, Target, TrendingUp, Compass, ShieldCheck } from "lucide-react";

export default function StrategyPage() {
  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Strategy</div>
            <div className="logo-subtitle">
              Mediahubink revenue focus and operating direction
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Strategy OS · Step 21A</div>
          <h1>Mediahubink Strategy</h1>
          <p className="lead">
            The job is simple: convert focused opportunities into recurring revenue while building trust, reputation and market intelligence.
          </p>

          <div className="section">
            <div className="mini-card">
              <h3>Revenue Goal</h3>
              <p>£25,500 MRR</p>
            </div>

            <div className="mini-card">
              <h3>Current MRR</h3>
              <p>£0</p>
            </div>

            <div className="mini-card">
              <h3>Gap</h3>
              <p>£25,500</p>
            </div>
          </div>
        </section>

        <section className="strategy-grid" style={{ marginTop: "28px" }}>
          <article className="card">
            <div className="strategy-card-heading">
              <Target size={22} />
              <h2>Primary Verticals</h2>
            </div>

            <div className="mode-grid">
              <div className="mode">
                <strong>Trades</strong>
                <span>Missed calls, quote follow-up, emergency jobs and after-hours enquiries.</span>
              </div>

              <div className="mode">
                <strong>Dental</strong>
                <span>Reception overload, missed patient enquiries and treatment enquiry capture.</span>
              </div>

              <div className="mode">
                <strong>Estate Agents</strong>
                <span>Viewing enquiries, slow response times and out-of-hours lead capture.</span>
              </div>
            </div>
          </article>

          <article className="card">
            <div className="strategy-card-heading">
              <Compass size={22} />
              <h2>Secondary Verticals</h2>
            </div>

            <div className="mode-grid">
              <div className="mode">
                <strong>Schools</strong>
                <span>Parent communication, repeat enquiries and office workload.</span>
              </div>

              <div className="mode">
                <strong>Serviced Offices</strong>
                <span>Location enquiries, qualification and multi-site routing.</span>
              </div>
            </div>
          </article>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="strategy-card-heading">
            <TrendingUp size={22} />
            <h2>Strategic Markets</h2>
          </div>

          <div className="section" style={{ marginTop: "18px" }}>
            <div className="mini-card">
              <h3>United Kingdom</h3>
              <p>Primary revenue market for Fredi Capture and Fredi Capture+.</p>
            </div>

            <div className="mini-card">
              <h3>SADC Region</h3>
              <p>Strategic market exploration through relationships and signal gathering.</p>
            </div>

            <div className="mini-card">
              <h3>Current posture</h3>
              <p>Sell in the UK. Learn from SADC. Do not expand on assumptions.</p>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Positioning</div>

          <blockquote className="strategy-quote">
            I build AI agents that do the repetitive work your front-of-house staff should not be doing, so you stop losing leads at 10pm and start conversations you did not have to start yourself.
          </blockquote>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="strategy-card-heading">
            <ShieldCheck size={22} />
            <h2>Business Rule</h2>
          </div>

          <div className="mode">
            <strong>Everything in Mediahubink must support one of three outcomes.</strong>
            <span>Revenue. Relationships. Reputation.</span>
            <span>If it supports none of these, do not spend time on it.</span>
          </div>
        </section>
      </div>
    </main>
  );
}
