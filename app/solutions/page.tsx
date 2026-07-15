"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Dumbbell,
  ExternalLink,
  Lightbulb,
  MessageSquareText,
  Route,
  Sparkles,
} from "lucide-react";

type Solution = {
  name: string;
  category: string;
  audience: string;
  purpose: string;
  status: string;
  pricing: string;
  url?: string;
  icon: "capture" | "gym" | "kaya" | "runsheet" | "opportunity" | "enterprise";
  notes?: string;
};

const solutions: Solution[] = [
  {
    name: "Fredi Capture",
    category: "Enquiry infrastructure",
    audience: "Growing UK SMEs",
    purpose: "Website enquiry qualification and lead capture, available 24/7.",
    status: "Live offer",
    pricing: "£397/month, no setup fee",
    icon: "capture",
    notes: "Use when a business needs better first-response handling without voice or WhatsApp.",
  },
  {
    name: "Fredi Capture+",
    category: "Enquiry infrastructure",
    audience: "Service businesses with higher enquiry volume",
    purpose: "Website enquiry handling plus inbound voice response, WhatsApp and direct calendar booking.",
    status: "Live offer",
    pricing: "£697/month + £299 setup",
    icon: "enterprise",
    notes: "Use when the enquiry journey spans more than the website alone.",
  },
  {
    name: "Grid Gym",
    category: "Fitness",
    audience: "Independent gyms, studios and performance-led fitness brands",
    purpose: "Membership enquiries, trial bookings and first-contact qualification.",
    status: "Live demo",
    pricing: "Commercial scope to be confirmed",
    url: "https://grid-gym-demo.mediahubink.com",
    icon: "gym",
    notes: "Proof asset for gym, fitness and membership-based enquiry systems.",
  },
  {
    name: "Kaya",
    category: "Customer experience",
    audience: "Positioning to be confirmed",
    purpose: "Live Mediahubink demo for a guided customer enquiry experience.",
    status: "Live demo",
    pricing: "Commercial scope to be confirmed",
    url: "https://kaya.mediahubink.com",
    icon: "kaya",
    notes: "Keep the sector and commercial use case editable until positioning is finalised.",
  },
  {
    name: "RunSheet OS",
    category: "Transport operations",
    audience: "Small and medium courier, transport and logistics companies",
    purpose: "Courier control, quoting, mileage, dispatch, job status and transport records.",
    status: "Live application",
    pricing: "Commercial scope to be confirmed",
    url: "https://app.runsheetos.co.uk",
    icon: "runsheet",
    notes: "Operational platform for firms moving beyond spreadsheets, WhatsApp and paper diaries.",
  },
  {
    name: "Opportunity Blueprint",
    category: "Business intelligence",
    audience: "Aspiring founders, side-hustle builders and opportunity seekers",
    purpose: "Assessment-led business opportunity discovery and revenue planning.",
    status: "Live application",
    pricing: "Commercial scope to be confirmed",
    url: "https://opportunity.mediahubink.com",
    icon: "opportunity",
    notes: "Use as a direct product, lead-generation asset or advisory entry point.",
  },
];

function SolutionIcon({ type }: { type: Solution["icon"] }) {
  if (type === "gym") return <Dumbbell size={24} />;
  if (type === "runsheet") return <Route size={24} />;
  if (type === "opportunity") return <Lightbulb size={24} />;
  if (type === "kaya") return <Sparkles size={24} />;
  if (type === "enterprise") return <Building2 size={24} />;
  return <MessageSquareText size={24} />;
}

export default function SolutionsPage() {
  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Mediahubink Solutions</div>
            <div className="logo-subtitle">
              Live products, proof assets and commercial offers
            </div>
          </div>

          <Link className="nav-pill" href="/">
            <ArrowLeft size={16} />
            Back to Alfred OS
          </Link>
        </nav>

        <section className="card">
          <div className="kicker">Step 33A · Mediahubink Solutions</div>
          <h1>Everything Mediahubink sells or demonstrates, in one place.</h1>
          <p className="lead">
            This page does not replace Projects, CRM, Proposals or Analytics.
            It gives those existing systems a clearer commercial centre.
          </p>
        </section>

        <section className="solutions-summary-grid" style={{ marginTop: "28px" }}>
          <article className="solutions-summary-card">
            <BriefcaseBusiness size={22} />
            <span>Solutions tracked</span>
            <strong>{solutions.length}</strong>
          </article>

          <article className="solutions-summary-card">
            <ExternalLink size={22} />
            <span>Live links</span>
            <strong>{solutions.filter((solution) => solution.url).length}</strong>
          </article>

          <article className="solutions-summary-card">
            <Building2 size={22} />
            <span>Commercial rule</span>
            <strong>No invented scope</strong>
          </article>
        </section>

        <section className="solutions-grid" style={{ marginTop: "28px" }}>
          {solutions.map((solution) => (
            <article className="solution-card" key={solution.name}>
              <div className="solution-card-header">
                <div className="solution-icon">
                  <SolutionIcon type={solution.icon} />
                </div>

                <div>
                  <span>{solution.category}</span>
                  <h2>{solution.name}</h2>
                </div>
              </div>

              <div className="solution-details">
                <div>
                  <strong>Status</strong>
                  <span>{solution.status}</span>
                </div>

                <div>
                  <strong>Target audience</strong>
                  <span>{solution.audience}</span>
                </div>

                <div>
                  <strong>Purpose</strong>
                  <span>{solution.purpose}</span>
                </div>

                <div>
                  <strong>Pricing</strong>
                  <span>{solution.pricing}</span>
                </div>
              </div>

              {solution.notes && (
                <div className="solution-note">
                  <strong>Commercial note</strong>
                  <span>{solution.notes}</span>
                </div>
              )}

              <div className="solution-actions">
                {solution.url ? (
                  <a
                    className="btn"
                    href={solution.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Live Solution
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <span className="solution-no-link">
                    No public demo link added yet
                  </span>
                )}

                <Link className="btn btn-secondary" href="/#crm">
                  View CRM
                </Link>

                <Link className="btn btn-secondary" href="/market-intelligence">
                  Market Intelligence
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="card" style={{ marginTop: "28px" }}>
          <div className="panel-title">Next connection</div>

          <div className="mode-grid">
            <div className="mode">
              <strong>Step 33B</strong>
              <span>Add a Solution field to each CRM record.</span>
            </div>

            <div className="mode">
              <strong>Step 33C</strong>
              <span>Report Pipeline and Analytics by solution.</span>
            </div>

            <div className="mode">
              <strong>Step 33D</strong>
              <span>Make proposals, content and market intelligence solution-aware.</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
