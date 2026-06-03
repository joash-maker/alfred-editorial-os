"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  MessageSquare,
  PoundSterling,
  ShieldQuestion,
  Target,
  Users,
} from "lucide-react";

const offers = [
  {
    name: "Fredi Capture",
    price: "£397/month",
    description: "Website enquiry capture, lead qualification, Google Sheets logging, email notifications and booking link integration.",
  },
  {
    name: "Fredi Capture+",
    price: "£697/month + £299 setup",
    description: "Everything in Capture, plus inbound voice response handling, WhatsApp, direct booking, 500 voice minutes and priority support.",
  },
  {
    name: "Fredi Enterprise",
    price: "Custom",
    description: "Multi-site scope, white-label options, custom integrations and enterprise deployment requirements quoted separately.",
  },
];

const stories = [
  {
    name: "The Hatch",
    bestFor: "Trades, estate agents and local business owners",
    summary: "A simple front-door hatch that answers repeated customer questions when the team cannot.",
  },
  {
    name: "The Helper Character",
    bestFor: "Schools, parents and non-technical audiences",
    summary: "A helper character that guides people, answers questions and points them to the next step.",
  },
  {
    name: "The Chip Shop Chalkboard",
    bestFor: "Yorkshire SMEs, trades and busy local operators",
    summary: "A chalkboard that answers the repeated questions before the queue slows down.",
  },
];

const objections = [
  {
    objection: "So it is just a chatbot?",
    answer: "A chatbot reads from a script. Our agents understand context, carry a conversation and know when to hand off to a human.",
  },
  {
    objection: "We need head office approval.",
    answer: "That is useful to know. Local validation still matters. The next step is to understand who owns the decision and when the wider rollout is being reviewed.",
  },
  {
    objection: "We already have a system.",
    answer: "Good. The question is not whether a system exists. The question is whether enquiries are still being missed after hours, during busy periods or across channels.",
  },
  {
    objection: "We are not ready for AI.",
    answer: "That is fine. The conversation is not about chasing AI. It is about whether your enquiry process is protecting revenue when your team is unavailable.",
  },
];

const sectorPlaybooks = [
  {
    sector: "Trades",
    pain: "Missed calls, quote delays, emergency jobs and after-hours enquiries.",
    offer: "Fredi Capture+",
  },
  {
    sector: "Schools",
    pain: "Repetitive parent questions, admissions queries and front office overload.",
    offer: "Netty",
  },
  {
    sector: "Dental",
    pain: "Reception closes while patients continue to enquire about treatments and appointments.",
    offer: "Fredi Capture+",
  },
  {
    sector: "Serviced Offices",
    pain: "Viewing requests, availability questions, lead qualification and multi-site routing.",
    offer: "Fredi Capture+ or Enterprise",
  },
  {
    sector: "Estate Agents",
    pain: "Viewing enquiries, property questions and slow response outside office hours.",
    offer: "Fredi Capture+",
  },
  {
    sector: "Gyms & Fitness",
    pain: "Membership questions, class enquiries, trial bookings and lost sign-up intent.",
    offer: "Fredi Capture",
  },
];

const caseStudies = [
  {
    name: "BizSpace Wakefield",
    status: "Validated",
    outcome: "Local team trialled the demo for two weeks, liked it, and escalated it to the parent company in Germany.",
    lesson: "Sector demand confirmed. Decision-maker sat outside the local site.",
  },
  {
    name: "Kolagri",
    status: "Strategic relationship",
    outcome: "Potential SADC landing partner and regional market intelligence source.",
    lesson: "Do not rush the sale. Build the relationship and validate regional demand.",
  },
  {
    name: "Netherton J & I School",
    status: "Relationship",
    outcome: "Existing school relationship with positive reception to Netty.",
    lesson: "Schools may respond better to practical workload reduction than technical AI language.",
  },
];

