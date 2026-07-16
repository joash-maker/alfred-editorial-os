"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Lightbulb,
  MapPin,
  PauseCircle,
  PoundSterling,
  Target,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

type OpportunityStatus = "Active" | "Won" | "Lost" | "Watching" | "Paused";

type TimelineEvent = {
  date: string;
  title: string;
  detail: string;
};

type Opportunity = {
  id: string;
  company: string;
  website: string;
  industry: string;
  location: string;
  employees: string;
  solution: string;
  potentialMrr: number;
  probability: number;
  stage: string;
  status: OpportunityStatus;
  reviewDate: string;
  priority: string;
  champion: string;
  decisionMaker: string;
  procurement: string;
  technicalContact: string;
  currentProcess: string;
  painPoints: string;
  desiredOutcome: string;
  buyingConcerns: string;
  successLooksLike: string;
  outcomeSummary: string;
  lesson: string;
  nextAction: string;
  timeline: TimelineEvent[];
};

const opportunities: Opportunity[] = [
  {
    id: "bizspace-wakefield",
    company: "BizSpace Wakefield",
    website: "https://www.bizspace.co.uk",
    industry: "Serviced offices",
    location: "Wakefield, West Yorkshire",
    employees: "Local site within a wider group",
    solution: "Fredi Capture+",
    potentialMrr: 697,
    probability: 20,
    stage: "Lost, future review",
    status: "Lost",
    reviewDate: "July 2027",
    priority: "Relationship nurture",
    champion: "Wakefield centre team",
    decisionMaker: "Parent company in Germany",
    procurement: "Group-level approval",
    technicalContact: "Not confirmed",
    currentProcess: "The local site reviewed a bespoke enquiry system and trialled the demo for two weeks.",
    painPoints: "The Wakefield team wanted stronger enquiry handling, but local approval was not enough to proceed.",
    desiredOutcome: "Improve website enquiry capture and response without adding more administrative pressure.",
    buyingConcerns: "The parent company had already planned a group-wide chatbot rollout across its websites.",
    successLooksLike: "A future opening where the parent company reviews results from the central rollout and considers alternatives or specialist local support.",
    outcomeSummary: "The local team liked the demo and supported the idea. The opportunity did not progress because the final decision sat with the parent company, which had already committed to another rollout.",
    lesson: "Identify enterprise procurement and group-level technology decisions before investing heavily in a bespoke local demonstration.",
    nextAction: "Maintain the relationship and review after the parent company's rollout has had time to mature.",
    timeline: [
      { date: "Initial conversation", title: "Local interest confirmed", detail: "The Wakefield team responded positively to the proposed enquiry system." },
      { date: "Trial period", title: "Two-week demo trial", detail: "The team tested the demonstration and shared it internally." },
      { date: "Internal review", title: "Sent to parent company", detail: "The local team escalated the demo to the parent company in Germany." },
      { date: "Decision", title: "Opportunity did not proceed", detail: "The parent company was already planning a group-wide chatbot rollout." },
      { date: "Future", title: "Relationship retained", detail: "The opportunity remains worth reviewing after the existing rollout is established." },
    ],
  },
  {
    id: "abc-logistics",
    company: "ABC Logistics",
    website: "Website to be confirmed",
    industry: "Courier and logistics",
    location: "Northern England",
    employees: "Small to medium operator",
    solution: "RunSheet OS",
    potentialMrr: 697,
    probability: 55,
    stage: "Discovery",
    status: "Active",
    reviewDate: "Review this month",
    priority: "High",
    champion: "Owner or operations manager",
    decisionMaker: "Business owner",
    procurement: "Owner-led",
    technicalContact: "Operations lead",
    currentProcess: "Jobs are coordinated through spreadsheets, WhatsApp and disconnected records.",
    painPoints: "Quoting, dispatch, mileage, job updates and record keeping require repeated manual work.",
    desiredOutcome: "Create one simple operational view for quotes, dispatch, status tracking and transport records.",
    buyingConcerns: "Concern about changing an existing working process and whether the team will adopt a new system.",
    successLooksLike: "Faster quoting, fewer missed updates and a clean audit trail without introducing an enterprise transport platform.",
    outcomeSummary: "Opportunity is in discovery. The operational fit appears strong, but the current workflow needs to be mapped before a proposal is prepared.",
    lesson: "Lead with the operational friction and owner time saved, not with software features.",
    nextAction: "Confirm current quoting and dispatch process, then prepare a focused pilot recommendation.",
    timeline: [
      { date: "Research", title: "Prospect identified", detail: "The company matched the RunSheet OS ideal profile." },
      { date: "Initial outreach", title: "Operational angle prepared", detail: "Messaging focused on spreadsheets, WhatsApp and dispatch visibility." },
      { date: "Current", title: "Discovery required", detail: "The next step is to understand the live workflow and owner priorities." },
    ],
  },
  {
    id: "north-leeds-gym",
    company: "North Leeds Gym",
    website: "Website to be confirmed",
    industry: "Fitness",
    location: "Leeds, West Yorkshire",
    employees: "Independent gym",
    solution: "Grid Gym",
    potentialMrr: 697,
    probability: 45,
    stage: "Demo interest",
    status: "Watching",
    reviewDate: "Review in 30 days",
    priority: "Medium",
    champion: "Gym manager",
    decisionMaker: "Owner",
    procurement: "Owner-led",
    technicalContact: "Website provider",
    currentProcess: "Membership enquiries arrive through social media, website forms and direct messages.",
    painPoints: "Prospects receive inconsistent responses, particularly outside staffed hours.",
    desiredOutcome: "Qualify membership enquiries, guide trial bookings and keep interested prospects moving.",
    buyingConcerns: "The owner needs to see a direct link between the system and new memberships.",
    successLooksLike: "More qualified trial bookings, faster first response and fewer enquiries disappearing without follow-up.",
    outcomeSummary: "The prospect is suitable for the Grid Gym demonstration but needs a clearer commercial case before moving forward.",
    lesson: "Fitness prospects respond better when the conversation starts with missed memberships rather than technology.",
    nextAction: "Send the Grid Gym demo with a short explanation of the enquiry journey and suggested trial-booking workflow.",
    timeline: [
      { date: "Research", title: "Gym profile reviewed", detail: "The business appears to rely on several enquiry channels." },
      { date: "Positioning", title: "Membership angle selected", detail: "The commercial focus is trial bookings and missed after-hours enquiries." },
      { date: "Next", title: "Demo follow-up", detail: "Share the Grid Gym demonstration and request feedback from the owner." },
    ],
  },
];

