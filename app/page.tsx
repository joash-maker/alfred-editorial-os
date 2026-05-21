"use client";

import { useState, useEffect } from "react";
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
  stage: string | null;
  notes: string | null;
  follow_up_date: string | null;
  estimated_value: number | null;
  score: number | null;
  priority: string | null;
  next_action: string | null;
  last_contacted: string | null;
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
  | "proposal-builder";

const modePrompts: Record<Mode, string> = {
  general:
    "Respond as Alfred, Joash's editorial and growth chief of staff. Be calm, clear, useful and commercially aware.",

  "creative-desk":
    "Turn the user's thought into a Creative Desk content idea. Suggest whether it should become Tuesday Builder’s Brief, Thursday Lab Notes, or Sunday Strategic Reset. Then create a strong title, angle, outline, Substack CTA, LinkedIn teaser, Substack Note and visual brief.",

  "linkedin-lead":
    "Create a modern, punchy, effective LinkedIn lead-generation post for Mediahubink. Use British English. Make it commercially sharp, direct and specific. Structure it with a strong hook, pain point, numbers or business impact, mechanism, clear CTA, and a pinned comment.",

  "substack-note":
    "Create a short Substack Note from the user's thought. Make it thoughtful, concise, calm and worth replying to. Include one sharp idea, one short reflection, and a soft invitation to read or subscribe.",

  "vertical-campaign":
    "Create a vertical-specific LinkedIn campaign for Mediahubink. Include target vertical, pain point, 5 post titles, one full sample post, pinned comment, CTA, suggested demo link type, and hashtags. Keep it practical and conversion-focused.",

  "prospect-intelligence":
    "Act as Mediahubink's commercial intelligence strategist. Never ask for more information unless absolutely necessary. If the user gives a broad industry, analyse the vertical immediately. If they give a specific company, analyse that company using available clues and assumptions without fabricating facts. If only a URL is provided, do not pretend to visit it. Use loaded projects, offers, universal AI products and business assumptions. If no exact demo exists, recommend the closest proof asset and explain transferability. Always include: pain points, missed revenue gaps, operational inefficiencies, best-fit AI offer, proof asset, outreach angle, objections, LinkedIn DM, email draft, next action. British English. Commercially sharp. No hesitation.",

  "campaign-weekly":
    "Act as Alfred, Mediahubink's campaign chief of staff. Build a weekly campaign plan using the current projects, demos, offers, leads and knowledge loaded into context. Include: weekly objective, target vertical, key offer, best demo to push, 5 LinkedIn post ideas, 3 Substack Notes, outreach actions, CRM actions, daily schedule, CTA strategy, and Friday reflection prompt. Keep it practical, focused and commercially useful.",

  "prospect-outreach":
    "Act as Mediahubink's outreach strategist. Create commercially sharp outreach for the prospect or vertical provided. If no exact demo exists, intelligently map the closest Mediahubink proof asset and explain how the same AI framework applies. Include pain points, best-fit AI offer, proof asset, LinkedIn connection message, follow-up sequence, objections and suggested replies. British English. Warm, practical, direct.",

  "metrics-review":
    "Act as Alfred, Mediahubink's campaign analyst. Review the metrics, campaign notes or weekly reflection provided. Identify what worked, what underperformed, likely reasons, strongest vertical, best content angle, CRM implications, next week's recommendation, what to stop, what to double down on, and one clear action plan. Be honest, practical and commercially focused.",

  "lead-operator":
    "Act as Mediahubink's AI sales operator. Review CRM leads and decide who to prioritise, what to do next, who is likely hot, who is cold, what outreach to send, and what commercial opportunity exists. Score urgency, fit and revenue potential. Be commercially sharp, practical and direct. Use the loaded leads, offers, demos, projects and knowledge.",

  "proposal-builder":
    "Act as Mediahubink's proposal strategist. Build a commercially sharp proposal using the current prospect, demos, offers and context. Do not invent dates. If a date is needed, write [Insert Date]. Include: executive summary, prospect problem, opportunity cost, recommended AI solution, implementation scope, timeline, pricing, ROI logic, proof assets, objections and responses, next steps and CTA. Write in British English. Keep it clear, persuasive and ready to adapt into a PDF.",
};

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionType | null>(
    null
  );

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

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectMessage, setProjectMessage] = useState("");

  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadIndustry, setLeadIndustry] = useState("");
  const [leadInterest, setLeadInterest] = useState("");
  const [leadStage, setLeadStage] = useState("new");
  const [leadNotes, setLeadNotes] = useState("");

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

  async function askAlfred(selectedMode: Mode = mode) {
    if (!prompt.trim()) return;

    setLoading(true);
    setReply("");
    setSaveMessage("");
    setCopyMessage("");

    const demoContext =
      demos.length > 0
        ? demos
            .map((d) => `${d.vertical}: ${d.demo_url} | CTA: ${d.cta || ""}`)
            .join("\n")
        : "Context still loading...";

    const offerContext =
      offers.length > 0
        ? offers
            .map((o) => `${o.name}: ${o.price || ""} | ${o.description || ""}`)
            .join("\n")
        : "Context still loading...";

    const knowledgeContext =
      knowledge.length > 0
        ? knowledge
            .map((k) => `${k.category} - ${k.title}: ${k.content}`)
            .join("\n")
        : "Context still loading...";

    const leadContext =
      leads.length > 0
        ? leads
            .map(
              (l) =>
                `${l.company || l.name || "Unnamed lead"} |
${l.industry || "No industry"} |
Interest: ${l.interest || "None"} |
Stage: ${l.stage || "new"} |
Score: ${l.score || 0} |
Priority: ${l.priority || "medium"} |
Next: ${l.next_action || "none"} |
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

Permanent Alfred Knowledge:
${knowledgeContext}

Current Mediahubink demo links:
${demoContext}

Current Mediahubink offers:
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

      setLeads(data.leads || []);
      setLeadMessage("Leads loaded.");
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

  async function saveLead() {
    setSavingLead(true);
    setLeadMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          company: leadCompany,
          email: leadEmail,
          phone: leadPhone,
          industry: leadIndustry,
          source: "alfred-dashboard",
          interest: leadInterest,
          stage: leadStage,
          notes: leadNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLeadMessage(data.error || "Could not save lead.");
        return;
      }

      setLeadMessage("Lead saved.");
      setLeadName("");
      setLeadCompany("");
      setLeadEmail("");
      setLeadPhone("");
      setLeadIndustry("");
      setLeadInterest("");
      setLeadStage("new");
      setLeadNotes("");
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
              placeholder="Example: Build a proposal for Woodley Dentist using Fredi Capture and optional Capture+."
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

              <button
                className="mode"
                onClick={() => setMode("vertical-campaign")}
              >
                <strong>Vertical Campaign</strong>
                <span>5-post campaign for one target industry.</span>
              </button>

              <button
                className="mode"
                onClick={() => setMode("prospect-intelligence")}
              >
                <strong>Prospect Intelligence</strong>
                <span>Analyse a company, profile or opportunity.</span>
              </button>

              <button
                className="mode"
                onClick={() => setMode("campaign-weekly")}
              >
                <strong>Campaign Weekly</strong>
                <span>Plan posts, demos, outreach and weekly reflection.</span>
              </button>

              <button
                className="mode"
                onClick={() => setMode("prospect-outreach")}
              >
                <strong>Prospect Outreach</strong>
                <span>Create DMs, emails and follow-up sequences.</span>
              </button>

              <button
                className="mode"
                onClick={() => setMode("metrics-review")}
              >
                <strong>Metrics Review</strong>
                <span>Review results and decide what to adjust next.</span>
              </button>

              <button
                className="mode"
                onClick={() => setMode("lead-operator")}
              >
                <strong>Lead Operator</strong>
                <span>Prioritise CRM leads and decide who to chase next.</span>
              </button>

              <button
                className="mode"
                onClick={() => setMode("proposal-builder")}
              >
                <strong>Proposal Builder</strong>
                <span>Create proposal-ready scopes, pricing and CTAs.</span>
              </button>
            </div>

            <div className="actions" style={{ marginTop: "16px" }}>
              <button
                className="btn"
                onClick={() => askAlfred()}
                disabled={loading}
              >
                {loading ? "Alfred is thinking..." : "Ask Alfred"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={saveThought}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Thought"}
              </button>

              <div className="icon-actions">
                <button
                  className="icon-btn"
                  onClick={() => setModeAndAsk("creative-desk")}
                  disabled={loading}
                  title="Creative Desk"
                >
                  <PenSquare size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setModeAndAsk("linkedin-lead")}
                  disabled={loading}
                  title="LinkedIn Lead Post"
                >
                  <Briefcase size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setModeAndAsk("prospect-intelligence")}
                  disabled={loading}
                  title="Prospect Intelligence"
                >
                  <Search size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setModeAndAsk("campaign-weekly")}
                  disabled={loading}
                  title="Campaign Weekly"
                >
                  <Megaphone size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setModeAndAsk("prospect-outreach")}
                  disabled={loading}
                  title="Prospect Outreach"
                >
                  <Send size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setModeAndAsk("metrics-review")}
                  disabled={loading}
                  title="Metrics Review"
                >
                  <BarChart3 size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setModeAndAsk("lead-operator")}
                  disabled={loading}
                  title="Lead Operator"
                >
                  <Target size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => setModeAndAsk("proposal-builder")}
                  disabled={loading}
                  title="Proposal Builder"
                >
                  <FileText size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={printProposal}
                  title="Export Proposal PDF"
                >
                  <Printer size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={openProposalPage}
                  title="Open Branded Proposal"
                >
                  <ExternalLink size={18} />
                </button>

                {!isListening ? (
                  <button
                    className="icon-btn"
                    onClick={startSpeech}
                    title="Tap to Speak"
                  >
                    <Mic size={18} />
                  </button>
                ) : (
                  <button
                    className="icon-btn listening"
                    onClick={stopSpeech}
                    title="Stop Listening"
                  >
                    <Square size={18} />
                  </button>
                )}

                <button
                  className="icon-btn"
                  onClick={() => copyText(prompt, "Prompt")}
                  title="Copy Prompt"
                >
                  <Clipboard size={18} />
                </button>

                <button
                  className="icon-btn"
                  onClick={() => copyText(reply, "Output")}
                  title="Copy Output"
                >
                  <Copy size={18} />
                </button>

                <button className="icon-btn" onClick={clearChat} title="Clear Chat">
                  <Trash2 size={18} />
                </button>
              </div>
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
            <button
              className="btn btn-secondary"
              onClick={loadProjects}
              disabled={loadingProjects}
            >
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
          <div className="panel-title">CRM-lite</div>

          <div className="mode-grid">
            <input className="input-box" style={{ minHeight: "52px" }} value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Contact name" />
            <input className="input-box" style={{ minHeight: "52px" }} value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} placeholder="Company" />
            <input className="input-box" style={{ minHeight: "52px" }} value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder="Email" />
            <input className="input-box" style={{ minHeight: "52px" }} value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} placeholder="Phone" />
            <input className="input-box" style={{ minHeight: "52px" }} value={leadIndustry} onChange={(e) => setLeadIndustry(e.target.value)} placeholder="Industry" />
            <input className="input-box" style={{ minHeight: "52px" }} value={leadInterest} onChange={(e) => setLeadInterest(e.target.value)} placeholder="Interest, e.g. Fredi, voice agent, demo" />

            <select className="input-box" style={{ minHeight: "52px" }} value={leadStage} onChange={(e) => setLeadStage(e.target.value)}>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="demo-interest">Demo Interest</option>
              <option value="proposal">Proposal</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>

            <textarea className="input-box" value={leadNotes} onChange={(e) => setLeadNotes(e.target.value)} placeholder="Notes" />
          </div>

          <div className="actions" style={{ marginTop: "18px" }}>
            <button className="btn" onClick={saveLead} disabled={savingLead}>
              {savingLead ? "Saving lead..." : "Save Lead"}
            </button>

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
              <h3>Next Upgrade</h3>
              <p>Add follow-up dates and Alfred reminders.</p>
            </div>
          </div>

          {leads.length > 0 && (
            <div className="mode-grid" style={{ marginTop: "18px" }}>
              {leads.map((lead) => (
                <div className="mode" key={lead.id}>
                  <strong>{lead.company || lead.name || "Unnamed lead"}</strong>
                  <span>Contact: {lead.name || "Not added"}</span>
                  <span>Email: {lead.email || "Not added"}</span>
                  <span>Phone: {lead.phone || "Not added"}</span>
                  <span>Industry: {lead.industry || "Not added"}</span>
                  <span>Interest: {lead.interest || "Not added"}</span>
                  <span>Stage: {lead.stage || "new"}</span>
                  <span>Score: {lead.score ?? 0}</span>
                  <span>Priority: {lead.priority || "medium"}</span>
                  <span>Next action: {lead.next_action || "Not added"}</span>
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
