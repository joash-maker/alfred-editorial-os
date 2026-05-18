export default function HomePage() {
  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Alfred</div>
            <div className="logo-subtitle">
              Mediahubink Editorial + Growth Chief of Staff
            </div>
          </div>

          <div className="nav-pill">Private V1</div>
        </nav>

        <section className="hero">
          <div className="card">
            <div className="kicker">The Creative Desk · Mediahubink</div>

            <h1>Your ideas, turned into clear publishing momentum.</h1>

            <p className="lead">
              Alfred helps capture what you are building, learning, testing and
              sharing, then turns it into Substack posts, LinkedIn content,
              client lead campaigns and calm strategic follow-up.
            </p>

            <div className="actions">
              <a className="btn" href="#quick-create">
                Open Quick Create
              </a>
              <a className="btn btn-secondary" href="#modules">
                View Modules
              </a>
            </div>
          </div>

          <div className="card" id="quick-create">
            <div className="panel-title">What do you want to share today?</div>

            <textarea
              className="input-box"
              placeholder="Example: A dentist asked if AI will replace reception staff. Turn this into a LinkedIn post and a Creative Desk idea."
            />

            <div className="mode-grid">
              <div className="mode">
                <strong>The Creative Desk</strong>
                <span>
                  Builder’s Brief, Lab Notes, Strategic Reset, Substack Notes
                  and reflective long-form content.
                </span>
              </div>

              <div className="mode">
                <strong>Mediahubink Growth</strong>
                <span>
                  LinkedIn lead posts, vertical campaigns, pinned comments,
                  CTAs, demos and client conversations.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="modules">
          <div className="mini-card">
            <h3>Editorial Engine</h3>
            <p>
              Create Tuesday, Thursday and Sunday posts using your saved
              frameworks, tone and archive memory.
            </p>
          </div>

          <div className="mini-card">
            <h3>LinkedIn Growth Engine</h3>
            <p>
              Generate punchy vertical-specific posts for dentists, trades,
              schools, gyms, serviced offices and more.
            </p>
          </div>

          <div className="mini-card">
            <h3>CRM-lite</h3>
            <p>
              Track leads, prospects, demo interest, follow-ups and content
              that creates real conversations.
            </p>
          </div>

          <div className="mini-card">
            <h3>Thought Vault</h3>
            <p>
              Store what you are building, testing, learning, noticing and
              wrestling with.
            </p>
          </div>

          <div className="mini-card">
            <h3>Demo Manager</h3>
            <p>
              Keep each vertical demo link organised so Alfred always suggests
              the right CTA.
            </p>
          </div>

          <div className="mini-card">
            <h3>Offer Engine</h3>
            <p>
              Connect posts to Fredi, voice agents, AI receptionists, advisory
              work and partner offers.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