export default function KnowledgeBasePage() {
  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Knowledge Base</div>
            <div className="logo-subtitle">
              Mediahubink Intelligence Layer
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Step 29 · Mediahubink Intelligence Layer</div>
          <h1>What Mediahubink sells, how Joash explains it, and why it matters.</h1>
          <p className="lead">
            This page gives Alfred a single source of truth for positioning, offers, pricing,
            sales stories, objections, sectors, case studies and the £25,500 MRR target.
          </p>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="knowledge-heading">
            <Target size={22} />
            <div>
              <p className="kicker">Core Positioning</p>
              <h2>Mediahubink builds digital front-of-house systems for UK SMEs.</h2>
            </div>
          </div>

          <blockquote className="strategy-quote" style={{ marginTop: "20px" }}>
            I build AI agents that do the repetitive work your front-of-house staff should not be doing, so you stop losing leads at 10pm and start conversations you did not have to start yourself.
          </blockquote>

          <div className="mode-grid" style={{ marginTop: "22px" }}>
            <div className="mode">
              <strong>Plain English</strong>
              <span>We make sure small businesses never miss a customer again.</span>
            </div>

            <div className="mode">
              <strong>Commercial Language</strong>
              <span>Inbound enquiry systems, lead capture, qualification layers and market entry operations.</span>
            </div>

            <div className="mode">
              <strong>Positioning Rule</strong>
              <span>Infrastructure, not just a chatbot. Revenue protection, not novelty technology.</span>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="knowledge-heading">
            <PoundSterling size={22} />
            <h2>Mediahubink Offers</h2>
          </div>

          <div className="knowledge-card-grid">
            {offers.map((offer) => (
              <article className="knowledge-card" key={offer.name}>
                <h3>{offer.name}</h3>
                <strong>{offer.price}</strong>
                <p>{offer.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="knowledge-heading">
            <BookOpen size={22} />
            <h2>Story Library</h2>
          </div>

          <div className="knowledge-card-grid">
            {stories.map((story) => (
              <article className="knowledge-card" key={story.name}>
                <h3>{story.name}</h3>
                <p>{story.summary}</p>
                <span>Best for: {story.bestFor}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="knowledge-heading">
            <ShieldQuestion size={22} />
            <h2>Objection Library</h2>
          </div>

          <div className="mode-grid">
            {objections.map((item) => (
              <div className="mode" key={item.objection}>
                <strong>{item.objection}</strong>
                <span>{item.answer}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="knowledge-heading">
            <Building2 size={22} />
            <h2>Sector Playbooks</h2>
          </div>

          <div className="knowledge-card-grid">
            {sectorPlaybooks.map((playbook) => (
              <article className="knowledge-card" key={playbook.sector}>
                <h3>{playbook.sector}</h3>
                <p>{playbook.pain}</p>
                <span>Recommended offer: {playbook.offer}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="knowledge-heading">
            <Users size={22} />
            <h2>Case Study Vault</h2>
          </div>

          <div className="mode-grid">
            {caseStudies.map((study) => (
              <div className="mode" key={study.name}>
                <strong>{study.name}</strong>
                <span>Status: {study.status}</span>
                <span>Outcome: {study.outcome}</span>
                <span>Lesson: {study.lesson}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="knowledge-heading">
            <PoundSterling size={22} />
            <h2>Revenue Targets</h2>
          </div>

          <div className="section" style={{ marginTop: "18px" }}>
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

            <div className="mini-card">
              <h3>Enterprise Clients</h3>
              <p>7 at £4,000</p>
            </div>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="knowledge-heading">
            <MessageSquare size={22} />
            <h2>How Alfred Should Use This</h2>
          </div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Proposals</strong>
              <span>Use the correct offer, pricing, proof and sector pain before writing a proposal.</span>
            </div>

            <div className="mode">
              <strong>Outreach</strong>
              <span>Use the right story: Hatch, Helper Character or Chip Shop, based on the prospect.</span>
            </div>

            <div className="mode">
              <strong>CRM Advice</strong>
              <span>Use case study lessons to decide whether a lead is lost, stalled or worth reactivating.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
