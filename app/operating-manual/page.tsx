import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OperatingManualPage() {
  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Operating Manual</div>
            <div className="logo-subtitle">
              The Mediahubink Operator&apos;s Handbook
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Mediahubink Operating System</div>

          <h1>Mediahubink Operator&apos;s Handbook</h1>

          <p className="lead">
            Alfred exists to help Mediahubink reach £25,500 in monthly recurring
            revenue through focused sales activity, market intelligence,
            relationship building and operational discipline.
          </p>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Primary Target</div>

          <div className="mode">
            <strong>£25,500 Monthly Recurring Revenue</strong>
            <span>Every page inside Alfred should support this outcome.</span>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Revenue Routes</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Route A</strong>
              <span>37 Fredi Capture+ clients</span>
              <span>37 × £697 = £25,789/month</span>
            </div>

            <div className="mode">
              <strong>Route B</strong>
              <span>20 Fredi Capture+ clients = £13,940</span>
              <span>10 Fredi Capture clients = £3,970</span>
              <span>2 Enterprise clients at £4,000 = £8,000</span>
              <span>Total = £25,910/month</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Weekly Targets</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Sales</strong>
              <span>25 outreach messages</span>
              <span>5 discovery calls</span>
              <span>2 proposals</span>
              <span>1 client won</span>
            </div>

            <div className="mode">
              <strong>Content</strong>
              <span>3 LinkedIn posts</span>
              <span>1 Substack article</span>
            </div>

            <div className="mode">
              <strong>Intelligence</strong>
              <span>5 signals logged</span>
              <span>3 market insights</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Lead Priority Framework</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>A Leads</strong>
              <span>Ready now, clear pain, decision-maker access and budget signal.</span>
              <span>Action: follow up within 24 hours.</span>
            </div>

            <div className="mode">
              <strong>B Leads</strong>
              <span>Interested but not urgent.</span>
              <span>Action: follow up weekly.</span>
            </div>

            <div className="mode">
              <strong>C Leads</strong>
              <span>Future opportunity or relationship-led prospect.</span>
              <span>Action: monthly touchpoint.</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Opportunity Scoring</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Score each lead from 0 to 10</strong>
              <span>Budget</span>
              <span>Need</span>
              <span>Urgency</span>
              <span>Decision-maker access</span>
            </div>

            <div className="mode">
              <strong>Priority Bands</strong>
              <span>30 to 40: High Priority</span>
              <span>20 to 29: Medium Priority</span>
              <span>0 to 19: Low Priority</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">The Daily Rule</div>

          <div className="mode">
            <strong>Revenue before content.</strong>
            <span>
              Complete three sales actions before writing posts or building
              features.
            </span>
            <span>
              Examples: follow up a proposal, send a LinkedIn message, book a
              discovery call or review the pipeline.
            </span>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Follow-Up Rule</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Day 1</strong>
              <span>Initial conversation.</span>
            </div>

            <div className="mode">
              <strong>Day 3</strong>
              <span>First follow-up.</span>
            </div>

            <div className="mode">
              <strong>Day 7</strong>
              <span>Second follow-up.</span>
            </div>

            <div className="mode">
              <strong>Day 14</strong>
              <span>Third follow-up.</span>
            </div>

            <div className="mode">
              <strong>Day 30</strong>
              <span>Long-term nurture.</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Friday CEO Review</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Question 1</strong>
              <span>What generated revenue?</span>
            </div>

            <div className="mode">
              <strong>Question 2</strong>
              <span>What generated conversations?</span>
            </div>

            <div className="mode">
              <strong>Question 3</strong>
              <span>What generated nothing?</span>
            </div>

            <div className="mode">
              <strong>Question 4</strong>
              <span>What surprised me?</span>
            </div>

            <div className="mode">
              <strong>Question 5</strong>
              <span>What should I stop doing?</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">The 10 Commandments of Alfred</div>

          <div className="mode-grid">
            <div className="mode"><span>1. Revenue before content.</span></div>
            <div className="mode"><span>2. Log everything.</span></div>
            <div className="mode"><span>3. Follow up faster than competitors.</span></div>
            <div className="mode"><span>4. Never trust memory.</span></div>
            <div className="mode"><span>5. Build from signals, not assumptions.</span></div>
            <div className="mode"><span>6. Ignore vanity metrics.</span></div>
            <div className="mode"><span>7. Every lead needs a next action.</span></div>
            <div className="mode"><span>8. Every week needs a review.</span></div>
            <div className="mode"><span>9. Relationships compound.</span></div>
            <div className="mode"><span>10. Build only what removes the next bottleneck.</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Final Question</div>

          <blockquote className="strategy-quote">
            What is stopping the next sale?
          </blockquote>

          <p style={{ marginTop: "20px" }}>
            If the answer is not clear, do not build another feature. Focus on
            conversations, proposals and follow-up.
          </p>
        </section>
      </div>
    </main>
  );
}
