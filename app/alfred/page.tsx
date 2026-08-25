"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { defaultCampaigns, products } from "../../lib/alfredConfig";

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
      length: number;
    };
    length: number;
  };
};

type SpeechWindow = Window & {
  webkitSpeechRecognition?: new () => SpeechRecognitionType;
  SpeechRecognition?: new () => SpeechRecognitionType;
};

type Lead = {
  id: string;
  name?: string | null;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  industry?: string | null;
  source?: string | null;
  interest?: string | null;
  solution?: string | null;
  stage?: string | null;
  notes?: string | null;
  follow_up_date?: string | null;
  monthly_value?: number | null;
  estimated_value?: number | null;
  lead_score?: number | null;
  score?: number | null;
  priority?: string | null;
  next_action?: string | null;
  next_action_date?: string | null;
  last_contacted?: string | null;
  region?: string | null;
};

type Project = {
  id: string;
  name: string;
  url?: string | null;
  category?: string | null;
  audience?: string | null;
  description?: string | null;
  status?: string | null;
};

type Demo = {
  id: string;
  vertical: string;
  demo_url: string;
  cta?: string | null;
  notes?: string | null;
  status?: string | null;
};

type Offer = {
  id: string;
  name: string;
  offer_type?: string | null;
  description?: string | null;
  price?: string | null;
  cta?: string | null;
  status?: string | null;
};

type Knowledge = {
  id: string;
  category: string;
  title: string;
  content: string;
  source?: string | null;
  status?: string | null;
};

