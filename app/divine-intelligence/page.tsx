"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Heart,
  NotebookPen,
  PauseCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const scriptures = [
  ["Proverbs 3:6", "In all your ways acknowledge him, and he will make your paths straight.", "Committed direction"],
  ["2 Chronicles 1:10", "Give me wisdom and knowledge, that I may lead this people.", "The Solomon ask"],
  ["Proverbs 16:3", "Commit your works to the Lord, and your plans will be established.", "Surrendered work"],
  ["Isaiah 11:2", "The Spirit of the Lord will rest on him, the Spirit of wisdom and understanding, counsel and might, knowledge and fear of the Lord.", "Divine intelligence"],
];

const decisionQuestions = [
  "Is this driven by fear or faith?",
  "Is this ego or service?",
  "Is this pressure or peace?",
  "Am I forcing a door that God has not opened?",
  "Have I prayed before deciding?",
  "Have I tested this against Scripture?",
  "Have I sought wise counsel?",
  "Does this decision honour Christ?",
];

const journalPrompts = [
  "Today God reminded me...",
  "Today I sensed...",
  "Today I need wisdom for...",
  "Today I am grateful for...",
];

export default function DivineIntelligencePage() {
  const [journal, setJournal] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState("");

  async function copyPrayer() {
    const prayer =
      "Father, I come before You not as a founder with a portfolio, but as a son with open hands. I ask not first for contracts, clients or revenue. I ask for wisdom, understanding and discernment. Help me see what You see, build what serves, and recognise which doors You opened and which I forced. Let nothing I build cost my family more than it should. I choose trust over hustle, faithfulness over fame, and obedience over optics. Not my will, but Yours. Amen.";

    try {
      await navigator.clipboard.writeText(prayer);
      setCopied("Prayer copied.");
    } catch {
      setCopied("Could not copy prayer.");
    }
  }

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Divine Intelligence</div>
            <div className="logo-subtitle">
              Scripture, surrender, reflection and faithful action
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card divine-hero">
          <div className="kicker">Step 34 · Divine Intelligence</div>
          <h1>Seek first. Listen well. Build faithfully.</h1>
          <p className="lead">
            This space exists to keep the founder aligned before trying to become effective.
            Strategy matters. Character matters more. Business is important. Obedience is deeper.
          </p>

          <blockquote className="divine-quote">
            Seek first the Kingdom of God and His righteousness.
            <span>Matthew 6:33</span>
          </blockquote>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="divine-heading">
            <PauseCircle size={22} />
            <h2>Still yourself first</h2>
          </div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Posture</strong>
              <span>Seated or kneeling, whatever puts you at rest rather than performance.</span>
            </div>
            <div className="mode">
              <strong>Silence</strong>
              <span>60 seconds. No words. Let your mind settle onto God, not the work.</span>
            </div>
            <div className="mode">
              <strong>Breath</strong>
              <span>Inhale: You are Lord. Exhale: I am Yours.</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="divine-heading">
            <BookOpen size={22} />
            <h2>Scripture anchors</h2>
          </div>

          <div className="divine-scripture-grid">
            {scriptures.map(([reference, text, theme]) => (
              <article className="divine-scripture-card" key={reference}>
                <span>{theme}</span>
                <h3>{reference}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="divine-heading">
            <Heart size={22} />
            <h2>Commitment prayer</h2>
          </div>

          <div className="divine-prayer">
            <h3>Opening</h3>
            <p>
              Father, I come before You not as a founder with a portfolio, but as a son
              with open hands. Everything I have built, I built with the time You gave me,
              the mind You formed, and the breath You sustain.
            </p>

            <h3>The commission</h3>
            <p>
              Today I place at Your feet Mediahubink, The Creative Desk, RunSheet OS,
              Kingdom Intelligence, The Automated Church, every product, every client,
              every opportunity and everything still hidden from me.
            </p>

            <h3>The Solomon ask</h3>
            <p>
              I ask not first for contracts, clients or revenue. I ask for wisdom,
              understanding and discernment. Help me see what You see, build what serves,
              and recognise which doors You opened and which I forced.
            </p>

            <h3>Family</h3>
            <p>
              Let nothing I build cost Natasha, Zoë and Asher more than it should.
              Help me lead my home with presence, patience and love.
            </p>

            <h3>Surrender</h3>
            <p>
              I release the need to prove this works. I choose trust over hustle,
              faithfulness over fame, and obedience over optics.
            </p>

            <h3>Closing</h3>
            <p>
              Not my will, but Yours. Not my timeline, but Yours.
              Not my name, but Yours. Amen.
            </p>

            <button className="btn btn-secondary" onClick={copyPrayer}>
              Copy Prayer
            </button>
          </div>

          {copied && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <strong>Status:</strong>
              <span>{copied}</span>
            </div>
          )}
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="divine-heading">
            <Sparkles size={22} />
            <h2>Faith in practice: At Your Word</h2>
          </div>

          <article className="divine-reflection">
            <p>
              Peter had every reason to say no. He was the fisherman. Jesus was a carpenter.
              After a full night of nothing, the nets were already washed. The professional
              judgement was clear: it was over.
            </p>

            <blockquote>But at your word, I will let down the nets.</blockquote>

            <p>
              This was not blind compliance. It was something more honest:
              I do not fully understand this, but I am choosing to trust it anyway.
            </p>

            <p>
              The catch was not the whole point. What made it possible was what happened
              before it: a skilled man setting aside his expertise long enough to act on
              a word that made no obvious sense.
            </p>

            <p>
              The question is whether you trust enough to let down the nets again.
              Not because you have proof. Because of who gave the instruction.
            </p>

            <div className="mode-grid" style={{ marginTop: "18px" }}>
              <div className="mode">
                <strong>Scripture</strong>
                <span>Luke 5:1 to 11</span>
              </div>
              <div className="mode">
                <strong>Decision principle</strong>
                <span>Expertise matters, but expertise is not ultimate.</span>
              </div>
              <div className="mode">
                <strong>Reflection question</strong>
                <span>What have I stopped doing because the last attempt failed?</span>
              </div>
            </div>
          </article>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="divine-heading">
            <ShieldCheck size={22} />
            <h2>Decision filter</h2>
          </div>

          <div className="divine-check-grid">
            {decisionQuestions.map((question) => (
              <label key={question}>
                <input type="checkbox" />
                <span>{question}</span>
              </label>
            ))}
          </div>

          <div className="mode" style={{ marginTop: "18px" }}>
            <strong>Sharper question</strong>
            <span>Have I stopped because God said stop, or because the last attempt failed?</span>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="divine-heading">
            <BookOpen size={22} />
            <h2>Proverbs 16 wisdom map</h2>
          </div>

          <div className="mode-grid">
            <div className="mode"><strong>Plan, but hold loosely</strong><span>We make plans, but the Lord directs our steps.</span></div>
            <div className="mode"><strong>Commit the work</strong><span>Roll the burden onto God rather than asking Him to bless your agenda.</span></div>
            <div className="mode"><strong>Check motives</strong><span>God examines the heart beneath the visible action.</span></div>
            <div className="mode"><strong>Choose wisdom over wealth</strong><span>What you learn and become matters more than what you earn.</span></div>
            <div className="mode"><strong>Guard against pride</strong><span>Success is one of the most spiritually dangerous seasons.</span></div>
            <div className="mode"><strong>Lead with justice</strong><span>Authority is stewardship, not ownership.</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="divine-heading">
            <NotebookPen size={22} />
            <h2>Faith journal</h2>
          </div>

          <div className="form-grid">
            {journalPrompts.map((prompt) => (
              <textarea
                key={prompt}
                className="input-box"
                value={journal[prompt] || ""}
                onChange={(event) =>
                  setJournal((current) => ({ ...current, [prompt]: event.target.value }))
                }
                placeholder={prompt}
              />
            ))}
          </div>

          <p className="divine-note">Keep this honest and simple. One sentence is enough.</p>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="divine-heading">
            <Users size={22} />
            <h2>Family covering</h2>
          </div>

          <div className="mode">
            <strong>Founder's reminder</strong>
            <span>
              The work must never cost Natasha, Zoë and Asher more than it should.
              Presence at home is not a distraction from the calling. It is part of it.
            </span>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="divine-heading">
            <RotateCcw size={22} />
            <h2>Quarterly recommitment</h2>
          </div>

          <div className="mode-grid">
            <div className="mode"><strong>At the start of each quarter</strong><span>Revisit the commitment prayer.</span></div>
            <div className="mode"><strong>Ask again</strong><span>Is this the Spirit or my ambition?</span></div>
            <div className="mode"><strong>Stay accountable</strong><span>Speak with a pastor, trusted elder or mature believer.</span></div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="divine-heading">
            <CheckCircle2 size={22} />
            <h2>Alfred safeguard</h2>
          </div>

          <div className="mode-grid">
            <div className="mode"><strong>Alfred must never say</strong><span>God told you. The Holy Spirit says. This is God's will.</span></div>
            <div className="mode"><strong>Alfred may</strong><span>Surface Scripture, encourage prayer, ask reflective questions and support journalling.</span></div>
            <div className="mode"><strong>Final authority</strong><span>Discernment belongs to you in prayer, guided by Scripture and the Holy Spirit.</span></div>
          </div>
        </section>

        <section className="card divine-closing" style={{ marginTop: "28px" }}>
          <p>Be faithful with what God has placed in your hands today. Leave tomorrow to Him.</p>
        </section>
      </div>
    </main>
  );
}
