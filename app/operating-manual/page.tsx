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
          <div className="kicker">Mediahubink Operating System · Version 2.0</div>
          <h1>Welcome to Alfred OS</h1>
          <p className="lead">
            Alfred is the Business Operating System for Mediahubink. It brings
            together sales, operations, content, intelligence, knowledge and
            founder decision-making into one connected system.
          </p>
          <p style={{ marginTop: "18px" }}>
            Every feature exists to help Mediahubink make better decisions,
            build stronger client relationships, publish consistently and grow
            sustainably while operating with excellence, integrity and biblical
            wisdom.
          </p>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Why Alfred Exists</div>
          <div className="mode-grid">
            <div className="mode"><strong>Clarity</strong><span>Bring the most important business information into one place.</span></div>
            <div className="mode"><strong>Consistency</strong><span>Turn good intentions into repeatable operating habits.</span></div>
            <div className="mode"><strong>Commercial discipline</strong><span>Keep sales, follow-up, proposals and opportunity movement visible.</span></div>
            <div className="mode"><strong>Compounding knowledge</strong><span>Capture what Mediahubink learns so experience is not lost.</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">What Alfred Is</div>
          <div className="mode-grid">
            <div className="mode"><span>Mediahubink&apos;s Business Operating System</span></div>
            <div className="mode"><span>A commercial intelligence platform</span></div>
            <div className="mode"><span>A CRM and pipeline management system</span></div>
            <div className="mode"><span>A proposal and document generator</span></div>
            <div className="mode"><span>A content operating system</span></div>
            <div className="mode"><span>A founder decision support system</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">What Alfred Is Not</div>
          <div className="mode-grid">
            <div className="mode"><span>A replacement for judgement</span></div>
            <div className="mode"><span>A replacement for prayer</span></div>
            <div className="mode"><span>A replacement for relationships</span></div>
            <div className="mode"><span>A generic CRM</span></div>
            <div className="mode"><span>A generic AI chatbot</span></div>
          </div>
          <p style={{ marginTop: "18px" }}>
            Alfred supports decisions. The responsibility for those decisions remains with the operator.
          </p>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">The Mediahubink Way</div>
          <div className="mode-grid">
            <div className="mode"><span>1. Diagnose before prescribing.</span></div>
            <div className="mode"><span>2. Solve operational problems.</span></div>
            <div className="mode"><span>3. Build trust before selling.</span></div>
            <div className="mode"><span>4. Record everything.</span></div>
            <div className="mode"><span>5. Every lead deserves a next action.</span></div>
            <div className="mode"><span>6. Every opportunity belongs to a solution.</span></div>
            <div className="mode"><span>7. Every proposal solves a named problem.</span></div>
            <div className="mode"><span>8. Every article should help someone.</span></div>
            <div className="mode"><span>9. Learn from every conversation.</span></div>
            <div className="mode"><span>10. Honour God in everything.</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Alfred Architecture</div>
          <div className="mode-grid">
            <div className="mode"><strong>Founder</strong><span>Divine Intelligence</span><span>Daily Briefing</span></div>
            <div className="mode"><strong>Commercial</strong><span>CRM</span><span>Pipeline</span><span>Mediahubink Solutions</span><span>Proposal Generator</span><span>Analytics</span></div>
            <div className="mode"><strong>Intelligence</strong><span>Market Intelligence</span><span>Signal Log</span><span>Opportunity Intelligence</span><span>Lessons Learned</span></div>
            <div className="mode"><strong>Content</strong><span>Creative Desk OS</span><span>Creative Desk Generator</span><span>Publishing Assets</span></div>
            <div className="mode"><strong>Knowledge</strong><span>Knowledge Base</span><span>Operating Manual</span><span>Templates and SOPs</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">The Daily Operating Rhythm</div>
          <div className="mode-grid">
            <div className="mode"><strong>Morning alignment</strong><span>Open Divine Intelligence.</span><span>Read the Daily Briefing.</span><span>Review today&apos;s priorities.</span></div>
            <div className="mode"><strong>Revenue block</strong><span>Review CRM and Pipeline.</span><span>Complete three sales actions.</span><span>Follow up before building new features.</span></div>
            <div className="mode"><strong>Delivery block</strong><span>Complete client work.</span><span>Prepare proposals and commercial documents.</span><span>Update the CRM after every meaningful interaction.</span></div>
            <div className="mode"><strong>Creative block</strong><span>Work on The Creative Desk.</span><span>Publish only when there is something useful to say.</span></div>
            <div className="mode"><strong>Evening shutdown</strong><span>Record lessons.</span><span>Set tomorrow&apos;s next actions.</span><span>Leave unfinished worries with God.</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Primary Target</div>
          <div className="mode">
            <strong>£25,500 Monthly Recurring Revenue</strong>
            <span>Every page inside Alfred should support clearer decisions, stronger relationships and sustainable revenue.</span>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Revenue Routes</div>
          <div className="mode-grid">
            <div className="mode"><strong>Route A</strong><span>37 Fredi Capture+ clients</span><span>37 × £697 = £25,789/month</span></div>
            <div className="mode"><strong>Route B</strong><span>20 Fredi Capture+ clients = £13,940</span><span>10 Fredi Capture clients = £3,970</span><span>2 Enterprise clients at £4,000 = £8,000</span><span>Total = £25,910/month</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Weekly Targets</div>
          <div className="mode-grid">
            <div className="mode"><strong>Sales</strong><span>25 outreach messages</span><span>5 discovery calls</span><span>2 proposals</span><span>1 client won</span></div>
            <div className="mode"><strong>Content</strong><span>3 LinkedIn posts</span><span>1 Substack article</span></div>
            <div className="mode"><strong>Intelligence</strong><span>5 signals logged</span><span>3 market insights</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Lead Priority Framework</div>
          <div className="mode-grid">
            <div className="mode"><strong>A Leads</strong><span>Ready now, clear pain, decision-maker access and budget signal.</span><span>Action: follow up within 24 hours.</span></div>
            <div className="mode"><strong>B Leads</strong><span>Interested but not urgent.</span><span>Action: follow up weekly.</span></div>
            <div className="mode"><strong>C Leads</strong><span>Future opportunity or relationship-led prospect.</span><span>Action: monthly touchpoint.</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Opportunity Scoring</div>
          <div className="mode-grid">
            <div className="mode"><strong>Score each lead from 0 to 10</strong><span>Budget</span><span>Need</span><span>Urgency</span><span>Decision-maker access</span></div>
            <div className="mode"><strong>Priority Bands</strong><span>30 to 40: High Priority</span><span>20 to 29: Medium Priority</span><span>0 to 19: Low Priority</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">The Daily Rule</div>
          <div className="mode">
            <strong>Revenue before content.</strong>
            <span>Complete three sales actions before writing posts or building features.</span>
            <span>Examples: follow up a proposal, send a LinkedIn message, book a discovery call or review the pipeline.</span>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Follow-Up Rule</div>
          <div className="mode-grid">
            <div className="mode"><strong>Day 1</strong><span>Initial conversation.</span></div>
            <div className="mode"><strong>Day 3</strong><span>First follow-up.</span></div>
            <div className="mode"><strong>Day 7</strong><span>Second follow-up.</span></div>
            <div className="mode"><strong>Day 14</strong><span>Third follow-up.</span></div>
            <div className="mode"><strong>Day 30</strong><span>Long-term nurture.</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Friday CEO Review</div>
          <div className="mode-grid">
            <div className="mode"><strong>Question 1</strong><span>What generated revenue?</span></div>
            <div className="mode"><strong>Question 2</strong><span>What generated conversations?</span></div>
            <div className="mode"><strong>Question 3</strong><span>What generated nothing?</span></div>
            <div className="mode"><strong>Question 4</strong><span>What surprised me?</span></div>
            <div className="mode"><strong>Question 5</strong><span>What should I stop doing?</span></div>
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
          <div className="panel-title">Version History</div>
          <div className="mode-grid">
            <div className="mode"><strong>Version 1.0</strong><span>CRM</span><span>Pipeline</span><span>Analytics</span><span>Strategy</span><span>Market Intelligence</span><span>Signal Log</span></div>
            <div className="mode"><strong>Version 2.0</strong><span>Mediahubink Solutions</span><span>Divine Intelligence</span><span>Creative Desk OS</span><span>Creative Desk Generator</span><span>Knowledge Base</span><span>Daily Briefing</span><span>Solution-aware CRM</span><span>Commercial Operating System architecture</span></div>
            <div className="mode"><strong>Next</strong><span>Pipeline and Analytics by Solution</span><span>Opportunity Intelligence</span><span>Lessons Learned</span><span>CEO Dashboard</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "24px" }}>
          <div className="panel-title">Final Question</div>
          <blockquote className="strategy-quote">What is stopping the next sale?</blockquote>
          <p style={{ marginTop: "20px" }}>
            If the answer is not clear, do not build another feature. Focus on conversations, proposals and follow-up.
          </p>
        </section>

        <section className="card" style={{ marginTop: "24px", textAlign: "center" }}>
          <blockquote className="strategy-quote">Build with excellence. Serve with integrity. Walk by faith.</blockquote>
        </section>
      </div>
    </main>
  );
}