type Thought = {
  id: string;
  title?: string | null;
  category?: string | null;
  content: string;
  status?: string | null;
  created_at?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const quickActions = [
  {
    label: "Daily briefing",
    prompt: `Give me my daily briefing for today.

Start with the single most important thing I need to accomplish.

Then cover:
1. Sales follow-ups due or requiring attention
2. Strongest current UK commercial opportunities
3. Fredi UK Trades campaign
4. Namibia AI Market Entry
5. Important commitments or unfinished actions
6. Risks or things I am neglecting
7. The three actions that matter most today

Do not invent activity that is not present in the loaded data.`,
  },
  {
    label: "What should I do next?",
    prompt: `Review my current leads, campaigns, projects, opportunities and strategic activity.

Tell me the single best action to take next.

Explain briefly why it outranks everything else.

Prefer advancing existing conversations and overdue follow-ups before creating unnecessary new work.`,
  },
  {
    label: "Sales follow-ups",
    prompt: `Review my CRM and identify the sales follow-ups that deserve attention now.

For each important one, tell me:
- company
- current situation
- why it matters
- best next channel
- recommended next action

Prioritise real conversations over generic prospecting.`,
  },
  {
    label: "Tonight's plan",
    prompt: `Build my practical work plan for tonight from 7:30 pm to 11:30 pm UK time.

Use my live Alfred data.

Prioritise:
1. revenue-generating action
2. follow-ups
3. Namibia market-entry actions where genuinely important
4. only then building or content

Give me a realistic sequence with times.

Do not fill four hours just for the sake of it.`,
  },
  {
    label: "Namibia market entry",
    prompt: `Give me my Namibia AI Market Entry briefing.

Treat Namibia as a first-class active strategic market, separate from general SADC activity.

Review:
- relevant projects and proof assets
- NamReady
- NamReady Youth
- Kaya
- voice and enquiry-system capabilities
- institutional or strategic relationships visible in Alfred
- possible pilot opportunities
- outstanding relationship actions

Tell me what would genuinely advance market entry next.`,
  },
  {
    label: "Review pipeline",
    prompt: `Review my commercial pipeline as Alfred, my operating chief of staff.

Tell me:
- strongest opportunities
- stalled opportunities
- follow-ups due
- likely distractions
- where pipeline value is concentrated
- what I should do to create the next genuine sales conversation.`,
  },
  {
    label: "What am I neglecting?",
    prompt: `Look across my leads, projects, campaigns, follow-ups and strategic activity.

Tell me what I appear to be neglecting.

Separate:
- genuinely important neglected work
- things that can remain parked
- distractions I should stop worrying about.`,
  },
  {
    label: "Reset me",
    prompt: `Reset my focus.

I may have too many ideas or projects competing for attention.

Tell me:
1. my current primary commercial objective
2. my current strategic market-entry objective
3. the most important live opportunity
4. the most important follow-up
5. what I should ignore for now
6. the next action I should physically take

Keep this short and decisive.`,
  },
];

export default function AlfredCommandCentrePage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  const [contextLoading, setContextLoading] = useState(true);
  const [contextMessage, setContextMessage] = useState(
    "Loading Alfred's business context..."
  );

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] =
    useState<SpeechRecognitionType | null>(null);

  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentDateTime = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  async function fetchJson(url: string) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  }

  async function loadContext() {
    setContextLoading(true);
    setContextMessage("Loading Alfred's business context...");

    const [
      leadData,
      projectData,
      demoData,
      offerData,
      knowledgeData,
      thoughtData,
    ] = await Promise.all([
      fetchJson("/api/leads/list"),
      fetchJson("/api/projects/list"),
      fetchJson("/api/demos/list"),
      fetchJson("/api/offers/list"),
      fetchJson("/api/knowledge/list"),
      fetchJson("/api/thoughts/list"),
    ]);

    setLeads(leadData?.leads || []);
    setProjects(projectData?.projects || []);
    setDemos(demoData?.demos || []);
    setOffers(offerData?.offers || []);
    setKnowledge(knowledgeData?.knowledge || []);
    setThoughts(thoughtData?.thoughts || []);

    setContextLoading(false);
    setContextMessage("Business context loaded.");
  }

  useEffect(() => {
    loadContext();
  }, []);

  function cleanForSpeech(text: string) {
    return text
      .replace(/[#*_`>]/g, "")
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, ". ")
      .trim();
  }

  function speak(text: string) {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      !text.trim()
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      cleanForSpeech(text)
    );

    utterance.lang = "en-GB";
    utterance.rate = 0.96;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();

    const britishVoice = voices.find(
      (voice) =>
        voice.lang.toLowerCase() === "en-gb" ||
        voice.lang.toLowerCase().startsWith("en-gb")
    );

    if (britishVoice) {
      utterance.voice = britishVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  }

  function buildBusinessContext() {
    const campaignContext = defaultCampaigns
      .map(
        (campaign) =>
          `${campaign.name}
Type: ${campaign.type}
Status: ${campaign.status}
Primary: ${campaign.primary ? "Yes" : "No"}
Market: ${campaign.market}
Sectors: ${campaign.sectors.join(", ")}
Products: ${campaign.products.join(", ")}
Objective: ${campaign.objective}
Review cadence: ${campaign.reviewCadence}`
      )
      .join("\n\n");

    const productContext = products
      .map(
        (product) =>
          `${product.name}
Family: ${product.family}
Type: ${product.type}
Markets: ${product.markets.join(", ")}
Sectors: ${product.sectors.join(", ")}
Commercial status: ${product.commercialStatus}
Use cases: ${product.useCases.join(", ")}
URL: ${product.url}
Description: ${product.description}`
      )
      .join("\n\n");

    const leadContext =
      leads.length > 0
        ? leads
            .slice(0, 50)
            .map(
              (lead) =>
                `${lead.company || lead.name || "Unnamed lead"} |
Contact: ${lead.name || "Not added"} |
Industry: ${lead.industry || "Not added"} |
Region: ${lead.region || "Not added"} |
Stage: ${lead.stage || "new"} |
Solution: ${lead.solution || "Not decided"} |
Monthly value: £${
                  lead.monthly_value ??
                  lead.estimated_value ??
                  0
                } |
Score: ${lead.lead_score ?? lead.score ?? 0} |
Priority: ${lead.priority || "not set"} |
Source: ${lead.source || "not set"} |
Last contacted: ${lead.last_contacted || "not recorded"} |
Next action: ${lead.next_action || "none"} |
Next action date: ${
                  lead.next_action_date ||
                  lead.follow_up_date ||
                  "none"
                } |
Notes: ${lead.notes || "none"}`
            )
            .join("\n")
        : "No CRM leads currently loaded.";

    const projectContext =
      projects.length > 0
        ? projects
            .slice(0, 40)
            .map(
              (project) =>
                `${project.name} |
Category: ${project.category || "not set"} |
Audience: ${project.audience || "not set"} |
Status: ${project.status || "not set"} |
URL: ${project.url || "none"} |
Description: ${project.description || "none"}`
            )
            .join("\n")
        : "No projects currently loaded.";

    const demoContext =
      demos.length > 0
        ? demos
            .slice(0, 30)
            .map(
              (demo) =>
                `${demo.vertical}: ${demo.demo_url} |
Status: ${demo.status || "not set"} |
CTA: ${demo.cta || "none"} |
Notes: ${demo.notes || "none"}`
            )
            .join("\n")
        : "No demos currently loaded.";

    const offerContext =
      offers.length > 0
        ? offers
            .slice(0, 30)
            .map(
              (offer) =>
                `${offer.name} |
Type: ${offer.offer_type || "not set"} |
Price: ${offer.price || "not set"} |
Status: ${offer.status || "not set"} |
Description: ${offer.description || "none"}`
            )
            .join("\n")
        : "No offers currently loaded.";

    const knowledgeContext =
      knowledge.length > 0
        ? knowledge
            .slice(0, 30)
            .map(
              (item) =>
                `${item.category} | ${item.title}: ${item.content}`
            )
            .join("\n")
        : "No permanent knowledge currently loaded.";

    const thoughtContext =
      thoughts.length > 0
        ? thoughts
            .slice(0, 20)
            .map(
              (thought) =>
                `${thought.title || "Untitled"}: ${
                  thought.content
                }`
            )
            .join("\n")
        : "No recent Alfred memory currently loaded.";

    const conversationContext =
      messages.length > 0
        ? messages
            .slice(-8)
            .map(
              (message) =>
                `${
                  message.role === "user"
                    ? "Joash"
                    : "Alfred"
                }: ${message.content}`
            )
            .join("\n\n")
        : "No earlier conversation in this session.";

    return `
ALFRED V3 OPERATING CONTEXT

Current UK date and time:
${currentDateTime}

ROLE UPDATE

You are Alfred, Mediahubink's Sales, Strategy and Operating Chief of Staff.

You are not primarily an editorial assistant.

Your job is to help decide:
- what matters now
- what should happen next
- who needs following up
- what is stopping the next sale
- which commercial opportunity deserves attention
- which strategic relationship deserves attention
- what should remain parked

CURRENT MARKET STRUCTURE

United Kingdom:
Core commercial market.

Namibia:
Active AI market-entry market.
Treat Namibia as a first-class strategic market, not as a generic SADC category.

Other African and international markets:
Only prioritise where there is real evidence, an existing relationship or a specific opportunity.

IMPORTANT DISTINCTION

Separate:
1. UK commercial sales and revenue activity
2. Namibia AI market-entry, strategic relationships, pilots and institutional development

Do not treat every Namibia relationship as a normal sales lead.

CURRENT CAMPAIGNS

${campaignContext}

CURRENT PRODUCT AND PROOF-ASSET REGISTRY

${productContext}

LIVE CRM

${leadContext}

LIVE PROJECTS

${projectContext}

LIVE DEMOS

${demoContext}

LIVE OFFERS

${offerContext}

PERMANENT KNOWLEDGE

${knowledgeContext}

RECENT ALFRED MEMORY

${thoughtContext}

RECENT COMMAND CENTRE CONVERSATION

${conversationContext}

OPERATING RULES

- British English only.
- No em dashes.
- Be concise, practical and commercially useful.
- Do not invent CRM activity, meetings, responses or commitments.
- If data is missing, say so.
- Prefer completing follow-ups over endlessly creating new prospect lists.
- Prefer conversations over passive content activity when revenue is the objective.
- Do not recommend building another demo unless it solves a specific active commercial or market-entry need.
- UK sales and Namibia market entry can both be active, but they serve different objectives.
- For daily planning, respect an evening working window of roughly 7:30 pm to 11:30 pm when relevant.
- When asked what to do next, give a clear priority rather than a long menu of possibilities.
`;
  }

  async function askAlfred(question?: string) {
    const actualPrompt = (question ?? prompt).trim();

    if (!actualPrompt || loading) {
      return;
    }

    stopSpeaking();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: actualPrompt,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setPrompt("");
    setLoading(true);

    const fullPrompt = `
${buildBusinessContext()}

CURRENT REQUEST FROM JOASH

${actualPrompt}

Respond as Alfred.

Do not repeat all the loaded context back to Joash.
Use it to make a decision, recommendation, briefing or answer.
`;

    try {
      const response = await fetch("/api/alfred", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
        }),
      });

      const data = await response.json();

      const answer =
        data.reply ||
        data.error ||
        "I could not produce a response. Check Alfred's API connection.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: answer,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);

      if (autoSpeak && data.reply) {
        speak(answer);
      }
    } catch {
      const answer =
        "Something went wrong while speaking to Alfred. Check the Vercel logs or API connection.";

      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: answer,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function startSpeech() {
    const speechWindow = window as SpeechWindow;

    const SpeechRecognition =
      speechWindow.SpeechRecognition ||
      speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessages((current) => [
        ...current,
        {
          id: `speech-error-${Date.now()}`,
          role: "assistant",
          content:
            "Speech input is not supported in this browser. Chrome on your Windows laptop should normally support it.",
        },
      ]);

      return;
    }

    stopSpeaking();

    const speech = new SpeechRecognition();

    speech.continuous = false;
    speech.interimResults = false;
    speech.lang = "en-GB";

    speech.onresult = (
      event: SpeechRecognitionEvent
    ) => {
      let transcript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      const cleanedTranscript = transcript.trim();

      if (cleanedTranscript) {
        setPrompt(cleanedTranscript);
        askAlfred(cleanedTranscript);
      }
    };

    speech.onerror = () => {
      setIsListening(false);
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

  function clearConversation() {
    stopSpeaking();
    setMessages([]);
    setPrompt("");
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
      askAlfred();
    }
  }

  const primaryCampaign =
    defaultCampaigns.find(
      (campaign) => campaign.primary
    ) || defaultCampaigns[0];

  const namibiaCampaign =
    defaultCampaigns.find(
      (campaign) =>
        campaign.market === "Namibia"
    );

  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo">
            <div className="logo-title">
              Alfred
            </div>

            <div className="logo-subtitle">
              Mediahubink Sales, Strategy & Operating
              Chief of Staff
            </div>
          </div>

          <div className="nav-pill">
            Command Centre V3
          </div>
        </nav>

        <section className="hero">
          <div className="card">
            <div className="kicker">
              Alfred Command Centre
            </div>

            <h1>
              What needs your attention now?
            </h1>

            <p className="lead">
              Ask Alfred for your briefing, sales
              priorities, Namibia market-entry actions
              or tonight&apos;s plan. Speak naturally or
              type your instruction.
            </p>

            <div
              className="mode-grid"
              style={{ marginTop: "20px" }}
            >
              <div className="mode">
                <strong>
                  Primary commercial campaign
                </strong>

                <span>
                  {primaryCampaign?.name ||
                    "Not configured"}
                </span>

                <span>
                  {primaryCampaign?.objective || ""}
                </span>
              </div>

              <div className="mode">
                <strong>
                  Strategic market entry
                </strong>

                <span>
                  {namibiaCampaign?.name ||
                    "Not configured"}
                </span>

                <span>
                  {namibiaCampaign?.objective ||
                    ""}
                </span>
              </div>

              <div className="mode">
                <strong>Live context</strong>

                <span>
                  {leads.length} leads ·{" "}
                  {projects.length} projects ·{" "}
                  {products.length} registered assets
                </span>

                <span>{contextMessage}</span>
              </div>
            </div>

            <div
              className="actions"
              style={{ marginTop: "20px" }}
            >
              <a
                className="btn btn-secondary"
                href="/"
              >
                Mission Control
              </a>

              <a
                className="btn btn-secondary"
                href="/daily-briefing"
              >
                Daily Briefing Page
              </a>

              <button
                className="btn btn-secondary"
                onClick={loadContext}
                disabled={contextLoading}
              >
                {contextLoading
                  ? "Refreshing..."
                  : "Refresh business context"}
              </button>
            </div>

            <p
              style={{
                color: "#a3a3a3",
                marginTop: "14px",
                fontSize: "14px",
              }}
            >
              UK time: {currentDateTime}
            </p>
          </div>

          <div className="card">
            <div className="panel-title">
              Speak to Alfred
            </div>

            <textarea
              className="input-box"
              value={prompt}
              onChange={(event) =>
                setPrompt(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Example: Alfred, give me my briefing and tell me what I should do first tonight."
            />

            <div
              className="actions"
              style={{ marginTop: "16px" }}
            >
              <button
                className="btn"
                onClick={() => askAlfred()}
                disabled={
                  loading ||
                  contextLoading ||
                  !prompt.trim()
                }
              >
                {loading
                  ? "Alfred is thinking..."
                  : "Ask Alfred"}
              </button>

              {!isListening ? (
                <button
                  className="btn btn-secondary"
                  onClick={startSpeech}
                  disabled={
                    loading || contextLoading
                  }
                >
                  🎙️ Speak to Alfred
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={stopSpeech}
                >
                  ⏹ Stop listening
                </button>
              )}

              {isSpeaking ? (
                <button
                  className="btn btn-secondary"
                  onClick={stopSpeaking}
                >
                  🔇 Stop Alfred
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setAutoSpeak(!autoSpeak)
                  }
                >
                  {autoSpeak
                    ? "🔊 Voice replies on"
                    : "🔈 Voice replies off"}
                </button>
              )}

              <button
                className="btn btn-secondary"
                onClick={clearConversation}
              >
                Clear conversation
              </button>
            </div>

            <p
              style={{
                color: "#a3a3a3",
                marginTop: "12px",
                fontSize: "13px",
              }}
            >
              Tip: Ctrl + Enter sends a typed
              request. Speaking sends automatically.
            </p>
          </div>
        </section>

        <section
          className="card"
          style={{ marginTop: "28px" }}
        >
          <div className="panel-title">
            Quick directions
          </div>

          <p
            className="lead"
            style={{ fontSize: "16px" }}
          >
            These are not generic prompts. Alfred
            receives your live CRM, projects, demos,
            offers, knowledge, portfolio and campaign
            context before answering.
          </p>

          <div
            className="mode-grid"
            style={{ marginTop: "18px" }}
          >
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="mode"
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                }}
                onClick={() =>
                  askAlfred(action.prompt)
                }
                disabled={
                  loading || contextLoading
                }
              >
                <strong>
                  {action.label}
                </strong>

                <span>
                  Ask Alfred using live operating
                  data.
                </span>
              </button>
            ))}
          </div>
        </section>

        <section
          className="card"
          style={{ marginTop: "28px" }}
        >
          <div className="panel-title">
            Conversation
          </div>

          {messages.length === 0 ? (
            <div
              className="mode"
              style={{ marginTop: "16px" }}
            >
              <strong>
                Alfred is ready.
              </strong>

              <span>
                Try: Alfred, give me my daily
                briefing.
              </span>
            </div>
          ) : (
            <div style={{ marginTop: "18px" }}>
              {messages.map((message) => (
                <div
                  className="mode"
                  key={message.id}
                  style={{
                    marginBottom: "14px",
                  }}
                >
                  <strong>
                    {message.role === "user"
                      ? "You"
                      : "Alfred"}
                  </strong>

                  {message.role ===
                  "assistant" ? (
                    <div className="markdown-output">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span>
                      {message.content}
                    </span>
                  )}
                </div>
              ))}

              {loading && (
                <div
                  className="mode"
                  style={{
                    marginBottom: "14px",
                  }}
                >
                  <strong>Alfred</strong>

                  <span>
                    Reviewing your current operating
                    picture...
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        <section
          className="card"
          style={{ marginTop: "28px" }}
        >
          <div className="panel-title">
            What Alfred currently knows
          </div>

          <div
            className="section"
            style={{ marginTop: "18px" }}
          >
            <div className="mini-card">
              <h3>CRM leads</h3>
              <p>{leads.length}</p>
            </div>

            <div className="mini-card">
              <h3>Projects</h3>
              <p>{projects.length}</p>
            </div>

            <div className="mini-card">
              <h3>Demos</h3>
              <p>{demos.length}</p>
            </div>

            <div className="mini-card">
              <h3>Offers</h3>
              <p>{offers.length}</p>
            </div>

            <div className="mini-card">
              <h3>Knowledge records</h3>
              <p>{knowledge.length}</p>
            </div>

            <div className="mini-card">
              <h3>Memory records</h3>
              <p>{thoughts.length}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
