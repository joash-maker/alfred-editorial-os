"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Mic,
  Square,
  Clipboard,
  Copy,
  Trash2,
  PenSquare,
  Briefcase,
  Search,
  Megaphone,
  Send,
  BarChart3,
  Target,
  FileText,
  Printer,
  ExternalLink,
} from "lucide-react";

type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
    SpeechRecognition?: new () => SpeechRecognitionType;
  }
}

type Thought = {
  id: string;
  created_at: string;
  title: string | null;
  category: string | null;
  content: string;
  status: string | null;
};

type Demo = {
  id: string;
  vertical: string;
  demo_url: string;
  cta: string | null;
  notes: string | null;
  status: string | null;
};

type Offer = {
  id: string;
  name: string;
  offer_type: string | null;
  description: string | null;
  price: string | null;
  cta: string | null;
  status: string | null;
};

type Knowledge = {
  id: string;
  category: string;
  title: string;
  content: string;
  source: string | null;
  status: string | null;
};

type Lead = {
  id: string;
  created_at: string;
  name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  source: string | null;
  interest: string | null;
  solution: string | null;
  stage: string | null;
  notes: string | null;
  follow_up_date: string | null;
  estimated_value: number | null;
  monthly_value: number | null;
  score: number | null;
  lead_score: number | null;
  priority: string | null;
  next_action: string | null;
  next_action_date: string | null;
  last_contacted: string | null;
  region: string | null;
};

type Project = {
  id: string;
  name: string;
  url: string | null;
  category: string | null;
  audience: string | null;
  description: string | null;
  status: string | null;
};

type Interaction = {
  id: string;
  lead_id: string;
  created_at?: string | null;
  occurred_at?: string | null;
  contact_name?: string | null;
  channel?: string | null;
  direction?: string | null;
  outcome?: string | null;
  summary?: string | null;
  next_action?: string | null;
  next_action_date?: string | null;
  source?: string | null;
};

type VoiceMode = "natural" | "device" | "silent";
type BedtimeMode = "normal" | "wind-down" | "stop";

type Mode =
  | "general"
  | "creative-desk"
  | "linkedin-lead"
  | "substack-note"
  | "vertical-campaign"
  | "prospect-intelligence"
  | "campaign-weekly"
  | "prospect-outreach"
  | "metrics-review"
  | "lead-operator"
  | "proposal-builder"
  | "service-agreement"
  | "invoice-generator"
  | "payment-instructions";

function getLondonClockParts() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  return {
    hour: Number(value("hour")),
    minute: Number(value("minute")),
    dateISO: `${value("year")}-${value("month")}-${value("day")}`,
  };
}

function getGreetingText(hour: number) {
  if (hour >= 5 && hour < 12) return "Good morning, Joash.";
  if (hour >= 12 && hour < 17) return "Good afternoon, Joash.";
  if (hour >= 17 && hour < 22) return "Good evening, Joash.";
  return "Good night, Joash.";
}

function getBedtimeMode(hour: number, minute: number): BedtimeMode {
  if (hour === 22 && minute >= 30) return "wind-down";
  if (hour >= 23 || hour < 5) return "stop";
  return "normal";
}

function getBedtimeReminder(mode: BedtimeMode) {
  if (mode === "wind-down") {
    return "It is time to stop for tonight, save your work and get ready for bed.";
  }

  if (mode === "stop") {
    return "It is past your cut-off. That is enough for tonight. Save your work and go to bed. We can pick this up tomorrow.";
  }

  return "";
}

function getBedtimePromptRule() {
  const { hour, minute } = getLondonClockParts();
  const mode = getBedtimeMode(hour, minute);

  if (mode === "wind-down") {
    return "It is between 22:30 and 23:00 UK time. Remind Joash clearly to stop working and go to bed. Do not give him a new evening work block. You may state the first task for tomorrow or help with one tiny urgent action.";
  }

  if (mode === "stop") {
    return "It is after Joash's nightly cut-off. Be firm but warm: tell him to stop working and go to bed. Do not encourage a new project, build, research session or extended task. Only help with something genuinely urgent or state the first task for tomorrow.";
  }

  return "Normal operating hours. If planning tonight, finish focused work by 22:30 UK time.";
}

const mediahubinkPositioning = `
MEDIAHUBINK POSITIONING

Mediahubink helps growing UK businesses improve enquiry systems so they can scale without unnecessary hiring.

Mediahubink redesigns how enquiries are captured, qualified, routed and converted across websites, phone, email, WhatsApp, booking systems and distributed teams.

AI may support the system, but AI is not the headline.

Primary language:
- enquiry systems
- inbound performance
- lead qualification
- response workflows
- operational scale
- market entry operations
- commercial systems

Avoid:
- AI agency
- enquiry tool vendor
- automation freelancer
- novelty AI product business
- audit-led pitch

Preferred CTA:
Audit your enquiry system.
Do not default to: Try the demo.


TECHNICAL LANGUAGE RULE

Do not use AI-centric descriptors unless the user explicitly asks for technical wording.

Never use:
- automated
- digitally enabled
- automated
- AI chatbot
- AI assistant
- AI agent
- automated voice response handling
- automated voice response handling
- chatbot
- automation solution

Default commercial language:
- digital enquiry assistant
- automated response handling
- enquiry capture system
- qualification layer
- response workflow
- enquiry routing
- managed enquiry handling
- automated voice response handling
- after-hours enquiry capture

FINAL PRODUCT LANGUAGE ENFORCEMENT:
If a generated output contains phrases such as automated, digitally enabled, automated, AI chatbot, AI assistant, AI agent or automated voice response handling, rewrite them before responding using the preferred commercial language above.

PRODUCT LANGUAGE RULE

Keep product names such as Fredi Capture+, Fredi Enterprise, Pondu and Netty unchanged.

Do not describe Mediahubink primarily as a chatbot provider, automation freelancer or AI agent seller.

Preferred product language:
- digital enquiry assistant
- enquiry capture system
- qualification layer
- response workflow
- automated voice response handling
- after-hours enquiry capture
- inbound response layer
- enquiry routing system
- commercial enquiry system

Only reference AI when technically necessary, not as default positioning.

`;

const commercialAccuracyRules = `
COMMERCIAL ACCURACY RULE

Never invent:

- pricing structures
- per-site pricing
- multi-site multipliers
- enterprise discounts
- staffing structures
- implementation teams
- implementation processs
- reporting deliverables
- support SLAs
- onboarding steps
- service inclusions
- timelines
- rollout assumptions
- commercial commitments

If not explicitly defined, state:
Custom scope to be confirmed.

MULTI-SITE AND ENTERPRISE RULE

For:

- multi-site businesses
- groups
- chains
- franchises
- enterprise deployments
- bespoke commercial scenarios

Never automatically multiply standard single-site pricing.

Never assume:
standard pricing x number of locations.

Instead state:
Multi-site commercial scope to be quoted separately.

Only calculate pricing where explicit pricing rules exist.

OPERATING MODEL RULE

Do not invent internal staffing.

Never refer to:

- implementation process
- account manager
- delivery team
- support team
- commercial team

unless explicitly defined by the user.

Use neutral wording:

- Mediahubink
- we
- implementation process
- onboarding process

DELIVERABLE ACCURACY RULE

Only include deliverables explicitly defined.

Do not invent:

- reporting dashboards
- monthly summaries
- optimisation reviews
- support commitments
- analytics deliverables

unless explicitly stated.
`;

const mediahubinkPaymentRules = `
MEDIAHUBINK PAYMENT RULES

Preferred payment method:
Secure Stripe payment links.

Fallback:
Bank transfer available on request.

Formal payment contact:
info@mediahubink.com

VAT status:
Mediahubink Limited is not currently VAT registered.
No VAT is charged.

Stripe payment links:

Fredi Capture - Setup Fee (£299):
https://buy.stripe.com/9B6cMZeeh5ca9SRbhFeIw00

Fredi Capture - Monthly Retainer (£397/month):
https://buy.stripe.com/4gMaERfilcEC6GFdpNeIw05

Fredi Capture+ - Setup Fee (£299):
https://buy.stripe.com/3cI4gt6LPfQO2qp85teIw01

Fredi Capture+ - Monthly Retainer (£697/month):
https://buy.stripe.com/28E28l0nrfQOaWV0D1eIw06

Emergency Build - Crisis Chat (£599):
https://buy.stripe.com/8x26oB6LPgUSd532L9eIw02

Emergency Build - Crisis Chat + Voice (£999):
https://buy.stripe.com/6oU14h6LP7kid5385teIw03

Emergency Build - Crisis Full Stack (£1,499):
https://buy.stripe.com/bJe4gtc69bAy5CB71peIw04

Payment link rules:
- If the offer matches one of the Stripe links above, output the correct payment link automatically
- If both setup fee and monthly retainer are required, include both links
- If the offer does not match a listed payment link, write: Bank transfer or custom payment link available on request
- Never invent payment links
- Never invent bank details
- Do not use bank details unless the user supplies them
- For formal documents, use info@mediahubink.com for payment queries
- Ask clients to confirm payment by emailing info@mediahubink.com
- For implementation services, direct the client to book the implementation call after payment:
https://calendar.app.google/e7e8NMLiRnajNFHo9
`;

