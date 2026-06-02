import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function OperatingManualPage() {
return ( <main className="page"> <div className="shell"> <nav className="nav"> <div className="logo"> <div className="logo-title">Operating Manual</div> <div className="logo-subtitle">
The Mediahubink Operator's Handbook </div> </div>

```
      <Link className="nav-pill" href="/">
        <ArrowLeft size={16} />
        Back to Alfred OS
      </Link>
    </nav>

    <section className="card">
      <div className="kicker">Mediahubink Operating System</div>

      <h1>Mediahubink Operator's Handbook</h1>

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
        <span>
          Every page inside Alfred should support this outcome.
        </span>
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
      <div className="panel-title">The Daily Rule</div>

      <div className="mode">
        <strong>Revenue before content.</strong>
        <span>
          Complete three sales actions before writing posts or building
          features.
        </span>
      </div>
    </section>

    <section className="card" style={{ marginTop: "24px" }}>
      <div className="panel-title">The 10 Commandments of Alfred</div>

      <div className="mode-grid">
        <div className="mode"><span>1. Revenue before content.</span></div>
        <div className="mode"><span>2. Log everything.</span></div>
        <div className="mode"><span>3. Follow up faster.</span></div>
        <div className="mode"><span>4. Never trust memory.</span></div>
        <div className="mode"><span>5. Build from signals.</span></div>
        <div className="mode"><span>6. Ignore vanity metrics.</span></div>
        <div className="mode"><span>7. Every lead needs a next action.</span></div>
        <div className="mode"><span>8. Review weekly.</span></div>
        <div className="mode"><span>9. Relationships compound.</span></div>
        <div className="mode"><span>10. Remove bottlenecks.</span></div>
      </div>
    </section>

    <section className="card" style={{ marginTop: "24px" }}>
      <div className="panel-title">Final Question</div>

      <blockquote className="strategy-quote">
        What is stopping the next sale?
      </blockquote>

      <p style={{ marginTop: "20px" }}>
        If the answer is not clear, do not build another feature.
        Focus on conversations, proposals and follow-up.
      </p>
    </section>
  </div>
</main>
```

);
}
