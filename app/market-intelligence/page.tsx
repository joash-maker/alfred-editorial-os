"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Globe2,
  MapPin,
  Sprout,
  Building2,
  GraduationCap,
  Stethoscope,
  Home,
  Workflow,
} from "lucide-react";

const ukPrioritySectors = [
  "Trades",
  "Dental",
  "Estate Agents",
];

const ukSecondarySectors = [
  "Schools",
  "Serviced Offices",
];

const sadcOpportunityAreas = [
  {
    name: "Agriculture",
    icon: Sprout,
    note: "Agribusiness, suppliers, exporters, distributors and cooperatives.",
  },
  {
    name: "Healthcare",
    icon: Stethoscope,
    note: "Clinics, dental practices and private healthcare providers.",
  },
  {
    name: "Education",
    icon: GraduationCap,
    note: "Schools, training providers, universities and admissions teams.",
  },
  {
    name: "Property",
    icon: Home,
    note: "Estate agencies, developers, serviced offices and property operators.",
  },
  {
    name: "Business automation",
    icon: Workflow,
    note: "Lead capture, WhatsApp workflows, CRM setup and ERP integration scoping.",
  },
  {
    name: "SME operations",
    icon: Building2,
    note: "Customer communication, enquiry handling and operational visibility.",
  },
];

const marketObservations = [
  {
    market: "United Kingdom",
    observations: [
      "Trades remain highly dependent on phone enquiries, fast response and quote follow-up.",
      "Dental practices frequently experience reception bottlenecks and missed patient enquiries.",
      "Estate agents rely heavily on speed-to-response, viewing enquiries and out-of-hours capture.",
    ],
  },
  {
    market: "SADC Region",
    observations: [
      "Market demand signal identified through Forrest at Kolagri SARL.",
      "Kolagri may serve as an initial landing point into the region.",
      "Demand must be validated through further conversations before any commercial assumptions are made.",
    ],
  },
];

const strategicQuestions = [
  "Which sectors are actively spending money on automation, customer communication and operational systems?",
  "Which SADC countries show the clearest near-term opportunity?",
  "What problems are businesses trying to solve when they mention AI?",
  "Who controls budget decisions in each market?",
  "Which local partnerships would accelerate trust and market access?",
];

export default function MarketIntelligencePage() {
  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Market Intelligence</div>
            <div className="logo-subtitle">
              Mediahubink market knowledge and opportunity tracking
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Strategy OS · Step 21D</div>
          <h1>Know the market before building the offer.</h1>
          <p className="lead">
            This page tracks what Mediahubink knows about sectors, markets and regional opportunities, so decisions are based on signals rather than assumptions.
          </p>

          <div className="section">
            <div className="mini-card">
              <h3>Markets tracked</h3>
              <p>2</p>
            </div>

            <div className="mini-card">
              <h3>Primary market</h3>
              <p>United Kingdom</p>
            </div>

            <div className="mini-card">
              <h3>Strategic watchlist</h3>
              <p>SADC Region</p>
            </div>
          </div>
        </section>

        <section className="market-grid" style={{ marginTop: "28px" }}>
          <article className="card">
            <div className="market-card-header">
              <Globe2 size={22} />
              <div>
                <p className="market-label">Primary market</p>
                <h2>United Kingdom</h2>
              </div>
            </div>

            <div className="market-block">
              <h3>Priority sectors</h3>
              <ul>
                {ukPrioritySectors.map((sector) => (
                  <li key={sector}>{sector}</li>
                ))}
              </ul>
            </div>

            <div className="market-block">
              <h3>Secondary sectors</h3>
              <ul>
                {ukSecondarySectors.map((sector) => (
                  <li key={sector}>{sector}</li>
                ))}
              </ul>
            </div>

            <div className="market-note">
              <strong>Current focus:</strong>
              <span>Acquire the first 5 retainer clients through Fredi Capture and Fredi Capture+.</span>
            </div>
          </article>

          <article className="card">
            <div className="market-card-header">
              <MapPin size={22} />
              <div>
                <p className="market-label">Strategic market development</p>
                <h2>SADC Region</h2>
              </div>
            </div>

            <div className="market-block">
              <h3>Status</h3>
              <p>Research and relationship building.</p>
            </div>

            <div className="market-block">
              <h3>Primary contact</h3>
              <p>Forrest, Kolagri SARL.</p>
            </div>

            <div className="market-note">
              <strong>Current signal:</strong>
              <span>Large demand for AI and business automation solutions across the region, to be validated through further conversations.</span>
            </div>

            <div className="market-note">
              <strong>Current objective:</strong>
              <span>Validate demand before pursuing expansion, with Kolagri as a possible landing point.</span>
            </div>
          </article>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Opportunity areas</div>

          <div className="market-opportunity-grid">
            {sadcOpportunityAreas.map((area) => {
              const Icon = area.icon;

              return (
                <div className="market-opportunity-card" key={area.name}>
                  <Icon size={22} />
                  <h3>{area.name}</h3>
                  <p>{area.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Market observations</div>

          <div className="mode-grid">
            {marketObservations.map((item) => (
              <div className="mode" key={item.market}>
                <strong>{item.market}</strong>
                {item.observations.map((observation) => (
                  <span key={observation}>{observation}</span>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Strategic questions</div>

          <div className="mode-grid">
            {strategicQuestions.map((question, index) => (
              <div className="mode" key={question}>
                <strong>Question {index + 1}</strong>
                <span>{question}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Operating rule</div>

          <div className="mode">
            <strong>Do not expand on assumption.</strong>
            <span>
              Treat SADC as a market discovery initiative until repeated demand signals, budget evidence and trusted local partnerships are confirmed.
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