const modePrompts: Record<Mode, string> = {
  /* EMAIL ROUTING RULE:
- Use info@mediahubink.com for proposals, service agreements, payment documents and invoices
- Use info@mediahubink.com for outreach, social posts, thought leadership and non-formal content */
  general:
    "Respond as Alfred, Joash's commercial chief of staff for Mediahubink. Be calm, clear, useful and commercially aware.",

  "creative-desk":
    "Turn the user's thought into a Creative Desk content idea. Suggest whether it should become Tuesday Builder’s Brief, Thursday Lab Notes, or Sunday Strategic Reset. Then create a strong title, angle, outline, Substack CTA, LinkedIn teaser, Substack Note and visual brief.",

  "linkedin-lead":
    "Create a modern, effective LinkedIn lead-generation post for Mediahubink. Use British English. Make it commercially sharp, direct and specific. Structure it with a strong hook, pain point, numbers or business impact, mechanism, clear CTA, and a pinned comment. Avoid hype, em dashes and double hyphens.",

  "substack-note":
    "Create a short Substack Note from the user's thought. Make it thoughtful, concise, calm and worth replying to. Include one sharp idea, one short reflection, and a soft invitation to read or subscribe.",

  "vertical-campaign":
    "Create a vertical-specific LinkedIn campaign for Mediahubink. Include target vertical, pain point, 5 post titles, one full sample post, pinned comment, CTA, suggested demo link type, and hashtags. Keep it practical and conversion-focused. Avoid hype, em dashes and double hyphens.",

  "prospect-intelligence":
    "Act as Mediahubink's commercial intelligence strategist. Never ask for more information unless absolutely necessary. If the user gives a broad industry, analyse the vertical immediately. If they give a specific company, analyse that company using available clues and assumptions without fabricating facts. If only a URL is provided, do not pretend to visit it. Use loaded projects, offers, universal AI products and business assumptions. If no exact demo exists, recommend the closest proof asset and explain transferability. Always include: pain points, missed revenue gaps, operational inefficiencies, best-fit enquiry system offer, proof asset, outreach angle, objections, LinkedIn DM, email draft, next action. British English. Commercially sharp. No em dashes or double hyphens.",

  "campaign-weekly":
    "Act as Alfred, Mediahubink's campaign chief of staff. Build a weekly campaign plan using the current projects, demos, offers, leads and knowledge loaded into context. Include: weekly objective, target vertical, key offer, best demo to push, 5 LinkedIn post ideas, 3 Substack Notes, outreach actions, CRM actions, daily schedule, CTA strategy, and Friday reflection prompt. Keep it practical, focused and commercially useful. Avoid hype, em dashes and double hyphens.",

  "prospect-outreach":
    "Act as Mediahubink's outreach strategist. Create commercially sharp outreach for the prospect or vertical provided. If no exact demo exists, intelligently map the closest Mediahubink proof asset and explain how the same AI framework applies. Include pain points, best-fit enquiry system offer, proof asset, LinkedIn connection message, follow-up sequence, objections and suggested replies. British English. Warm, practical, direct. Never use em dashes or double hyphens.",

  "metrics-review":
    "Act as Alfred, Mediahubink's campaign analyst. Review the metrics, campaign notes or weekly reflection provided. Identify what worked, what underperformed, likely reasons, strongest vertical, best content angle, CRM implications, next week's recommendation, what to stop, what to double down on, and one clear action plan. Be honest, practical and commercially focused.",

  "lead-operator":
    "Act as Mediahubink's sales operator. Review CRM leads and decide who to prioritise, what to do next, who is likely hot, who is cold, what outreach to send, and what commercial opportunity exists. Score urgency, fit and revenue potential. Be commercially sharp, practical and direct. Use the loaded leads, offers, demos, projects and knowledge.",

  "proposal-builder": `Act as Mediahubink's commercial proposal strategist.

Build a polished UK client proposal in British English.

CRITICAL RULES:
- NEVER invent dates
- NEVER use placeholder dates
- ALWAYS use this exact date:
${new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})}
- Use this exact agreement date structure:
  Agreement issue date: ${new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}
  Execution date: To be completed on signature
- Never replace the issue date with year only
- NEVER output markdown tables
- NEVER use pipe table formatting
- NEVER use em dashes
- NEVER use double hyphens as substitutes
- NEVER use dash-led interruptions to connect thoughts
- Use commas, colons, semicolons, or full stops instead
- Use only headings, paragraphs and bullet lists
- Format pricing clearly with spacing and bullet points
- Keep the full proposal between 1,200 and 1,800 words
- Complete the final Next Steps and CTA section in full
- Never stop mid-sentence
- Finish the full proposal properly. Do not stop mid-section

STRUCTURE:
1. Executive summary
2. Business problem
3. Opportunity cost
4. Recommended AI solution
5. Pricing
6. Implementation timeline
7. ROI
8. Objections and responses
9. Next steps
10. CTA

FORMAL DOCUMENT DETAILS:
Use info@mediahubink.com for formal proposal contact details.
Use this provider identity block in formal proposals where appropriate:

Mediahubink Limited
7 Tileyard North
Wakefield
WF1 5FY
United Kingdom

info@mediahubink.com
07764 182758
https://www.mediahubink.com

Company No. 17218602

OUTPUT FORMAT ENFORCEMENT:
- If pricing is needed, use bullet lists only
- Never render pricing as a markdown table
- Never use pipe formatting
- A response containing tables is invalid
- Do not abbreviate Mediahubink Limited formal details in formal documents

STYLE:
- Calm
- Premium
- Commercial
- Concise
- No hype
- No jargon

END WITH:
Book a strategy call:
https://calendar.app.google/e7e8NMLiRnajNFHo9`,

  "service-agreement": `Act as Mediahubink's legal-commercial operations adviser.

Generate a professional UK service agreement in British English.

IMPORTANT:
This is a practical commercial agreement template, not formal legal advice. Write it clearly and professionally so it can be reviewed by the client and, where needed, by a solicitor.

STRICT RULES:
- NEVER use em dashes
- NEVER use double hyphens
- NEVER use dash-led interruptions to connect thoughts
- Use commas, colons, semicolons, or separate sentences instead
- Use sentence case headings
- Use clear contractual formatting
- Be commercially clear
- Be concise but complete
- No hype
- No fluff
- No legal theatre

DEFAULT PROVIDER DETAILS:
Use info@mediahubink.com for this service agreement and all formal service documents.
Use the full legal provider identity exactly as written below. Do not abbreviate it.

Provider:
Mediahubink Limited
Company No. 17218602

Registered office:
7 Tileyard North
Wakefield
WF1 5FY
United Kingdom

Primary contact:
Joash F. Perera
info@mediahubink.com
07764 182758

Website:
https://www.mediahubink.com

Booking:
https://calendar.app.google/e7e8NMLiRnajNFHo9

DEFAULT TERMS:
VAT RULE:
Mediahubink Limited is not currently VAT registered.
Do not add VAT to prices.
Do not write "".
Do not write "with no VAT charged".
Use: "No VAT is charged as Mediahubink Limited is not currently VAT registered."

- Governing law: England and Wales
- Minimum commitment: 3 months unless the user states otherwise
- Payment: monthly in advance
- Setup fee: include if supplied in the user's prompt
- Monthly fee: include if supplied in the user's prompt

INCLUDE THESE SECTIONS:
1. Parties
2. Background
3. Services
4. Scope of work
5. Fees and payment terms
6. Setup fees
7. Monthly subscription terms
8. Minimum commitment
9. Client responsibilities
10. AI limitations and third-party dependencies
11. Data, privacy and regulated compliance
12. Confidentiality
13. Intellectual property, using the intellectual property rule exactly
14. Support and response expectations
15. Change requests
16. Termination
17. Limitation of liability
18. Governing law
19. Acceptance and signature block

AI CLAUSES MUST INCLUDE:
- AI outputs depend on approved source information
- Mediahubink is not liable for incorrect or incomplete client-supplied information
- Third-party services including Anthropic, WhatsApp, hosting providers, calendar tools and APIs may affect uptime
- Client remains responsible for regulated compliance, sector-specific obligations and final approval of public-facing claims
- The enquiry system does not provide legal, financial, clinical, medical, agricultural, safeguarding or regulated advice unless explicitly reviewed and approved by the client

INTELLECTUAL PROPERTY RULE:

Configured deliverables created specifically for the client may be made available in a readable export format on written request, provided all outstanding fees have been paid in full.

Underlying Mediahubink frameworks, AI logic, prompt systems, agent architecture, automation methods, templates and proprietary operating methods remain the exclusive intellectual property of Mediahubink Limited.

The client receives a licence to use the configured service during the active term of the agreement only, unless otherwise agreed in writing.

OUTPUT FORMAT:
Clean markdown
- Include both the agreement issue date and execution date near the top of the agreement
Client-ready
Professional
Boardroom-quality
Use signature fields for both parties
End with the booking link for implementation handover:
https://calendar.app.google/e7e8NMLiRnajNFHo9`,
  "invoice-generator": `Act as Mediahubink's commercial finance operator.

Generate a clean client invoice in British English.

This is for formal payment documentation.

STRICT RULES:
- NEVER use em dashes
- NEVER use double hyphens
- NEVER use dash-led interruptions to connect thoughts
- Use commas, colons, semicolons, or separate sentences instead
- Use sentence case headings
- Use clean invoice formatting
- Be clear, concise and commercially accurate
- NEVER output markdown tables
- NEVER use pipe table formatting
- Use headings and bullet lists only
- NEVER invent dates
- ALWAYS use this exact invoice issue date:
${new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})}
- If no invoice number is supplied, use: Invoice number: To be assigned
- If no due date is supplied, use: Payment due: 7 days from invoice date
- Complete the invoice fully
- Never stop mid-sentence

FORMAL PROVIDER DETAILS:
Use the full legal provider identity exactly as written below.

Mediahubink Limited
Company No. 17218602
7 Tileyard North
Wakefield
WF1 5FY
United Kingdom

info@mediahubink.com
07764 182758
https://www.mediahubink.com

VAT RULE:
Mediahubink Limited is not currently VAT registered.
Do not add VAT to prices.
Do not write "plus VAT".
Do not write "exclusive of VAT".
Use: "No VAT is charged as Mediahubink Limited is not currently VAT registered."

STRIPE PAYMENT LINK RULE:
Use Mediahubink payment rules to include the correct Stripe payment link where available.
For Fredi invoices, include the correct setup link and monthly retainer link when both are due.
If no matching Stripe link exists, state: Bank transfer or custom payment link available on request.

PAYMENT DETAILS RULE:
- Include a dedicated payment details section
- Never invent bank details
- If bank details are not supplied, write: Bank details: To be supplied securely
- Use payment reference format: [Invoice number] - [Client name]
- Ask the client to confirm payment by emailing info@mediahubink.com
- State that work begins once the signed agreement and initial payment have been received

PAYMENT TERMS:
- Payment due within 7 days unless stated otherwise
- Payment method: Bank transfer or agreed payment link
- If bank details are not supplied, write: Bank details: To be supplied securely
- Formal payment queries should go to info@mediahubink.com

INCLUDE THESE SECTIONS:
1. Invoice
2. Provider details
3. Client details
4. Invoice details
5. Services billed
6. Amount due
7. VAT status
8. Payment terms
9. Notes
10. Footer

OUTPUT FORMAT:
Clean markdown
Invoice-ready
No tables
Bullet lists only
Professional
Formal
Use info@mediahubink.com for all invoice contact details`,
  "payment-instructions": `Act as Mediahubink's commercial finance operator.

Generate clear payment instructions for a client invoice or service agreement.

STRICT RULES:
- Use British English
- Never use em dashes
- Never use double hyphens
- Never use markdown tables
- Never use pipe table formatting
- Use bullet lists only
- Be formal, concise and clear
- Use info@mediahubink.com for formal payment correspondence
- Never invent bank details
- If bank details are not supplied, write: Bank details: To be supplied securely
- If invoice number is not supplied, write: Invoice number: To be assigned
- If payment reference is not supplied, use this format: Payment reference: [Invoice number] - [Client name]
- If no due date is supplied, write: Payment due: 7 days from invoice date

FORMAL PROVIDER DETAILS:
Mediahubink Limited
Company No. 17218602
7 Tileyard North
Wakefield
WF1 5FY
United Kingdom

info@mediahubink.com
07764 182758
https://www.mediahubink.com

VAT RULE:
Mediahubink Limited is not currently VAT registered.
No VAT is charged.
Do not add VAT to prices.
Do not write "plus VAT".
Do not write "exclusive of VAT".

INCLUDE THESE SECTIONS:
1. Payment instructions
2. Invoice reference
3. Amount due
4. Payment due date
5. Payment method
6. Bank transfer details
7. Payment reference
8. Confirmation request
9. Formal contact details

PAYMENT LINK SELECTION:
Use the Stripe payment links from Mediahubink payment rules when the offer matches.
If the document mentions Fredi Capture setup, include the Fredi Capture setup link.
If the document mentions Fredi Capture monthly retainer, include the Fredi Capture monthly link.
If the document mentions Fredi Capture+ setup, include the Fredi Capture+ setup link.
If the document mentions Fredi Capture+ monthly retainer, include the Fredi Capture+ monthly link.
If the document mentions Emergency Build, select the matching Emergency Build link.
Never invent links.

OUTPUT FORMAT:
Clean markdown
No tables
Client-ready
Formal
Payment-ready`,
};