function formatMoney(value: number) {
  return `£${value.toLocaleString("en-GB")}`;
}

function statusClass(status: OpportunityStatus) {
  return `opportunity-status ${status.toLowerCase()}`;
}

export default function OpportunityHubPage() {
  const [selectedId, setSelectedId] = useState(opportunities[0].id);
  const selected = opportunities.find((item) => item.id === selectedId) || opportunities[0];

  const counts = useMemo(() => ({
    active: opportunities.filter((item) => item.status === "Active").length,
    won: opportunities.filter((item) => item.status === "Won").length,
    lost: opportunities.filter((item) => item.status === "Lost").length,
    watching: opportunities.filter((item) => item.status === "Watching").length,
    paused: opportunities.filter((item) => item.status === "Paused").length,
    reviews: opportunities.filter((item) => item.reviewDate.toLowerCase().includes("review")).length,
  }), []);

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Opportunity Hub</div>
            <div className="logo-subtitle">Commercial memory for every meaningful opportunity</div>
          </div>
          <Link className="nav-pill" href="/"><ArrowLeft size={16} />Back to Alfred OS</Link>
        </nav>

        <section className="card opportunity-hero">
          <div className="kicker">Step 42 · Opportunity Intelligence v1.0</div>
          <h1>Every opportunity tells a story. Capture it once. Learn from it forever.</h1>
          <p className="lead">CRM tracks movement. Opportunity Hub keeps the context, people, decisions, lessons and future value behind every deal.</p>
        </section>

        <section className="opportunity-summary-grid" style={{ marginTop: "28px" }}>
          <article className="opportunity-summary-card"><BriefcaseBusiness size={22} /><span>Active</span><strong>{counts.active}</strong></article>
          <article className="opportunity-summary-card"><CheckCircle2 size={22} /><span>Won</span><strong>{counts.won}</strong></article>
          <article className="opportunity-summary-card"><XCircle size={22} /><span>Lost</span><strong>{counts.lost}</strong></article>
          <article className="opportunity-summary-card"><Eye size={22} /><span>Watching</span><strong>{counts.watching}</strong></article>
          <article className="opportunity-summary-card"><PauseCircle size={22} /><span>Paused</span><strong>{counts.paused}</strong></article>
          <article className="opportunity-summary-card"><CalendarClock size={22} /><span>Reviews due</span><strong>{counts.reviews}</strong></article>
        </section>

        <section className="opportunity-layout" style={{ marginTop: "28px" }}>
          <aside className="card opportunity-list-panel">
            <div className="panel-title">Opportunities</div>
            <div className="opportunity-list">
              {opportunities.map((opportunity) => (
                <button key={opportunity.id} className={selectedId === opportunity.id ? "opportunity-list-item active" : "opportunity-list-item"} onClick={() => setSelectedId(opportunity.id)}>
                  <div className="opportunity-list-top"><strong>{opportunity.company}</strong><span className={statusClass(opportunity.status)}>{opportunity.status}</span></div>
                  <span>{opportunity.solution}</span><span>{opportunity.stage}</span><small>{opportunity.reviewDate}</small>
                </button>
              ))}
            </div>
          </aside>

          <div className="opportunity-record">
            <section className="card">
              <div className="opportunity-record-header">
                <div><div className="kicker">{selected.industry}</div><h2>{selected.company}</h2><p>{selected.outcomeSummary}</p></div>
                <span className={statusClass(selected.status)}>{selected.status}</span>
              </div>
              <div className="opportunity-facts-grid">
                <div className="opportunity-fact"><Building2 size={17} /><strong>Solution</strong><span>{selected.solution}</span></div>
                <div className="opportunity-fact"><PoundSterling size={17} /><strong>Potential MRR</strong><span>{formatMoney(selected.potentialMrr)}</span></div>
                <div className="opportunity-fact"><Target size={17} /><strong>Probability</strong><span>{selected.probability}%</span></div>
                <div className="opportunity-fact"><Clock3 size={17} /><strong>Stage</strong><span>{selected.stage}</span></div>
                <div className="opportunity-fact"><MapPin size={17} /><strong>Location</strong><span>{selected.location}</span></div>
                <div className="opportunity-fact"><Users size={17} /><strong>Organisation</strong><span>{selected.employees}</span></div>
              </div>
            </section>

            <section className="opportunity-two-column">
              <article className="card"><div className="opportunity-section-heading"><UserRound size={20} /><h2>People</h2></div><div className="opportunity-detail-list">
                <div><strong>Champion</strong><span>{selected.champion}</span></div><div><strong>Decision maker</strong><span>{selected.decisionMaker}</span></div><div><strong>Procurement</strong><span>{selected.procurement}</span></div><div><strong>Technical contact</strong><span>{selected.technicalContact}</span></div>
              </div></article>
              <article className="card"><div className="opportunity-section-heading"><CalendarClock size={20} /><h2>Commercial review</h2></div><div className="opportunity-detail-list">
                <div><strong>Priority</strong><span>{selected.priority}</span></div><div><strong>Review date</strong><span>{selected.reviewDate}</span></div><div><strong>Next action</strong><span>{selected.nextAction}</span></div><div><strong>Website</strong><span>{selected.website}</span></div>
              </div></article>
            </section>

            <section className="card"><div className="opportunity-section-heading"><FileText size={20} /><h2>Opportunity story</h2></div><div className="opportunity-story-grid">
              <div><strong>Current process</strong><p>{selected.currentProcess}</p></div><div><strong>Pain points</strong><p>{selected.painPoints}</p></div><div><strong>Desired outcome</strong><p>{selected.desiredOutcome}</p></div><div><strong>Buying concerns</strong><p>{selected.buyingConcerns}</p></div><div><strong>Success looks like</strong><p>{selected.successLooksLike}</p></div>
            </div></section>

            <section className="card"><div className="opportunity-section-heading"><Clock3 size={20} /><h2>Timeline</h2></div><div className="opportunity-timeline">
              {selected.timeline.map((event, index) => <article className="opportunity-timeline-item" key={`${event.title}-${index}`}><div className="opportunity-timeline-marker" /><div><span>{event.date}</span><h3>{event.title}</h3><p>{event.detail}</p></div></article>)}
            </div></section>

            <section className="card opportunity-lesson-card"><div className="opportunity-section-heading"><Lightbulb size={20} /><h2>Lesson learned</h2></div><blockquote>{selected.lesson}</blockquote></section>
          </div>
        </section>

        <section className="card" style={{ marginTop: "28px" }}><div className="panel-title">Version 1 boundaries</div><div className="mode-grid">
          <div className="mode"><strong>Safe prototype</strong><span>Sample records only. No CRM or Supabase data is changed.</span></div>
          <div className="mode"><strong>Next version</strong><span>Create opportunity records from live CRM leads.</span></div>
          <div className="mode"><strong>Future intelligence</strong><span>Search lessons, objections, outcomes and review dates across every opportunity.</span></div>
        </div></section>
      </div>
    </main>
  );
}