export default function HomePage() {
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionType | null>(null);

  const [voicePrompt, setVoicePrompt] = useState("");
  const [voiceReply, setVoiceReply] = useState("");
  const [voiceSpokenReply, setVoiceSpokenReply] = useState("");
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceIsListening, setVoiceIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("natural");
  const [voiceStatus, setVoiceStatus] = useState("Alfred Natural ready.");
  const [voiceIsSpeaking, setVoiceIsSpeaking] = useState(false);
  const [voiceInteractions, setVoiceInteractions] = useState<Interaction[]>([]);
  const [voiceContextMessage, setVoiceContextMessage] = useState(
    "Loading recent CRM interaction history..."
  );
  const [voiceClock, setVoiceClock] = useState(() => getLondonClockParts());

  const voiceRecognitionRef = useRef<SpeechRecognitionType | null>(null);
  const voiceTranscriptRef = useRef("");
  const voiceHoldActiveRef = useRef(false);
  const voiceSubmittedRef = useRef(false);
  const voiceLastTouchAtRef = useRef(0);
  const naturalAudioRef = useRef<HTMLAudioElement | null>(null);
  const naturalAudioUrlRef = useRef("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const naturalSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loadingThoughts, setLoadingThoughts] = useState(false);
  const [mode, setMode] = useState<Mode>("general");

  const [demos, setDemos] = useState<Demo[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingBusinessData, setLoadingBusinessData] = useState(false);
  const [businessMessage, setBusinessMessage] = useState("");

  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [loadingKnowledge, setLoadingKnowledge] = useState(false);
  const [knowledgeMessage, setKnowledgeMessage] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadMessage, setLeadMessage] = useState("");
  const [savingLead, setSavingLead] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [convertingLeadId, setConvertingLeadId] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectMessage, setProjectMessage] = useState("");

  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadIndustry, setLeadIndustry] = useState("");
  const [leadInterest, setLeadInterest] = useState("");
  const [leadSolution, setLeadSolution] = useState("Not decided");
  const [leadStage, setLeadStage] = useState("new");
  const [leadNotes, setLeadNotes] = useState("");
  const [leadMonthlyValue, setLeadMonthlyValue] = useState("");
  const [leadNextAction, setLeadNextAction] = useState("");
  const [leadNextActionDate, setLeadNextActionDate] = useState("");
  const [leadScore, setLeadScore] = useState("");
  const [leadSource, setLeadSource] = useState("LinkedIn");
  const [leadRegion, setLeadRegion] = useState("United Kingdom");
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);

  async function copyText(text: string, label: string) {
    if (!text.trim()) {
      setCopyMessage(`Nothing to copy for ${label}.`);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} copied.`);
    } catch {
      setCopyMessage(`Could not copy ${label}.`);
    }
  }

  function clearChat() {
    setPrompt("");
    setReply("");
    setSaveMessage("");
    setCopyMessage("");
  }

  function printProposal() {
    if (!reply.trim()) {
      setCopyMessage("Nothing to export yet.");
      return;
    }

    window.print();
  }

  function openProposalPage() {
    if (!reply.trim()) {
      setCopyMessage("Nothing to open as a proposal yet.");
      return;
    }

    localStorage.setItem("alfredProposal", reply);
    sessionStorage.setItem("alfredProposal", reply);
    window.open("/proposal", "_blank");
  }

  function startSpeech() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setCopyMessage("Speech input is not supported in this browser.");
      return;
    }

    const speech = new SpeechRecognition();
    speech.continuous = false;
    speech.interimResults = false;
    speech.lang = "en-GB";

    speech.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setPrompt((current) =>
        current.trim() ? `${current.trim()} ${transcript}` : transcript
      );
    };

    speech.onerror = () => {
      setIsListening(false);
      setCopyMessage("Speech input stopped or failed.");
    };

    speech.onend = () => {
      setIsListening(false);
    };

    setRecognition(speech);
    setIsListening(true);
    speech.start();
  }

  function stopSpeech() {
    recognition?.stop();
    setIsListening(false);
  }

  function cleanForSpeech(text: string) {
    return text
      .replace(/[#*_`>]/g, "")
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, ". ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function buildFallbackSpokenReply(text: string) {
    const cleaned = cleanForSpeech(text);
    if (!cleaned) return "";

    const withoutDraft = cleaned
      .split(/(?:subject:|email draft:|draft email:)/i)[0]
      .trim();

    const source = withoutDraft || cleaned;
    const sentences =
      source.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [source];

    let spoken = "";

    for (const sentence of sentences) {
      const candidate = `${spoken} ${sentence}`
        .replace(/\s{2,}/g, " ")
        .trim();

      if (candidate.length > 420 && spoken) break;
      spoken = candidate;

      if (spoken.length >= 180 || spoken.split(/\s+/).length >= 48) {
        break;
      }
    }

    return (spoken || source.slice(0, 420)).trim();
  }

  function parseVoiceReply(raw: string) {
    const voiceMatch = raw.match(
      /\[\[VOICE\]\]([\s\S]*?)\[\[\/VOICE\]\]/i
    );
    const answerMatch = raw.match(
      /\[\[ANSWER\]\]([\s\S]*?)\[\[\/ANSWER\]\]/i
    );

    const written =
      answerMatch?.[1]?.trim() ||
      raw
        .replace(/\[\[VOICE\]\][\s\S]*?\[\[\/VOICE\]\]/gi, "")
        .replace(/\[\[\/?ANSWER\]\]/gi, "")
        .trim();

    return {
      written: written || "I could not produce a response.",
      spoken:
        voiceMatch?.[1]?.trim() ||
        buildFallbackSpokenReply(written),
    };
  }

  function getVoiceIntro() {
    if (typeof window === "undefined") {
      return {
        text: "",
        greetingPending: false,
        bedtimePending: false,
        bedtimeKey: "",
      };
    }

    const { hour, minute, dateISO } = getLondonClockParts();

    const greetingPending =
      window.sessionStorage.getItem("alfred_greeting_spoken") !== "yes";

    const bedtimeMode = getBedtimeMode(hour, minute);
    const bedtimeKey = `alfred_bedtime_${dateISO}`;
    const bedtimePending =
      bedtimeMode !== "normal" &&
      window.sessionStorage.getItem(bedtimeKey) !== "yes";

    const parts: string[] = [];

    if (greetingPending) {
      parts.push(getGreetingText(hour));
    }

    if (bedtimePending) {
      parts.push(getBedtimeReminder(bedtimeMode));
    }

    return {
      text: parts.join(" "),
      greetingPending,
      bedtimePending,
      bedtimeKey,
    };
  }

  function markVoiceIntroSpoken(
    intro: ReturnType<typeof getVoiceIntro>
  ) {
    if (typeof window === "undefined") return;

    if (intro.greetingPending) {
      window.sessionStorage.setItem("alfred_greeting_spoken", "yes");
    }

    if (intro.bedtimePending && intro.bedtimeKey) {
      window.sessionStorage.setItem(intro.bedtimeKey, "yes");
    }
  }

  function buildSpokenText(
    text: string,
    intro: ReturnType<typeof getVoiceIntro>
  ) {
    const body = cleanForSpeech(text);
    return intro.text
      ? cleanForSpeech(`${intro.text} ${body}`)
      : body;
  }

  function releaseNaturalAudio() {
    if (naturalSourceRef.current) {
      try {
        naturalSourceRef.current.stop();
      } catch {
        // Already stopped.
      }
      naturalSourceRef.current = null;
    }

    if (naturalAudioRef.current) {
      naturalAudioRef.current.pause();
      naturalAudioRef.current = null;
    }

    if (naturalAudioUrlRef.current) {
      URL.revokeObjectURL(naturalAudioUrlRef.current);
      naturalAudioUrlRef.current = "";
    }
  }

  async function unlockNaturalVoice() {
    if (typeof window === "undefined" || voiceMode !== "natural") return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
    } catch {
      // HTML audio and device voice remain available as fallbacks.
    }
  }

  function deviceSpeak(
    text: string,
    introOverride?: ReturnType<typeof getVoiceIntro>
  ) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceStatus("Device voice is not supported by this browser.");
      return;
    }

    const intro = introOverride || getVoiceIntro();
    const spokenText = buildSpokenText(text, intro);

    if (!spokenText) return;

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = "en-GB";
    utterance.rate = 1.05;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const britishVoice =
      voices.find((voice) => voice.lang.toLowerCase() === "en-gb") ||
      voices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en")
      );

    if (britishVoice) utterance.voice = britishVoice;

    utterance.onstart = () => {
      markVoiceIntroSpoken(intro);
      setVoiceIsSpeaking(true);
      setVoiceStatus("Alfred is speaking with the device voice...");
    };

    utterance.onend = () => {
      setVoiceIsSpeaking(false);
      setVoiceStatus(
        voiceMode === "natural"
          ? "Alfred Natural ready."
          : "Device voice ready."
      );
    };

    utterance.onerror = () => {
      setVoiceIsSpeaking(false);
      setVoiceStatus("Playback was blocked. Tap Hear Alfred.");
    };

    window.speechSynthesis.speak(utterance);
  }

  async function naturalSpeak(text: string) {
    const intro = getVoiceIntro();
    const spokenText = buildSpokenText(text, intro);

    if (!spokenText) return;

    releaseNaturalAudio();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setVoiceStatus("Preparing Alfred Natural...");

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: spokenText }),
      });

      if (!response.ok) {
        throw new Error("Natural voice generation failed.");
      }

      const blob = await response.blob();
      const context = audioContextRef.current;

      if (context && context.state === "running") {
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(
          arrayBuffer.slice(0)
        );
        const source = context.createBufferSource();

        source.buffer = audioBuffer;
        source.connect(context.destination);
        naturalSourceRef.current = source;

        source.onended = () => {
          naturalSourceRef.current = null;
          setVoiceIsSpeaking(false);
          setVoiceStatus("Alfred Natural ready.");
        };

        markVoiceIntroSpoken(intro);
        setVoiceIsSpeaking(true);
        setVoiceStatus("Alfred Natural is speaking...");
        source.start(0);
        return;
      }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.setAttribute("playsinline", "true");

      naturalAudioRef.current = audio;
      naturalAudioUrlRef.current = url;

      audio.onplay = () => {
        markVoiceIntroSpoken(intro);
        setVoiceIsSpeaking(true);
        setVoiceStatus("Alfred Natural is speaking...");
      };

      audio.onended = () => {
        setVoiceIsSpeaking(false);
        setVoiceStatus("Alfred Natural ready.");
        releaseNaturalAudio();
      };

      audio.onerror = () => {
        setVoiceIsSpeaking(false);
        releaseNaturalAudio();
        setVoiceStatus(
          "Natural voice playback failed. Using device voice."
        );
        deviceSpeak(text, intro);
      };

      try {
        await audio.play();
      } catch {
        setVoiceIsSpeaking(false);
        setVoiceStatus(
          "iPhone blocked automatic playback. Tap Hear Alfred once."
        );
      }
    } catch {
      setVoiceStatus(
        "Alfred Natural is unavailable. Using device voice."
      );
      deviceSpeak(text, intro);
    }
  }

  async function speakVoice(text: string) {
    if (voiceMode === "silent") {
      setVoiceStatus("Silent mode is on.");
      return;
    }

    if (voiceMode === "device") {
      deviceSpeak(text);
      return;
    }

    await naturalSpeak(text);
  }

  function stopVoiceSpeaking() {
    releaseNaturalAudio();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setVoiceIsSpeaking(false);
    setVoiceStatus(
      voiceMode === "natural"
        ? "Alfred Natural ready."
        : voiceMode === "device"
          ? "Device voice ready."
          : "Silent mode is on."
    );
  }

  function chooseVoiceMode(nextMode: VoiceMode) {
    stopVoiceSpeaking();
    setVoiceMode(nextMode);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("alfred_home_voice_mode", nextMode);
    }

    if (nextMode === "silent") {
      setVoiceStatus("Silent mode is on.");
      return;
    }

    if (nextMode === "natural") {
      void unlockNaturalVoice();
      setVoiceStatus("Alfred Natural ready.");
      return;
    }

    setVoiceStatus("Device voice ready.");
  }

  async function hearVoiceReply() {
    if (!voiceSpokenReply && !voiceReply) {
      setVoiceStatus("Alfred has not answered yet.");
      return;
    }

    await unlockNaturalVoice();
    await speakVoice(voiceSpokenReply || voiceReply);
  }

  function voiceInteractionContextForLead(leadId: string) {
    return voiceInteractions
      .filter((interaction) => interaction.lead_id === leadId)
      .slice(0, 3);
  }

  function buildLeanVoiceContext(question: string) {
    const today = getLondonClockParts().dateISO;
    const q = question.toLowerCase();

    const commonWords = new Set([
      "limited",
      "ltd",
      "group",
      "company",
      "services",
      "service",
      "the",
      "and",
    ]);

    const isNamedInQuestion = (lead: Lead) => {
      const terms = [lead.company, lead.name]
        .filter(Boolean)
        .flatMap((value) =>
          String(value)
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter(
              (part) =>
                part.length >= 4 &&
                !commonWords.has(part)
            )
        );

      return terms.some((term) => q.includes(term));
    };

    const priorityScore = (lead: Lead) => {
      let score = 0;
      const due = lead.next_action_date || lead.follow_up_date;

      if (isNamedInQuestion(lead)) score += 1000;
      if (due && due <= today) score += 300;

      const priority = (lead.priority || "").toLowerCase();
      if (priority === "high") score += 150;
      if (priority === "medium") score += 70;

      score += Number(lead.lead_score ?? lead.score ?? 0) * 3;
      score += Math.min(
        Number(lead.monthly_value ?? lead.estimated_value ?? 0) / 20,
        100
      );

      return score;
    };

    const selectedLeads = [...leads]
      .sort((a, b) => priorityScore(b) - priorityScore(a))
      .slice(0, 12);

    const leadContext =
      selectedLeads.length > 0
        ? selectedLeads
            .map((lead) => {
              const recent = voiceInteractionContextForLead(lead.id);
              const history =
                recent.length > 0
                  ? recent
                      .map(
                        (interaction) =>
                          `${interaction.occurred_at || interaction.created_at || "Unknown date"} | ${interaction.channel || "other"} | ${interaction.outcome || "No outcome"} | ${interaction.summary || "No summary"} | Next: ${interaction.next_action || "none"} | Due: ${interaction.next_action_date || "none"}`
                      )
                      .join("\n")
                  : "No loaded interaction history.";

              return `${lead.company || lead.name || "Unnamed lead"} | Contact: ${lead.name || "not added"} | Stage: ${lead.stage || "new"} | Priority: ${lead.priority || "not set"} | Score: ${lead.lead_score ?? lead.score ?? 0} | Value: £${lead.monthly_value ?? lead.estimated_value ?? 0} | Next: ${lead.next_action || "none"} | Due: ${lead.next_action_date || lead.follow_up_date || "none"}\nRecent interactions:\n${history}`;
            })
            .join("\n\n")
        : "No CRM leads loaded.";

    const projectContext =
      projects.length > 0
        ? projects
            .slice(0, 8)
            .map(
              (project) =>
                `${project.name} | ${project.category || "no category"} | ${project.status || "no status"}`
            )
            .join("\n")
        : "No projects loaded.";

    const offerContext =
      offers.length > 0
        ? offers
            .slice(0, 6)
            .map(
              (offer) =>
                `${offer.name} | ${offer.price || "price not set"}`
            )
            .join("\n")
        : "No offers loaded.";

    const demoContext =
      demos.length > 0
        ? demos
            .slice(0, 8)
            .map((demo) => `${demo.vertical}: ${demo.demo_url}`)
            .join("\n")
        : "No demos loaded.";

    return `
ALFRED MISSION CONTROL VOICE CONTEXT

Current UK time:
${new Date().toLocaleString("en-GB", {
  timeZone: "Europe/London",
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})}

ROLE

You are Alfred, Mediahubink's Sales, Strategy and Operating Chief of Staff.

United Kingdom is the core commercial market.
Namibia is a separate active AI market-entry track.

LIVE PRIORITY CRM CONTEXT

${leadContext}

RECENT PROJECT CONTEXT

${projectContext}

CURRENT OFFERS

${offerContext}

SELECTED PROOF ASSETS

${demoContext}

OPERATING RULES

- British English only.
- No em dashes.
- Do not invent activity, meetings, replies or CRM history.
- Prefer advancing live conversations and overdue follow-ups before creating new work.
- Give a clear priority when asked what to do next.
- If detailed CRM interaction history is not loaded, say so rather than inventing it.
- For deep CRM changes or Command Mode, direct Joash to the full Alfred Command Centre at /alfred.
- ${getBedtimePromptRule()}
`;
  }

  async function askAlfredVoice(questionOverride?: string) {
    const question = (questionOverride ?? voicePrompt).trim();
    if (!question || voiceLoading) return;

    void unlockNaturalVoice();
    stopVoiceSpeaking();

    setVoicePrompt(question);
    setVoiceLoading(true);
    setVoiceReply("");
    setVoiceSpokenReply("");
    setVoiceStatus("Alfred is thinking...");

    const voiceRequest = `
${buildLeanVoiceContext(question)}

JOASH'S REQUEST

${question}

RESPONSE FORMAT

Return exactly:

[[VOICE]]
A short natural spoken reply, normally 1 to 3 sentences and no more than about 55 words.
[[/VOICE]]

[[ANSWER]]
A useful written answer in Markdown. Keep it concise unless more detail is genuinely needed.
[[/ANSWER]]

VOICE RULES

- Lead with the answer or decision.
- Include the single next action where one exists.
- Do not read long lists, URLs, email drafts or detailed evidence aloud.
- Do not include Good morning, Good afternoon, Good evening or Good night. The voice layer handles the personal greeting.
- If the bedtime guardrail is active, the spoken reply must prioritise stopping work.
`;

    try {
      const response = await fetch("/api/alfred", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: voiceRequest }),
      });

      const data = await response.json();
      const raw =
        data.reply ||
        data.error ||
        "I could not produce a response.";

      const parsed = parseVoiceReply(raw);

      setVoiceReply(parsed.written);
      setVoiceSpokenReply(parsed.spoken);

      if (response.ok && data.reply && voiceMode !== "silent") {
        setTimeout(() => {
          void speakVoice(parsed.spoken);
        }, 100);
      } else {
        setVoiceStatus(
          voiceMode === "silent"
            ? "Silent mode is on."
            : "Alfred Natural ready."
        );
      }
    } catch {
      const message =
        "Something went wrong while speaking to Alfred.";
      setVoiceReply(message);
      setVoiceSpokenReply(message);
      setVoiceStatus("Voice request failed.");
    } finally {
      setVoiceLoading(false);
    }
  }

  function submitHeldVoiceSpeech() {
    if (voiceSubmittedRef.current) return;

    const transcript = voiceTranscriptRef.current
      .replace(/\s{2,}/g, " ")
      .trim();

    if (!transcript) {
      setVoiceStatus(
        "I didn't catch that. Press and hold while you speak."
      );
      return;
    }

    voiceSubmittedRef.current = true;
    setVoicePrompt(transcript);
    void askAlfredVoice(transcript);
  }

  function startVoiceSpeech() {
    if (voiceLoading || voiceIsListening) return;

    void unlockNaturalVoice();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus("Speech input is not supported in this browser.");
      return;
    }

    stopVoiceSpeaking();

    voiceTranscriptRef.current = "";
    voiceSubmittedRef.current = false;
    voiceHoldActiveRef.current = true;

    const speech = new SpeechRecognition();
    speech.continuous = true;
    speech.interimResults = false;
    speech.lang = "en-GB";

    speech.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += `${event.results[i][0].transcript} `;
      }

      const cleaned = transcript.replace(/\s{2,}/g, " ").trim();
      voiceTranscriptRef.current = cleaned;

      if (cleaned) setVoicePrompt(cleaned);
    };

    speech.onerror = () => {
      setVoiceIsListening(false);
      voiceRecognitionRef.current = null;

      if (!voiceHoldActiveRef.current) {
        submitHeldVoiceSpeech();
      }
    };

    speech.onend = () => {
      setVoiceIsListening(false);
      voiceRecognitionRef.current = null;

      if (!voiceHoldActiveRef.current) {
        submitHeldVoiceSpeech();
      }
    };

    voiceRecognitionRef.current = speech;
    setVoiceIsListening(true);
    setVoiceStatus("Listening. Keep holding, then release to send.");

    try {
      speech.start();
    } catch {
      voiceHoldActiveRef.current = false;
      setVoiceIsListening(false);
      voiceRecognitionRef.current = null;
      setVoiceStatus(
        "The microphone could not start. Try pressing and holding again."
      );
    }
  }

  function stopVoiceSpeech() {
    voiceHoldActiveRef.current = false;

    const active = voiceRecognitionRef.current;

    if (active) {
      try {
        active.stop();
      } catch {
        submitHeldVoiceSpeech();
      }
    } else {
      setTimeout(() => submitHeldVoiceSpeech(), 50);
    }

    setVoiceIsListening(false);
    setVoiceStatus("Sending that to Alfred...");
  }

  function cancelVoiceSpeech() {
    voiceHoldActiveRef.current = false;
    voiceSubmittedRef.current = true;

    if (voiceRecognitionRef.current) {
      try {
        voiceRecognitionRef.current.stop();
      } catch {
        // Nothing else to do.
      }
    }

    voiceRecognitionRef.current = null;
    setVoiceIsListening(false);
    voiceTranscriptRef.current = "";
    setVoiceStatus("Voice input cancelled.");
  }

  function handleVoiceTouchStart(
    event: React.TouchEvent<HTMLButtonElement>
  ) {
    if (voiceLoading) return;

    event.preventDefault();
    voiceLastTouchAtRef.current = Date.now();

    startVoiceSpeech();
  }

  function handleVoiceTouchEnd(
    event: React.TouchEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    if (voiceHoldActiveRef.current) {
      stopVoiceSpeech();
    }
  }

  function handleVoiceTouchCancel(
    event: React.TouchEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    cancelVoiceSpeech();
  }

  function handleVoiceMouseDown(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (
      voiceLoading ||
      Date.now() -
        voiceLastTouchAtRef.current <
        800
    ) {
      return;
    }

    event.preventDefault();
    startVoiceSpeech();
  }

  function handleVoiceMouseUp(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (
      Date.now() -
        voiceLastTouchAtRef.current <
        800
    ) {
      return;
    }

    event.preventDefault();

    if (voiceHoldActiveRef.current) {
      stopVoiceSpeech();
    }
  }

  function handleVoiceMouseLeave(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (
      Date.now() -
        voiceLastTouchAtRef.current <
        800
    ) {
      return;
    }

    if (voiceHoldActiveRef.current) {
      event.preventDefault();
      stopVoiceSpeech();
    }
  }

  async function loadVoiceInteractions(loadedLeads: Lead[]) {
    if (loadedLeads.length === 0) {
      setVoiceInteractions([]);
      setVoiceContextMessage("No CRM interactions loaded.");
      return;
    }

    setVoiceContextMessage("Loading recent CRM interaction history...");

    try {
      const results = await Promise.all(
        loadedLeads.slice(0, 50).map(async (lead) => {
          try {
            const response = await fetch(
              `/api/leads/${lead.id}/interactions`,
              { cache: "no-store" }
            );

            if (!response.ok) return [];

            const data = await response.json();
            return Array.isArray(data?.interactions)
              ? data.interactions
              : [];
          } catch {
            return [];
          }
        })
      );

      const combined = results.flat() as Interaction[];

      combined.sort((a, b) => {
        const aTime = new Date(
          a.occurred_at || a.created_at || 0
        ).getTime();
        const bTime = new Date(
          b.occurred_at || b.created_at || 0
        ).getTime();
        return bTime - aTime;
      });

      setVoiceInteractions(combined);
      setVoiceContextMessage(
        `${combined.length} recent CRM interactions available to Alfred Voice.`
      );
    } catch {
      setVoiceInteractions([]);
      setVoiceContextMessage(
        "CRM interaction history could not be loaded."
      );
    }
  }

  async function askAlfred(selectedMode: Mode = mode) {
    if (!prompt.trim()) return;

    setLoading(true);
    setReply("");
    setSaveMessage("");
    setCopyMessage("");

    const demoContext =
      demos.length > 0
        ? demos.map((d) => `${d.vertical}: ${d.demo_url} | CTA: ${d.cta || ""}`).join("\n")
        : "Context still loading...";

    const offerContext =
      offers.length > 0
        ? offers.map((o) => `${o.name}: ${o.price || ""} | ${o.description || ""}`).join("\n")
        : "Context still loading...";

    const knowledgeContext =
      knowledge.length > 0
        ? knowledge.map((k) => `${k.category} - ${k.title}: ${k.content}`).join("\n")
        : "Context still loading...";

    const leadContext =
      leads.length > 0
        ? leads
            .map(
              (l) =>
                `${l.company || l.name || "Unnamed lead"} |
${l.industry || "No industry"} |
Interest: ${l.interest || "None"} |
Solution: ${l.solution || "Not decided"} |
Stage: ${l.stage || "new"} |
Monthly Value: £${l.monthly_value ?? l.estimated_value ?? 0} |
Lead Score: ${l.lead_score ?? l.score ?? 0} |
Source: ${l.source || "none"} |
Region: ${l.region || "none"} |
Priority: ${l.priority || "medium"} |
Next: ${l.next_action || "none"} |
Next Action Date: ${l.next_action_date || l.follow_up_date || "none"} |
Notes: ${l.notes || "none"}`
            )
            .join("\n")
        : "No leads loaded.";

    const projectContext =
      projects.length > 0
        ? projects
            .map(
              (p) =>
                `${p.name}: ${p.url || ""} | ${
                  p.category || ""
                } | Audience: ${p.audience || ""} | ${p.description || ""}`
            )
            .join("\n")
        : "Context still loading...";

    const fullPrompt = `
Mode:
${selectedMode}

Instruction:
${modePrompts[selectedMode]}

Mediahubink positioning:
${mediahubinkPositioning}

Product language rule:
Keep product names unchanged. Prefer: digital enquiry assistant, enquiry capture system, qualification layer, response workflow, automated voice response handling, after-hours enquiry capture and enquiry routing system. Avoid default AI product terminology unless technically necessary.

Permanent Alfred Knowledge:
${knowledgeContext}

Current Mediahubink proof assets and demo links:
${demoContext}

Current Mediahubink enquiry system offers:
${offerContext}

Current CRM-lite leads:
${leadContext}

Current Projects and Demos:
${projectContext}

User thought/topic:
${prompt}
`;

    try {
      const response = await fetch("/api/alfred", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      setReply(data.reply || data.error || "No response from Alfred.");
    } catch {
      setReply("Something went wrong. Check the API route or Vercel logs.");
    } finally {
      setLoading(false);
    }
  }


  async function generateAgreementFromProposal() {
    if (!reply.trim()) {
      setCopyMessage("Generate a proposal first, then create the agreement.");
      return;
    }

    setMode("service-agreement");
    setLoading(true);
    setSaveMessage("");
    setCopyMessage("");
    setReply("");

    const agreementPrompt = `
Create a service agreement from the proposal below.

Use the proposal to extract:
- client name
- offer name
- service scope
- setup fee
- monthly fee
- minimum commitment
- implementation expectations
- AI limitations
- support terms
- client responsibilities

Use service-agreement mode rules exactly.

Proposal content:
${reply}
`;

    const demoContext =
      demos.length > 0
        ? demos.map((d) => `${d.vertical}: ${d.demo_url} | CTA: ${d.cta || ""}`).join("\n")
        : "Context still loading...";

    const offerContext =
      offers.length > 0
        ? offers.map((o) => `${o.name}: ${o.price || ""} | ${o.description || ""}`).join("\n")
        : "Context still loading...";

    const knowledgeContext =
      knowledge.length > 0
        ? knowledge.map((k) => `${k.category} - ${k.title}: ${k.content}`).join("\n")
        : "Context still loading...";

    const leadContext =
      leads.length > 0
        ? leads
            .map(
              (l) =>
                `${l.company || l.name || "Unnamed lead"} |
${l.industry || "No industry"} |
Interest: ${l.interest || "None"} |
Solution: ${l.solution || "Not decided"} |
Stage: ${l.stage || "new"} |
Monthly Value: £${l.monthly_value ?? l.estimated_value ?? 0} |
Lead Score: ${l.lead_score ?? l.score ?? 0} |
Source: ${l.source || "none"} |
Region: ${l.region || "none"} |
Priority: ${l.priority || "medium"} |
Next: ${l.next_action || "none"} |
Next Action Date: ${l.next_action_date || l.follow_up_date || "none"} |
Notes: ${l.notes || "none"}`
            )
            .join("\n")
        : "No leads loaded.";

    const projectContext =
      projects.length > 0
        ? projects
            .map(
              (p) =>
                `${p.name}: ${p.url || ""} | ${
                  p.category || ""
                } | Audience: ${p.audience || ""} | ${p.description || ""}`
            )
            .join("\n")
        : "Context still loading...";

    const fullPrompt = `
Mode:
service-agreement

Instruction:
${modePrompts["service-agreement"]}

Mediahubink positioning:
${mediahubinkPositioning}

Mediahubink payment rules:
${mediahubinkPaymentRules}

Commercial accuracy rules:
${commercialAccuracyRules}

Permanent Alfred Knowledge:
${knowledgeContext}

Current Mediahubink proof assets and demo links:
${demoContext}

Current Mediahubink enquiry system offers:
${offerContext}

Current CRM-lite leads:
${leadContext}

Current Projects and Demos:
${projectContext}

User thought/topic:
${agreementPrompt}
`;

    try {
      const response = await fetch("/api/alfred", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      setReply(data.reply || data.error || "No response from Alfred.");
      setPrompt("Generate service agreement from latest proposal.");
    } catch {
      setReply("Something went wrong. Check the API route or Vercel logs.");
    } finally {
      setLoading(false);
    }
  }



  async function generateInvoiceFromAgreement() {
    if (!reply.trim()) {
      setCopyMessage("Generate a service agreement first, then create the invoice.");
      return;
    }

    setMode("invoice-generator");
    setLoading(true);
    setSaveMessage("");
    setCopyMessage("");
    setReply("");

    const invoicePrompt = `
Create an invoice from the agreement below.

Use the agreement to extract:
- client name
- service name
- setup fee
- monthly fee
- amount due today
- payment terms
- invoice contact details
- VAT status
- formal provider details

If the agreement includes both a setup fee and first monthly subscription, calculate the total due today.
If the agreement does not explicitly say otherwise, invoice the setup fee plus first monthly subscription.
Use invoice-generator mode rules exactly.

Agreement content:
${reply}
`;

    const demoContext =
      demos.length > 0
        ? demos.map((d) => `${d.vertical}: ${d.demo_url} | CTA: ${d.cta || ""}`).join("\n")
        : "Context still loading...";

    const offerContext =
      offers.length > 0
        ? offers.map((o) => `${o.name}: ${o.price || ""} | ${o.description || ""}`).join("\n")
        : "Context still loading...";

    const knowledgeContext =
      knowledge.length > 0
        ? knowledge.map((k) => `${k.category} - ${k.title}: ${k.content}`).join("\n")
        : "Context still loading...";

    const leadContext =
      leads.length > 0
        ? leads
            .map(
              (l) =>
                `${l.company || l.name || "Unnamed lead"} |
${l.industry || "No industry"} |
Interest: ${l.interest || "None"} |
Solution: ${l.solution || "Not decided"} |
Stage: ${l.stage || "new"} |
Monthly Value: £${l.monthly_value ?? l.estimated_value ?? 0} |
Lead Score: ${l.lead_score ?? l.score ?? 0} |
Source: ${l.source || "none"} |
Region: ${l.region || "none"} |
Priority: ${l.priority || "medium"} |
Next: ${l.next_action || "none"} |
Next Action Date: ${l.next_action_date || l.follow_up_date || "none"} |
Notes: ${l.notes || "none"}`
            )
            .join("\n")
        : "No leads loaded.";

    const projectContext =
      projects.length > 0
        ? projects
            .map(
              (p) =>
                `${p.name}: ${p.url || ""} | ${
                  p.category || ""
                } | Audience: ${p.audience || ""} | ${p.description || ""}`
            )
            .join("\n")
        : "Context still loading...";

    const fullPrompt = `
Mode:
invoice-generator

Instruction:
${modePrompts["invoice-generator"]}

Mediahubink positioning:
${mediahubinkPositioning}

Mediahubink payment rules:
${mediahubinkPaymentRules}

Permanent Alfred Knowledge:
${knowledgeContext}

Current Mediahubink proof assets and demo links:
${demoContext}

Current Mediahubink enquiry system offers:
${offerContext}

Current CRM-lite leads:
${leadContext}

Current Projects and Demos:
${projectContext}

User thought/topic:
${invoicePrompt}
`;

    try {
      const response = await fetch("/api/alfred", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      setReply(data.reply || data.error || "No response from Alfred.");
      setPrompt("Generate invoice from latest service agreement.");
    } catch {
      setReply("Something went wrong. Check the API route or Vercel logs.");
    } finally {
      setLoading(false);
    }
  }



  async function generatePaymentInstructions() {
    if (!reply.trim()) {
      setCopyMessage("Generate an invoice or agreement first, then create payment instructions.");
      return;
    }

    setMode("payment-instructions");
    setLoading(true);
    setSaveMessage("");
    setCopyMessage("");
    setReply("");

    const paymentPrompt = `
Create payment instructions from the document below.

Use the document to extract:
- client name
- invoice number if present
- service name
- setup fee
- monthly fee
- total amount due
- payment due date
- VAT status

If bank details are not supplied, do not invent them. Write: Bank details: To be supplied securely.
Use the payment reference format: [Invoice number] - [Client name].
Use payment-instructions mode rules exactly.

Document content:
${reply}
`;

    const demoContext =
      demos.length > 0
        ? demos.map((d) => `${d.vertical}: ${d.demo_url} | CTA: ${d.cta || ""}`).join("\n")
        : "Context still loading...";

    const offerContext =
      offers.length > 0
        ? offers.map((o) => `${o.name}: ${o.price || ""} | ${o.description || ""}`).join("\n")
        : "Context still loading...";

    const knowledgeContext =
      knowledge.length > 0
        ? knowledge.map((k) => `${k.category} - ${k.title}: ${k.content}`).join("\n")
        : "Context still loading...";

    const leadContext =
      leads.length > 0
        ? leads
            .map(
              (l) =>
                `${l.company || l.name || "Unnamed lead"} |
${l.industry || "No industry"} |
Interest: ${l.interest || "None"} |
Solution: ${l.solution || "Not decided"} |
Stage: ${l.stage || "new"} |
Monthly Value: £${l.monthly_value ?? l.estimated_value ?? 0} |
Lead Score: ${l.lead_score ?? l.score ?? 0} |
Source: ${l.source || "none"} |
Region: ${l.region || "none"} |
Priority: ${l.priority || "medium"} |
Next: ${l.next_action || "none"} |
Next Action Date: ${l.next_action_date || l.follow_up_date || "none"} |
Notes: ${l.notes || "none"}`
            )
            .join("\n")
        : "No leads loaded.";

    const projectContext =
      projects.length > 0
        ? projects
            .map(
              (p) =>
                `${p.name}: ${p.url || ""} | ${
                  p.category || ""
                } | Audience: ${p.audience || ""} | ${p.description || ""}`
            )
            .join("\n")
        : "Context still loading...";

    const fullPrompt = `
Mode:
payment-instructions

Instruction:
${modePrompts["payment-instructions"]}

Mediahubink positioning:
${mediahubinkPositioning}

Mediahubink payment rules:
${mediahubinkPaymentRules}

Permanent Alfred Knowledge:
${knowledgeContext}

Current Mediahubink proof assets and demo links:
${demoContext}

Current Mediahubink enquiry system offers:
${offerContext}

Current CRM-lite leads:
${leadContext}

Current Projects and Demos:
${projectContext}

User thought/topic:
${paymentPrompt}
`;

    try {
      const response = await fetch("/api/alfred", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await response.json();
      setReply(data.reply || data.error || "No response from Alfred.");
      setPrompt("Generate payment instructions from latest document.");
    } catch {
      setReply("Something went wrong. Check the API route or Vercel logs.");
    } finally {
      setLoading(false);
    }
  }


  async function saveThought() {
    if (!prompt.trim()) return;

    setSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/thoughts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: prompt,
          category: "Thought Vault",
          title: prompt.slice(0, 80),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSaveMessage(data.error || "Could not save thought.");
        return;
      }

      setSaveMessage("Saved to Alfred’s memory.");
      loadThoughts();
    } catch {
      setSaveMessage("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function loadThoughts() {
    setLoadingThoughts(true);

    try {
      const response = await fetch("/api/thoughts/list");
      const data = await response.json();

      if (!response.ok) {
        setSaveMessage(data.error || "Could not load memory.");
        return;
      }

      setThoughts(data.thoughts || []);
    } catch {
      setSaveMessage("Something went wrong loading memory.");
    } finally {
      setLoadingThoughts(false);
    }
  }

  async function loadBusinessData() {
    setLoadingBusinessData(true);
    setBusinessMessage("");

    try {
      const [demoResponse, offerResponse] = await Promise.all([
        fetch("/api/demos/list"),
        fetch("/api/offers/list"),
      ]);

      const demoData = await demoResponse.json();
      const offerData = await offerResponse.json();

      if (!demoResponse.ok) {
        setBusinessMessage(demoData.error || "Could not load demos.");
        return;
      }

      if (!offerResponse.ok) {
        setBusinessMessage(offerData.error || "Could not load offers.");
        return;
      }

      setDemos(demoData.demos || []);
      setOffers(offerData.offers || []);
      setBusinessMessage("Demo links and offers loaded.");
    } catch {
      setBusinessMessage("Something went wrong loading business data.");
    } finally {
      setLoadingBusinessData(false);
    }
  }

  async function loadKnowledge() {
    setLoadingKnowledge(true);
    setKnowledgeMessage("");

    try {
      const response = await fetch("/api/knowledge/list");
      const data = await response.json();

      if (!response.ok) {
        setKnowledgeMessage(data.error || "Could not load knowledge.");
        return;
      }

      setKnowledge(data.knowledge || []);
      setKnowledgeMessage("Knowledge Vault loaded.");
    } catch {
      setKnowledgeMessage("Something went wrong loading knowledge.");
    } finally {
      setLoadingKnowledge(false);
    }
  }

  async function loadLeads() {
    setLoadingLeads(true);
    setLeadMessage("");

    try {
      const response = await fetch("/api/leads/list");
      const data = await response.json();

      if (!response.ok) {
        setLeadMessage(data.error || "Could not load leads.");
        return;
      }

      const loadedLeads = data.leads || [];
      setLeads(loadedLeads);
      setLeadMessage("Leads loaded.");
      void loadVoiceInteractions(loadedLeads);
    } catch {
      setLeadMessage("Something went wrong loading leads.");
    } finally {
      setLoadingLeads(false);
    }
  }

  async function loadProjects() {
    setLoadingProjects(true);
    setProjectMessage("");

    try {
      const response = await fetch("/api/projects/list");
      const data = await response.json();

      if (!response.ok) {
        setProjectMessage(data.error || "Could not load projects.");
        return;
      }

      setProjects(data.projects || []);
      setProjectMessage("Projects loaded.");
    } catch {
      setProjectMessage("Something went wrong loading projects.");
    } finally {
      setLoadingProjects(false);
    }
  }


  function editLead(lead: Lead) {
    setEditingLeadId(lead.id);
    setLeadName(lead.name || "");
    setLeadCompany(lead.company || "");
    setLeadEmail(lead.email || "");
    setLeadPhone(lead.phone || "");
    setLeadIndustry(lead.industry || "");
    setLeadInterest(lead.interest || "");
    setLeadSolution(lead.solution || "Not decided");
    setLeadStage(lead.stage || "new");
    setLeadNotes(lead.notes || "");
    setLeadMonthlyValue(
      lead.monthly_value !== null && lead.monthly_value !== undefined
        ? String(lead.monthly_value)
        : lead.estimated_value !== null && lead.estimated_value !== undefined
          ? String(lead.estimated_value)
          : ""
    );
    setLeadNextAction(lead.next_action || "");
    setLeadNextActionDate(lead.next_action_date || lead.follow_up_date || "");
    setLeadScore(
      lead.lead_score !== null && lead.lead_score !== undefined
        ? String(lead.lead_score)
        : lead.score !== null && lead.score !== undefined
          ? String(lead.score)
          : ""
    );
    setLeadSource(lead.source || "LinkedIn");
    setLeadRegion(lead.region || "United Kingdom");
    setLeadMessage(`Editing ${lead.company || lead.name || "lead"}.`);
    document.getElementById("crm")?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelLeadEdit() {
    setEditingLeadId(null);
    setLeadName("");
    setLeadCompany("");
    setLeadEmail("");
    setLeadPhone("");
    setLeadIndustry("");
    setLeadInterest("");
    setLeadSolution("Not decided");
    setLeadStage("new");
    setLeadNotes("");
    setLeadMonthlyValue("");
    setLeadNextAction("");
    setLeadNextActionDate("");
    setLeadScore("");
    setLeadSource("LinkedIn");
    setLeadRegion("United Kingdom");
    setLeadMessage("");
  }


  async function deleteLead(lead: Lead) {
    const label = lead.company || lead.name || "this lead";

    const confirmed = window.confirm(
      `Delete ${label}? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingLeadId(lead.id);
    setLeadMessage("");

    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setLeadMessage(data.error || "Could not delete lead.");
        return;
      }

      setLeadMessage(`${label} deleted.`);

      if (editingLeadId === lead.id) {
        cancelLeadEdit();
      }

      loadLeads();
    } catch {
      setLeadMessage("Something went wrong deleting the lead.");
    } finally {
      setDeletingLeadId(null);
    }
  }

  async function updateLeadStage(lead: Lead, stage: string) {
    setLeadMessage("");

    const previousStage = lead.stage || "new";

    setLeads((current) =>
      current.map((item) =>
        item.id === lead.id ? { ...item, stage } : item
      )
    );

    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          industry: lead.industry,
          source: lead.source,
          interest: lead.interest,
          solution: lead.solution || "Not decided",
          stage,
          notes: lead.notes,
          follow_up_date: lead.follow_up_date,
          estimated_value: lead.estimated_value,
          monthly_value: lead.monthly_value,
          score: lead.score,
          lead_score: lead.lead_score,
          next_action: lead.next_action,
          next_action_date: lead.next_action_date,
          region: lead.region,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLeads((current) =>
          current.map((item) =>
            item.id === lead.id ? { ...item, stage: previousStage } : item
          )
        );

        setLeadMessage(data.error || "Could not update lead status.");
        return;
      }

      setLeads((current) =>
        current.map((item) =>
          item.id === lead.id ? data.lead : item
        )
      );

      setLeadMessage(
        `${lead.company || lead.name || "Lead"} status updated.`
      );
    } catch {
      setLeads((current) =>
        current.map((item) =>
          item.id === lead.id ? { ...item, stage: previousStage } : item
        )
      );

      setLeadMessage("Something went wrong updating lead status.");
    }
  }

  async function convertLeadToOpportunity(lead: Lead) {
    const label = lead.company || lead.name || "this lead";
    setConvertingLeadId(lead.id);
    setLeadMessage("");

    try {
      const response = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          name: lead.name,
          company: lead.company,
          industry: lead.industry,
          region: lead.region,
          solution: lead.solution || "Not decided",
          monthly_value: lead.monthly_value,
          estimated_value: lead.estimated_value,
          stage: lead.stage,
          priority: lead.priority,
          next_action: lead.next_action,
          next_action_date: lead.next_action_date,
          follow_up_date: lead.follow_up_date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLeadMessage(data.error || "Could not convert lead to opportunity.");
        return;
      }

      setLeadMessage(`${label} added to Opportunity Hub.`);
      router.push("/opportunities");
    } catch {
      setLeadMessage("Something went wrong converting the lead.");
    } finally {
      setConvertingLeadId(null);
    }
  }

  async function saveLead() {
    setSavingLead(true);
    setLeadMessage("");

    try {
      const response = await fetch(editingLeadId ? `/api/leads/${editingLeadId}` : "/api/leads", {
        method: editingLeadId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          company: leadCompany,
          email: leadEmail,
          phone: leadPhone,
          industry: leadIndustry,
          source: leadSource,
          interest: leadInterest,
          solution: leadSolution,
          stage: leadStage,
          notes: leadNotes,
          monthly_value: leadMonthlyValue ? Number(leadMonthlyValue) : null,
          estimated_value: leadMonthlyValue ? Number(leadMonthlyValue) : null,
          next_action: leadNextAction,
          next_action_date: leadNextActionDate || null,
          follow_up_date: leadNextActionDate || null,
          lead_score: leadScore ? Number(leadScore) : null,
          score: leadScore ? Number(leadScore) : null,
          region: leadRegion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLeadMessage(data.error || "Could not save lead.");
        return;
      }

      setLeadMessage(editingLeadId ? "Lead updated." : "Lead saved.");
      setLeadName("");
      setLeadCompany("");
      setLeadEmail("");
      setLeadPhone("");
      setLeadIndustry("");
      setLeadInterest("");
      setLeadSolution("Not decided");
      setLeadStage("new");
      setLeadNotes("");
      setLeadMonthlyValue("");
      setLeadNextAction("");
      setLeadNextActionDate("");
      setLeadScore("");
      setLeadSource("LinkedIn");
      setLeadRegion("United Kingdom");
      setEditingLeadId(null);
      loadLeads();
    } catch {
      setLeadMessage("Something went wrong saving the lead.");
    } finally {
      setSavingLead(false);
    }
  }

  function setModeAndAsk(selectedMode: Mode) {
    setMode(selectedMode);
    askAlfred(selectedMode);
  }

  useEffect(() => {
    loadKnowledge();
    loadBusinessData();
    loadProjects();
    loadLeads();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedVoiceMode =
      window.localStorage.getItem("alfred_home_voice_mode");

    if (
      storedVoiceMode === "natural" ||
      storedVoiceMode === "device" ||
      storedVoiceMode === "silent"
    ) {
      setVoiceMode(storedVoiceMode);
      setVoiceStatus(
        storedVoiceMode === "natural"
          ? "Alfred Natural ready."
          : storedVoiceMode === "device"
            ? "Device voice ready."
            : "Silent mode is on."
      );
    }

    const interval = window.setInterval(() => {
      setVoiceClock(getLondonClockParts());
    }, 30000);

    return () => {
      window.clearInterval(interval);
      releaseNaturalAudio();
    };
  }, []);

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">Alfred</div>
            <div className="logo-subtitle">
              Mediahubink Sales, Strategy & Operating Chief of Staff
            </div>
          </div>

          <div className="nav-pill">Mission Control V3</div>
        </nav>

        <section
          className="card"
          id="alfred-voice"
          style={{ marginBottom: "28px" }}
        >
          <div className="kicker">Alfred Voice · Mission Control</div>

          <h1 style={{ marginBottom: "12px" }}>
            What do you need?
          </h1>

          <p className="lead" style={{ maxWidth: "760px" }}>
            Press and hold to speak. Release to send. Alfred will answer
            with the short decision out loud and keep the useful detail
            on screen.
          </p>

          {getBedtimeMode(voiceClock.hour, voiceClock.minute) !== "normal" && (
            <div
              className="mode"
              style={{
                marginTop: "18px",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <strong>Alfred bedtime reminder</strong>
              <span>
                {getBedtimeReminder(
                  getBedtimeMode(voiceClock.hour, voiceClock.minute)
                )}
              </span>
            </div>
          )}

          <div
            className="actions"
            style={{ marginTop: "20px", alignItems: "stretch" }}
          >
            <button
              className="btn"
              type="button"
              onTouchStart={handleVoiceTouchStart}
              onTouchEnd={handleVoiceTouchEnd}
              onTouchCancel={handleVoiceTouchCancel}
              onMouseDown={handleVoiceMouseDown}
              onMouseUp={handleVoiceMouseUp}
              onMouseLeave={handleVoiceMouseLeave}
              onClick={(event) => event.preventDefault()}
              onContextMenu={(event) => event.preventDefault()}
              disabled={voiceLoading}
              aria-pressed={voiceIsListening}
              style={{
                minHeight: "58px",
                minWidth: "230px",
                touchAction: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
                transform: voiceIsListening ? "scale(0.98)" : "none",
              }}
            >
              {voiceIsListening
                ? "🎙️ Listening... release to send"
                : voiceLoading
                  ? "Alfred is thinking..."
                  : "🎙️ Press & hold to talk"}
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                askAlfredVoice("What needs my attention most right now?")
              }
              disabled={voiceLoading}
            >
              What needs attention?
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                askAlfredVoice(
                  "What is the single best thing I should do next?"
                )
              }
              disabled={voiceLoading}
            >
              What should I do next?
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                askAlfredVoice(
                  "Which sales follow-ups deserve my attention now?"
                )
              }
              disabled={voiceLoading}
            >
              Follow-ups
            </button>

            <a className="btn btn-secondary" href="/alfred">
              Full Command Centre
            </a>
          </div>

          <textarea
            className="input-box"
            value={voicePrompt}
            onChange={(event) => setVoicePrompt(event.target.value)}
            placeholder="Or type a quick question for Alfred..."
            style={{ marginTop: "18px", minHeight: "92px" }}
          />

          <div className="actions" style={{ marginTop: "14px" }}>
            <button
              className="btn btn-secondary"
              onClick={() => askAlfredVoice()}
              disabled={voiceLoading || !voicePrompt.trim()}
            >
              {voiceLoading ? "Thinking..." : "Ask with voice"}
            </button>

            <button
              className={
                voiceMode === "natural" ? "btn" : "btn btn-secondary"
              }
              onClick={() => chooseVoiceMode("natural")}
            >
              Alfred Natural
            </button>

            <button
              className={
                voiceMode === "device" ? "btn" : "btn btn-secondary"
              }
              onClick={() => chooseVoiceMode("device")}
            >
              Device Voice
            </button>

            <button
              className={
                voiceMode === "silent" ? "btn" : "btn btn-secondary"
              }
              onClick={() => chooseVoiceMode("silent")}
            >
              Silent
            </button>

            <button
              className="btn btn-secondary"
              onClick={hearVoiceReply}
              disabled={!voiceReply}
            >
              🔊 Hear Alfred
            </button>

            {voiceIsSpeaking && (
              <button
                className="btn btn-secondary"
                onClick={stopVoiceSpeaking}
              >
                🔇 Stop Alfred
              </button>
            )}
          </div>

          <div className="mode-grid" style={{ marginTop: "16px" }}>
            <div className="mode">
              <strong>Voice status</strong>
              <span>{voiceStatus}</span>
            </div>

            <div className="mode">
              <strong>CRM voice context</strong>
              <span>{voiceContextMessage}</span>
            </div>

            <div className="mode">
              <strong>UK time</strong>
              <span>
                {String(voiceClock.hour).padStart(2, "0")}:
                {String(voiceClock.minute).padStart(2, "0")}
              </span>
            </div>
          </div>

          {voiceReply && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <strong>Alfred says:</strong>
              <div className="markdown-output">
                <ReactMarkdown>{voiceReply}</ReactMarkdown>
              </div>
            </div>
          )}
        </section>

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
              <a className="btn btn-secondary" href="/strategy">
                Strategy
              </a>
              <a className="btn btn-secondary" href="/pipeline">
                Pipeline
              </a>
              <a className="btn btn-secondary" href="/signal-log">
                Signal Log
              </a>
              <a className="btn btn-secondary" href="/market-intelligence">
                Market Intelligence
              </a>
              <a className="btn btn-secondary" href="/analytics">
                Analytics
              </a>
              <a className="btn btn-secondary" href="/operating-manual">
                Operating Manual
              </a>
              <a className="btn btn-secondary" href="/knowledge-base">
                Knowledge Base
              </a>
              <a className="btn btn-secondary" href="/solutions">
                Mediahubink Solutions
              </a>
              <a className="btn btn-secondary" href="/opportunities">
                Opportunity Hub
              </a>
              <a className="btn btn-secondary" href="/daily-briefing">
                Daily Briefing
              </a>
              <a className="btn btn-secondary" href="/divine-intelligence">
                Divine Intelligence
              </a>
              <a className="btn btn-secondary" href="/creative-desk">
                Creative Desk OS
              </a>
              <a className="btn btn-secondary" href="/creative-desk/generator">
                Creative Desk Generator
              </a>
              <a className="btn btn-secondary" href="#projects">
                View Projects
              </a>
              <a className="btn btn-secondary" href="#knowledge">
                View Knowledge
              </a>
              <a className="btn btn-secondary" href="#business">
                View Demos
              </a>
              <a className="btn btn-secondary" href="#crm">
                View CRM
              </a>
              <a className="btn btn-secondary" href="#memory">
                View Memory
              </a>
            </div>
          </div>

          <div className="card" id="quick-create">
            <div className="panel-title">What do you want to share today?</div>

            <textarea
              className="input-box"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Create an invoice for Woodley Dentist for Fredi Capture+ setup fee £299 and first month £697. Then generate payment instructions."
            />

            <div className="mode-grid">
              <button className="mode" onClick={() => setMode("creative-desk")}>
                <strong>Creative Desk Post</strong>
                <span>Builder’s Brief, Lab Notes or Strategic Reset.</span>
              </button>

              <button className="mode" onClick={() => setMode("linkedin-lead")}>
                <strong>LinkedIn Lead Post</strong>
                <span>Punchy Mediahubink post with CTA and pinned comment.</span>
              </button>

              <button className="mode" onClick={() => setMode("substack-note")}>
                <strong>Substack Note</strong>
                <span>Short, thoughtful post for Substack Notes.</span>
              </button>

              <button className="mode" onClick={() => setMode("vertical-campaign")}>
                <strong>Vertical Campaign</strong>
                <span>5-post campaign for one target industry.</span>
              </button>

              <button className="mode" onClick={() => setMode("prospect-intelligence")}>
                <strong>Prospect Intelligence</strong>
                <span>Analyse a company, profile or opportunity.</span>
              </button>

              <button className="mode" onClick={() => setMode("campaign-weekly")}>
                <strong>Campaign Weekly</strong>
                <span>Plan posts, demos, outreach and weekly reflection.</span>
              </button>

              <button className="mode" onClick={() => setMode("prospect-outreach")}>
                <strong>Prospect Outreach</strong>
                <span>Create DMs, emails and follow-up sequences.</span>
              </button>

              <button className="mode" onClick={() => setMode("metrics-review")}>
                <strong>Metrics Review</strong>
                <span>Review results and decide what to adjust next.</span>
              </button>

              <button className="mode" onClick={() => setMode("lead-operator")}>
                <strong>Lead Operator</strong>
                <span>Prioritise CRM leads and decide who to chase next.</span>
              </button>

              <button className="mode" onClick={() => setMode("proposal-builder")}>
                <strong>Proposal Builder</strong>
                <span>Create proposal-ready scopes, pricing and CTAs.</span>
              </button>

              <button className="mode" onClick={() => setMode("service-agreement")}>
                <strong>Service Agreement</strong>
                <span>Generate Mediahubink client agreements.</span>
              </button>

              <button className="mode" onClick={() => setMode("invoice-generator")}>
                <strong>Invoice Generator</strong>
                <span>Create formal Mediahubink invoices with no VAT charged.</span>
              </button>

              <button className="mode" onClick={() => setMode("payment-instructions")}>
                <strong>Payment Instructions</strong>
                <span>Create payment-ready instructions for client invoices.</span>
              </button>
            </div>

            <div className="actions" style={{ marginTop: "16px" }}>
              <button className="btn" onClick={() => askAlfred()} disabled={loading}>
                {loading ? "Alfred is thinking..." : "Ask Alfred"}
              </button>

              <button className="btn btn-secondary" onClick={saveThought} disabled={saving}>
                {saving ? "Saving..." : "Save Thought"}
              </button>

              <div className="icon-actions">
                <button className="icon-btn" onClick={() => setModeAndAsk("creative-desk")} disabled={loading} title="Creative Desk">
                  <PenSquare size={18} />
                </button>

                <button className="icon-btn" onClick={() => setModeAndAsk("linkedin-lead")} disabled={loading} title="LinkedIn Lead Post">
                  <Briefcase size={18} />
                </button>

                <button className="icon-btn" onClick={() => setModeAndAsk("prospect-intelligence")} disabled={loading} title="Prospect Intelligence">
                  <Search size={18} />
                </button>

                <button className="icon-btn" onClick={() => setModeAndAsk("campaign-weekly")} disabled={loading} title="Campaign Weekly">
                  <Megaphone size={18} />
                </button>

                <button className="icon-btn" onClick={() => setModeAndAsk("prospect-outreach")} disabled={loading} title="Prospect Outreach">
                  <Send size={18} />
                </button>

                <button className="icon-btn" onClick={() => setModeAndAsk("metrics-review")} disabled={loading} title="Metrics Review">
                  <BarChart3 size={18} />
                </button>

                <button className="icon-btn" onClick={() => setModeAndAsk("lead-operator")} disabled={loading} title="Lead Operator">
                  <Target size={18} />
                </button>

                <button className="icon-btn" onClick={() => setModeAndAsk("proposal-builder")} disabled={loading} title="Proposal Builder">
                  <FileText size={18} />
                </button>

                <button className="icon-btn" onClick={() => setModeAndAsk("service-agreement")} disabled={loading} title="Service Agreement">
                  <Clipboard size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={generateAgreementFromProposal}
                  disabled={loading}
                  title="Generate Agreement From Proposal"
                >
                  <FileText size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setModeAndAsk("invoice-generator")}
                  disabled={loading}
                  title="Invoice Generator"
                >
                  <Briefcase size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={generateInvoiceFromAgreement}
                  disabled={loading}
                  title="Generate Invoice From Agreement"
                >
                  <Clipboard size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={generatePaymentInstructions}
                  disabled={loading}
                  title="Generate Payment Instructions"
                >
                  <Briefcase size={18} />
                </button>

                <button className="icon-btn" onClick={printProposal} title="Export Proposal PDF">
                  <Printer size={18} />
                </button>

                <button className="icon-btn" onClick={openProposalPage} title="Open Branded Proposal">
                  <ExternalLink size={18} />
                </button>

                {!isListening ? (
                  <button className="icon-btn" onClick={startSpeech} title="Tap to Speak">
                    <Mic size={18} />
                  </button>
                ) : (
                  <button className="icon-btn listening" onClick={stopSpeech} title="Stop Listening">
                    <Square size={18} />
                  </button>
                )}

                <button className="icon-btn" onClick={() => copyText(prompt, "Prompt")} title="Copy Prompt">
                  <Clipboard size={18} />
                </button>

                <button className="icon-btn" onClick={() => copyText(reply, "Output")} title="Copy Output">
                  <Copy size={18} />
                </button>

                <button className="icon-btn" onClick={clearChat} title="Clear Chat">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>


              <div className="mobile-actions">
                <button className="mobile-action-btn" onClick={() => setModeAndAsk("creative-desk")} disabled={loading}>
                  <span>✍️</span><strong>Creative desk</strong>
                </button>

                <button className="mobile-action-btn" onClick={() => setModeAndAsk("linkedin-lead")} disabled={loading}>
                  <span>💼</span><strong>LinkedIn post</strong>
                </button>

                <button className="mobile-action-btn" onClick={() => setModeAndAsk("prospect-intelligence")} disabled={loading}>
                  <span>🔎</span><strong>Prospect intel</strong>
                </button>

                <button className="mobile-action-btn" onClick={() => setModeAndAsk("campaign-weekly")} disabled={loading}>
                  <span>📣</span><strong>Campaign</strong>
                </button>

                <button className="mobile-action-btn" onClick={() => setModeAndAsk("prospect-outreach")} disabled={loading}>
                  <span>📨</span><strong>Outreach</strong>
                </button>

                <button className="mobile-action-btn" onClick={() => setModeAndAsk("metrics-review")} disabled={loading}>
                  <span>📈</span><strong>Metrics</strong>
                </button>

                <button className="mobile-action-btn" onClick={() => setModeAndAsk("lead-operator")} disabled={loading}>
                  <span>🎯</span><strong>Lead operator</strong>
                </button>

                <button className="mobile-action-btn" onClick={() => setModeAndAsk("proposal-builder")} disabled={loading}>
                  <span>📄</span><strong>Proposal</strong>
                </button>

                <button className="mobile-action-btn" onClick={() => setModeAndAsk("service-agreement")} disabled={loading}>
                  <span>📜</span><strong>Agreement</strong>
                </button>

                <button className="mobile-action-btn" onClick={generateAgreementFromProposal} disabled={loading}>
                  <span>🧩</span><strong>Agreement from proposal</strong>
                </button>

                <button className="mobile-action-btn" onClick={() => setModeAndAsk("invoice-generator")} disabled={loading}>
                  <span>🧾</span><strong>Invoice</strong>
                </button>

                <button className="mobile-action-btn" onClick={generateInvoiceFromAgreement} disabled={loading}>
                  <span>💷</span><strong>Invoice from agreement</strong>
                </button>

                <button className="mobile-action-btn" onClick={generatePaymentInstructions} disabled={loading}>
                  <span>🏦</span><strong>Payment instructions</strong>
                </button>

                <button className="mobile-action-btn" onClick={printProposal} disabled={loading}>
                  <span>🖨️</span><strong>Print / PDF</strong>
                </button>

                <button className="mobile-action-btn" onClick={openProposalPage} disabled={loading}>
                  <span>↗️</span><strong>Branded page</strong>
                </button>

                {!isListening ? (
                  <button className="mobile-action-btn" onClick={startSpeech} disabled={loading}>
                    <span>🎙️</span><strong>Tap to speak</strong>
                  </button>
                ) : (
                  <button className="mobile-action-btn listening" onClick={stopSpeech}>
                    <span>⏹️</span><strong>Stop listening</strong>
                  </button>
                )}

                <button className="mobile-action-btn" onClick={() => copyText(prompt, "Prompt")}>
                  <span>📋</span><strong>Copy prompt</strong>
                </button>

                <button className="mobile-action-btn" onClick={() => copyText(reply, "Output")}>
                  <span>📑</span><strong>Copy output</strong>
                </button>

                <button className="mobile-action-btn danger" onClick={clearChat}>
                  <span>🗑️</span><strong>Clear chat</strong>
                </button>
              </div>

            <p style={{ color: "#a3a3a3", marginTop: "14px", fontSize: "14px" }}>
              Current mode: {mode}
              {isListening ? " · Listening..." : ""}
            </p>

            {copyMessage && (
              <div className="mode" style={{ marginTop: "16px" }}>
                <strong>Clipboard:</strong>
                <span>{copyMessage}</span>
              </div>
            )}

            {saveMessage && (
              <div className="mode" style={{ marginTop: "16px" }}>
                <strong>Memory:</strong>
                <span>{saveMessage}</span>
              </div>
            )}

            {reply && (
              <div className="mode" style={{ marginTop: "20px" }}>
                <strong>Alfred says:</strong>
                <div id="proposal-export" className="markdown-output">
                  <ReactMarkdown>{reply}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="card" id="projects" style={{ marginTop: "28px" }}>
          <div className="panel-title">Project / Demo Manager</div>

          <div className="actions" style={{ marginBottom: "18px" }}>
            <button className="btn btn-secondary" onClick={loadProjects} disabled={loadingProjects}>
              {loadingProjects ? "Loading..." : "Load Projects"}
            </button>
          </div>

          {projectMessage && (
            <div className="mode" style={{ marginBottom: "18px" }}>
              <strong>Status:</strong>
              <span>{projectMessage}</span>
            </div>
          )}

          <div className="section" style={{ marginTop: "0" }}>
            <div className="mini-card">
              <h3>Projects Loaded</h3>
              <p>{projects.length}</p>
            </div>

            <div className="mini-card">
              <h3>Purpose</h3>
              <p>Keep your demos, builds and proof assets visible.</p>
            </div>

            <div className="mini-card">
              <h3>Use In Prompts</h3>
              <p>Loaded projects are passed to Alfred when generating responses.</p>
            </div>
          </div>

          {projects.length > 0 && (
            <div className="mode-grid" style={{ marginTop: "18px" }}>
              {projects.map((project) => (
                <div className="mode" key={project.id}>
                  <strong>{project.name}</strong>
                  <span>{project.category || "No category"}</span>
                  <span>{project.audience || "No audience"}</span>
                  <span>{project.url || "No URL"}</span>
                  <span>{project.description || ""}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card" id="crm" style={{ marginTop: "28px" }}>
          <div className="panel-title">
            CRM-lite {editingLeadId ? "· Editing Lead" : ""}
          </div>

          <div className="mode-grid">
            <input className="input-box" style={{ minHeight: "52px" }} value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Contact name" />
            <input className="input-box" style={{ minHeight: "52px" }} value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} placeholder="Company" />
            <input className="input-box" style={{ minHeight: "52px" }} value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder="Email" />
            <input className="input-box" style={{ minHeight: "52px" }} value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} placeholder="Phone" />

            <select className="input-box" style={{ minHeight: "52px" }} value={leadIndustry} onChange={(e) => setLeadIndustry(e.target.value)}>
              <option value="">Select industry</option>
              <option value="Trades">Trades</option>
              <option value="Dental">Dental</option>
              <option value="Estate Agents">Estate Agents</option>
              <option value="Schools">Schools</option>
              <option value="Serviced Offices">Serviced Offices</option>
              <option value="Veterinary">Veterinary</option>
              <option value="SADC">SADC</option>
              <option value="Other">Other</option>
            </select>

            <input className="input-box" style={{ minHeight: "52px" }} value={leadInterest} onChange={(e) => setLeadInterest(e.target.value)} placeholder="Interest, e.g. Fredi Capture+, demo, audit" />

            <select className="input-box" style={{ minHeight: "52px" }} value={leadSolution} onChange={(e) => setLeadSolution(e.target.value)}>
              <option value="Not decided">Not decided</option>
              <option value="Fredi Capture">Fredi Capture</option>
              <option value="Fredi Capture+">Fredi Capture+</option>
              <option value="Grid Gym">Grid Gym</option>
              <option value="Kaya">Kaya</option>
              <option value="RunSheet OS">RunSheet OS</option>
              <option value="Opportunity Blueprint">Opportunity Blueprint</option>
              <option value="Emergency Build">Emergency Build</option>
              <option value="Fredi Enterprise">Fredi Enterprise</option>
            </select>

            <select className="input-box" style={{ minHeight: "52px" }} value={leadStage} onChange={(e) => setLeadStage(e.target.value)}>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="discovery">Discovery</option>
              <option value="demo-interest">Demo Interest</option>
              <option value="proposal-sent">Proposal Sent</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="relationship-building">Relationship Building</option>
            </select>

            <input className="input-box" style={{ minHeight: "52px" }} type="number" min="0" value={leadMonthlyValue} onChange={(e) => setLeadMonthlyValue(e.target.value)} placeholder="Monthly Value (£), e.g. 397, 697, 4000" />
            <input className="input-box" style={{ minHeight: "52px" }} value={leadNextAction} onChange={(e) => setLeadNextAction(e.target.value)} placeholder="Next Action, e.g. Follow up proposal" />
            <input className="input-box" style={{ minHeight: "52px" }} type="date" value={leadNextActionDate} onChange={(e) => setLeadNextActionDate(e.target.value)} />
            <input className="input-box" style={{ minHeight: "52px" }} type="number" min="0" max="40" value={leadScore} onChange={(e) => setLeadScore(e.target.value)} placeholder="Lead Score (0-40)" />

            <select className="input-box" style={{ minHeight: "52px" }} value={leadSource} onChange={(e) => setLeadSource(e.target.value)}>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
              <option value="Substack">Substack</option>
              <option value="Network">Network</option>
              <option value="Cold Outreach">Cold Outreach</option>
              <option value="Partner">Partner</option>
              <option value="Other">Other</option>
            </select>

            <select className="input-box" style={{ minHeight: "52px" }} value={leadRegion} onChange={(e) => setLeadRegion(e.target.value)}>
              <option value="United Kingdom">United Kingdom</option>
              <option value="SADC">SADC</option>
              <option value="Namibia">Namibia</option>
              <option value="Zambia">Zambia</option>
              <option value="South Africa">South Africa</option>
              <option value="DRC">DRC</option>
              <option value="Zimbabwe">Zimbabwe</option>
              <option value="Other">Other</option>
            </select>

            <textarea className="input-box" value={leadNotes} onChange={(e) => setLeadNotes(e.target.value)} placeholder="Notes" />
          </div>

          <div className="actions" style={{ marginTop: "18px" }}>
            <button className="btn" onClick={saveLead} disabled={savingLead}>
              {savingLead ? "Saving lead..." : editingLeadId ? "Update Lead" : "Save Lead"}
            </button>

            {editingLeadId && (
              <button className="btn btn-secondary" onClick={cancelLeadEdit}>
                Cancel Edit
              </button>
            )}

            <button className="btn btn-secondary" onClick={loadLeads} disabled={loadingLeads}>
              {loadingLeads ? "Loading..." : "Load Leads"}
            </button>
          </div>

          {leadMessage && (
            <div className="mode" style={{ marginTop: "18px" }}>
              <strong>Status:</strong>
              <span>{leadMessage}</span>
            </div>
          )}

          <div className="section" style={{ marginTop: "18px" }}>
            <div className="mini-card">
              <h3>Leads Loaded</h3>
              <p>{leads.length}</p>
            </div>

            <div className="mini-card">
              <h3>Purpose</h3>
              <p>Track prospects, demo interest and follow-up conversations.</p>
            </div>

            <div className="mini-card">
              <h3>Potential MRR</h3>
              <p>
                £{leads.reduce((total, lead) => total + Number(lead.monthly_value ?? lead.estimated_value ?? 0), 0).toLocaleString("en-GB")}
              </p>
            </div>
          </div>

          {leads.length > 0 && (
            <div className="mode-grid" style={{ marginTop: "18px" }}>
              {leads.map((lead) => (
                <div className="mode lead-card" key={lead.id}>
                  <div className="lead-card-header">
                    <strong>{lead.company || lead.name || "Unnamed lead"}</strong>

                    <div className="lead-card-actions">
                      <button
                        className="lead-edit-btn"
                        onClick={() => convertLeadToOpportunity(lead)}
                        disabled={convertingLeadId === lead.id}
                      >
                        {convertingLeadId === lead.id
                          ? "Converting..."
                          : "Convert to Opportunity"}
                      </button>

                      <button className="lead-edit-btn" onClick={() => editLead(lead)}>
                        Edit
                      </button>

                      <button
                        className="lead-delete-btn"
                        onClick={() => deleteLead(lead)}
                        disabled={deletingLeadId === lead.id}
                      >
                        {deletingLeadId === lead.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>

                  <span>Contact: {lead.name || "Not added"}</span>
                  <span>Email: {lead.email || "Not added"}</span>
                  <span>Phone: {lead.phone || "Not added"}</span>
                  <span>Industry: {lead.industry || "Not added"}</span>
                  <span>Interest: {lead.interest || "Not added"}</span>
                  <span>Solution: {lead.solution || "Not decided"}</span>
                  <span>Monthly value: £{Number(lead.monthly_value ?? lead.estimated_value ?? 0).toLocaleString("en-GB")}</span>
                  <span>Source: {lead.source || "Not added"}</span>
                  <span>Region: {lead.region || "Not added"}</span>

                  <label className="lead-status-label">
                    Status
                    <select
                      className="lead-status-select"
                      value={lead.stage || "new"}
                      onChange={(e) =>
                        updateLeadStage(lead, e.target.value)
                      }
                    >
                      <option value="new">New</option>
                      <option value="discovery">Discovery</option>
                      <option value="contacted">Contacted</option>
                      <option value="demo-interest">Demo Interest</option>
                      <option value="proposal-sent">Proposal Sent</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="relationship-building">Relationship Building</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </label>

                  <span>Lead score: {lead.lead_score ?? lead.score ?? 0}</span>
                  <span>Priority: {lead.priority || "medium"}</span>
                  <span>Next action: {lead.next_action || "Not added"}</span>
                  <span>Next action date: {lead.next_action_date || lead.follow_up_date || "Not added"}</span>
                  <span>{lead.notes || ""}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card" id="knowledge" style={{ marginTop: "28px" }}>
          <div className="panel-title">Knowledge Vault</div>

          <div className="actions" style={{ marginBottom: "18px" }}>
            <button className="btn btn-secondary" onClick={loadKnowledge} disabled={loadingKnowledge}>
              {loadingKnowledge ? "Loading..." : "Load Knowledge"}
            </button>
          </div>

          {knowledgeMessage && (
            <div className="mode" style={{ marginBottom: "18px" }}>
              <strong>Status:</strong>
              <span>{knowledgeMessage}</span>
            </div>
          )}

          {knowledge.length === 0 ? (
            <p className="lead" style={{ fontSize: "16px" }}>
              No knowledge loaded yet.
            </p>
          ) : (
            <div className="mode-grid">
              {knowledge.map((item) => (
                <div className="mode" key={item.id}>
                  <strong>{item.category}: {item.title}</strong>
                  <span>{item.content}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card" id="business" style={{ marginTop: "28px" }}>
          <div className="panel-title">Demo Manager + Offer Engine</div>

          <div className="actions" style={{ marginBottom: "18px" }}>
            <button className="btn btn-secondary" onClick={loadBusinessData} disabled={loadingBusinessData}>
              {loadingBusinessData ? "Loading..." : "Load Demos + Offers"}
            </button>
          </div>

          {businessMessage && (
            <div className="mode" style={{ marginBottom: "18px" }}>
              <strong>Status:</strong>
              <span>{businessMessage}</span>
            </div>
          )}

          <div className="section" style={{ marginTop: "0" }}>
            <div className="mini-card">
              <h3>Demos Loaded</h3>
              <p>{demos.length}</p>
            </div>

            <div className="mini-card">
              <h3>Offers Loaded</h3>
              <p>{offers.length}</p>
            </div>

            <div className="mini-card">
              <h3>Use In Prompts</h3>
              <p>Loaded demos and offers are passed to Alfred when generating posts.</p>
            </div>
          </div>

          {demos.length > 0 && (
            <>
              <div className="panel-title" style={{ marginTop: "24px" }}>
                Demo Links
              </div>

              <div className="mode-grid">
                {demos.map((demo) => (
                  <div className="mode" key={demo.id}>
                    <strong>{demo.vertical}</strong>
                    <span>{demo.demo_url}</span>
                    <span>{demo.cta}</span>
                    <span>{demo.notes}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {offers.length > 0 && (
            <>
              <div className="panel-title" style={{ marginTop: "24px" }}>
                Offers
              </div>

              <div className="mode-grid">
                {offers.map((offer) => (
                  <div className="mode" key={offer.id}>
                    <strong>{offer.name}</strong>
                    <span>{offer.offer_type}</span>
                    <span>{offer.price}</span>
                    <span>{offer.description}</span>
                    <span>{offer.cta}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="card" id="memory" style={{ marginTop: "28px" }}>
          <div className="panel-title">Alfred’s Memory</div>

          <div className="actions" style={{ marginBottom: "18px" }}>
            <button className="btn btn-secondary" onClick={loadThoughts} disabled={loadingThoughts}>
              {loadingThoughts ? "Loading..." : "Refresh Memory"}
            </button>
          </div>

          {thoughts.length === 0 ? (
            <p className="lead" style={{ fontSize: "16px" }}>
              No thoughts loaded yet. Save a thought, then refresh memory.
            </p>
          ) : (
            <div className="mode-grid">
              {thoughts.map((thought) => (
                <div className="mode" key={thought.id}>
                  <strong>{thought.title || "Untitled thought"}</strong>
                  <span>{thought.content}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
