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

type AlfredMode = "ask" | "command";

type ParsedCommand = {
  action: "update_lead" | "none";
  company_search: string;
  summary: string;
  changes: {
    stage?: string | null;
    next_action?: string | null;
    next_action_date?: string | null;
    activity_note?: string | null;
  };
};

type PendingLeadCommand = {
  lead: Lead;
  summary: string;
  stage?: string | null;
  nextAction?: string | null;
  nextActionDate?: string | null;
  activityNote?: string | null;
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

const validStages = [
  "new",
  "contacted",
  "discovery",
  "demo-interest",
  "proposal-sent",
  "negotiation",
  "relationship-building",
  "won",
  "lost",
];

export default function AlfredCommandCentrePage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const [alfredMode, setAlfredMode] =
    useState<AlfredMode>("ask");

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
  const [voiceStatus, setVoiceStatus] =
    useState("Voice ready.");

  const [pendingCommand, setPendingCommand] =
    useState<PendingLeadCommand | null>(null);

  const [commandSaving, setCommandSaving] =
    useState(false);

  const [commandMessage, setCommandMessage] =
    useState("");

  const currentDateTime = new Date().toLocaleString(
    "en-GB",
    {
      timeZone: "Europe/London",
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const currentDateISO = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(new Date());

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
    setContextMessage(
      "Loading Alfred's business context..."
    );

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
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, ". ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function speak(text: string) {
    if (typeof window === "undefined") {
      return;
    }

    if (!("speechSynthesis" in window)) {
      setVoiceStatus(
        "Spoken replies are not supported by this browser."
      );
      return;
    }

    const cleanedText = cleanForSpeech(text);

    if (!cleanedText) {
      setVoiceStatus("There is nothing to read aloud.");
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const utterance =
      new SpeechSynthesisUtterance(cleanedText);

    utterance.lang = "en-GB";
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices =
      window.speechSynthesis.getVoices();

    const britishVoice =
      voices.find(
        (voice) =>
          voice.lang.toLowerCase() === "en-gb"
      ) ||
      voices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en")
      );

    if (britishVoice) {
      utterance.voice = britishVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus("Alfred is speaking...");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus("Voice ready.");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setVoiceStatus(
        "Automatic playback was blocked. Tap Hear Alfred on the reply."
      );
    };

    window.speechSynthesis.speak(utterance);
  }

  function testVoice() {
    speak(
      "Alfred is ready. If you can hear this, spoken replies are working."
    );
  }

  function stopSpeaking() {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    setVoiceStatus("Voice stopped.");
  }

  function getLastAssistantReply() {
    const assistantMessages = messages.filter(
      (message) => message.role === "assistant"
    );

    if (assistantMessages.length === 0) {
      return "";
    }

    return assistantMessages[
      assistantMessages.length - 1
    ].content;
  }

  function hearLastReply() {
    const reply = getLastAssistantReply();

    if (!reply) {
      setVoiceStatus(
        "Alfred has not given a reply yet."
      );
      return;
    }

    speak(reply);
  }

  function buildLeadContext() {
    if (leads.length === 0) {
      return "No CRM leads currently loaded.";
    }

    return leads
      .slice(0, 60)
      .map(
        (lead) =>
          `ID: ${lead.id}
Company: ${lead.company || "Not added"}
Contact: ${lead.name || "Not added"}
Industry: ${lead.industry || "Not added"}
Region: ${lead.region || "Not added"}
Stage: ${lead.stage || "new"}
Solution: ${lead.solution || "Not decided"}
Next action: ${lead.next_action || "none"}
Next action date: ${
            lead.next_action_date ||
            lead.follow_up_date ||
            "none"
          }
Notes: ${lead.notes || "none"}`
      )
      .join("\n\n");
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
Objective: ${campaign.objective}`
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
URL: ${product.url}`
      )
      .join("\n\n");

    const projectContext =
      projects.length > 0
        ? projects
            .slice(0, 40)
            .map(
              (project) =>
                `${project.name} |
Category: ${
                  project.category || "not set"
                } |
Audience: ${
                  project.audience || "not set"
                } |
Status: ${project.status || "not set"} |
URL: ${project.url || "none"}`
            )
            .join("\n")
        : "No projects currently loaded.";

    const demoContext =
      demos.length > 0
        ? demos
            .slice(0, 30)
            .map(
              (demo) =>
                `${demo.vertical}: ${demo.demo_url}`
            )
            .join("\n")
        : "No demos currently loaded.";

    const offerContext =
      offers.length > 0
        ? offers
            .slice(0, 30)
            .map(
              (offer) =>
                `${offer.name} | ${
                  offer.price || "not set"
                } | ${
                  offer.description || "none"
                }`
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
        : "No permanent knowledge loaded.";

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
        : "No recent Alfred memory loaded.";

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
        : "No earlier conversation.";

    return `
ALFRED V3 OPERATING CONTEXT

Current UK date and time:
${currentDateTime}

United Kingdom is the core commercial market.

Namibia is an active AI market-entry market and must be treated separately from generic SADC activity.

CURRENT CAMPAIGNS

${campaignContext}

PRODUCT AND PROOF-ASSET REGISTRY

${productContext}

LIVE CRM

${buildLeadContext()}

LIVE PROJECTS

${projectContext}

LIVE DEMOS

${demoContext}

LIVE OFFERS

${offerContext}

PERMANENT KNOWLEDGE

${knowledgeContext}

RECENT MEMORY

${thoughtContext}

RECENT CONVERSATION

${conversationContext}

OPERATING RULES

- British English only.
- No em dashes.
- Do not invent CRM activity.
- Prefer follow-ups and conversations when revenue is the objective.
- Do not recommend unnecessary building.
- UK commercial sales and Namibia market entry are separate operating tracks.
- Give a clear priority when asked what to do next.
`;
  }

  function parseJsonReply(raw: string) {
    const cleaned = raw
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");

      if (
        firstBrace !== -1 &&
        lastBrace > firstBrace
      ) {
        try {
          return JSON.parse(
            cleaned.slice(firstBrace, lastBrace + 1)
          );
        } catch {
          return null;
        }
      }

      return null;
    }
  }

  function findLead(search: string) {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) {
      return [];
    }

    const exact = leads.filter((lead) => {
      const company =
        lead.company?.toLowerCase() || "";
      const name = lead.name?.toLowerCase() || "";

      return company === term || name === term;
    });

    if (exact.length > 0) {
      return exact;
    }

    return leads.filter((lead) => {
      const company =
        lead.company?.toLowerCase() || "";
      const name = lead.name?.toLowerCase() || "";

      return (
        company.includes(term) ||
        term.includes(company) ||
        name.includes(term)
      );
    });
  }

  function validateDate(value?: string | null) {
    if (!value) {
      return null;
    }

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      return value;
    }

    return null;
  }

  async function interpretCommand(
    instruction: string
  ) {
    setLoading(true);
    setCommandMessage("");
    setPendingCommand(null);

    const commandPrompt = `
You are Alfred's CRM command interpreter.

Current UK date:
${currentDateISO}

Current UK date and time:
${currentDateTime}

CRM RECORDS:

${buildLeadContext()}

USER COMMAND:

${instruction}

Determine whether this is a request to UPDATE AN EXISTING CRM LEAD.

For now, supported changes are only:
- stage
- next_action
- next_action_date
- activity_note

Do not create records.
Do not delete records.
Do not change money values.
Do not change contact details.

When the user says things such as:
"I emailed PHC today"
record that as activity_note.

When the user says:
"call them Thursday"
convert Thursday to an exact YYYY-MM-DD date relative to the current UK date.

Use these exact CRM stage values only:
${validStages.join(", ")}

Return ONLY valid JSON.

Return this exact structure:

{
  "action": "update_lead",
  "company_search": "company or contact phrase",
  "summary": "short human-readable description",
  "changes": {
    "stage": null,
    "next_action": null,
    "next_action_date": null,
    "activity_note": null
  }
}

If this is not an existing-lead update, return:

{
  "action": "none",
  "company_search": "",
  "summary": "This command is not yet supported.",
  "changes": {}
}

Never claim the database has already been updated.
`;

    try {
      const response = await fetch("/api/alfred", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: commandPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.reply) {
        setCommandMessage(
          data.error ||
            "Alfred could not interpret that command."
        );
        return;
      }

      const parsed = parseJsonReply(
        data.reply
      ) as ParsedCommand | null;

      if (
        !parsed ||
        parsed.action !== "update_lead"
      ) {
        setCommandMessage(
          parsed?.summary ||
            "That command is not supported yet."
        );
        return;
      }

      const matches = findLead(
        parsed.company_search
      );

      if (matches.length === 0) {
        setCommandMessage(
          `I could not confidently match "${parsed.company_search}" to an existing CRM lead. No changes have been made.`
        );
        return;
      }

      if (matches.length > 1) {
        setCommandMessage(
          `I found more than one possible CRM match for "${parsed.company_search}". No changes have been made. Please use the full company name.`
        );
        return;
      }

      const lead = matches[0];

      const proposedStage =
        parsed.changes.stage &&
        validStages.includes(
          parsed.changes.stage
        )
          ? parsed.changes.stage
          : null;

      const proposedDate = validateDate(
        parsed.changes.next_action_date
      );

      setPendingCommand({
        lead,
        summary: parsed.summary,
        stage: proposedStage,
        nextAction:
          parsed.changes.next_action || null,
        nextActionDate: proposedDate,
        activityNote:
          parsed.changes.activity_note || null,
      });

      setCommandMessage(
        "Review the proposed CRM update below. Nothing has been changed yet."
      );
    } catch {
      setCommandMessage(
        "Something went wrong while Alfred interpreted the command."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatActivityNote(
    note: string
  ) {
    return `${currentDateISO}: ${note.trim()}`;
  }

  async function confirmCommand() {
    if (!pendingCommand) {
      return;
    }

    setCommandSaving(true);
    setCommandMessage("");

    const lead = pendingCommand.lead;

    const newNotes =
      pendingCommand.activityNote
        ? [
            lead.notes?.trim(),
            formatActivityNote(
              pendingCommand.activityNote
            ),
          ]
            .filter(Boolean)
            .join("\n")
        : lead.notes || "";

    const newStage =
      pendingCommand.stage ||
      lead.stage ||
      "new";

    const newNextAction =
      pendingCommand.nextAction ??
      lead.next_action ??
      "";

    const newNextActionDate =
      pendingCommand.nextActionDate ??
      lead.next_action_date ??
      lead.follow_up_date ??
      null;

    try {
      const response = await fetch(
        `/api/leads/${lead.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: lead.name,
            company: lead.company,
            email: lead.email,
            phone: lead.phone,
            industry: lead.industry,
            source: lead.source,
            interest: lead.interest,
            solution:
              lead.solution || "Not decided",
            stage: newStage,
            notes: newNotes,
            follow_up_date:
              newNextActionDate,
            estimated_value:
              lead.estimated_value,
            monthly_value:
              lead.monthly_value,
            score: lead.score,
            lead_score: lead.lead_score,
            next_action: newNextAction,
            next_action_date:
              newNextActionDate,
            region: lead.region,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setCommandMessage(
          data.error ||
            "The CRM update could not be saved."
        );
        return;
      }

      const confirmation = `${
        lead.company ||
        lead.name ||
        "CRM record"
      } updated successfully.`;

      setCommandMessage(confirmation);
      setPendingCommand(null);

      setMessages((current) => [
        ...current,
        {
          id: `command-success-${Date.now()}`,
          role: "assistant",
          content: confirmation,
        },
      ]);

      await loadContext();

      if (autoSpeak) {
        speak(confirmation);
      }
    } catch {
      setCommandMessage(
        "Something went wrong while saving the CRM update."
      );
    } finally {
      setCommandSaving(false);
    }
  }

  function cancelCommand() {
    setPendingCommand(null);
    setCommandMessage(
      "CRM update cancelled. No changes were made."
    );
  }

  async function askAlfred(
    question?: string
  ) {
    const actualPrompt = (
      question ?? prompt
    ).trim();

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

    if (alfredMode === "command") {
      await interpretCommand(actualPrompt);
      return;
    }

    setLoading(true);

    const fullPrompt = `
${buildBusinessContext()}

CURRENT REQUEST FROM JOASH

${actualPrompt}

Respond as Alfred.

Do not repeat all the loaded context.
Use it to make a decision, recommendation, briefing or answer.
`;

    try {
      const response = await fetch(
        "/api/alfred",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            prompt: fullPrompt,
          }),
        }
      );

      const data = await response.json();

      const answer =
        data.reply ||
        data.error ||
        "I could not produce a response.";

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: answer,
        },
      ]);

      if (autoSpeak && data.reply) {
        setTimeout(() => {
          speak(answer);
        }, 100);
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "Something went wrong while speaking to Alfred.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function startSpeech() {
    const speechWindow =
      window as SpeechWindow;

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
            "Speech input is not supported in this browser.",
        },
      ]);

      return;
    }

    stopSpeaking();

    const speech =
      new SpeechRecognition();

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

      const cleanedTranscript =
        transcript.trim();

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
    setPendingCommand(null);
    setCommandMessage("");
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
              Mediahubink Sales, Strategy &
              Operating Chief of Staff
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
              Ask Alfred for guidance or switch to
              Command Mode when you want Alfred to
              prepare a CRM change.
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
                  {primaryCampaign?.name}
                </span>
                <span>
                  {primaryCampaign?.objective}
                </span>
              </div>

              <div className="mode">
                <strong>
                  Strategic market entry
                </strong>
                <span>
                  {namibiaCampaign?.name}
                </span>
                <span>
                  {namibiaCampaign?.objective}
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
              Talk to Alfred
            </div>

            <div
              className="actions"
              style={{
                marginTop: "14px",
                marginBottom: "16px",
              }}
            >
              <button
                className={
                  alfredMode === "ask"
                    ? "btn"
                    : "btn btn-secondary"
                }
                onClick={() => {
                  setAlfredMode("ask");
                  setPendingCommand(null);
                  setCommandMessage("");
                }}
              >
                Ask Mode
              </button>

              <button
                className={
                  alfredMode === "command"
                    ? "btn"
                    : "btn btn-secondary"
                }
                onClick={() => {
                  setAlfredMode("command");
                  setCommandMessage("");
                }}
              >
                Command Mode
              </button>
            </div>

            <div className="mode">
              <strong>
                {alfredMode === "ask"
                  ? "Ask Mode"
                  : "Command Mode"}
              </strong>

              <span>
                {alfredMode === "ask"
                  ? "Ask for briefings, priorities, analysis and recommendations."
                  : "Tell Alfred what happened. Alfred will prepare a CRM update and wait for your confirmation."}
              </span>
            </div>

            <textarea
              className="input-box"
              style={{ marginTop: "16px" }}
              value={prompt}
              onChange={(event) =>
                setPrompt(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder={
                alfredMode === "ask"
                  ? "Example: Alfred, give me my briefing and tell me what I should do first."
                  : "Example: I emailed PHC today. Set the next action to call them tomorrow and move them to Contacted."
              }
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
                  ? "Alfred is working..."
                  : alfredMode === "command"
                    ? "Prepare update"
                    : "Ask Alfred"}
              </button>

              {!isListening ? (
                <button
                  className="btn btn-secondary"
                  onClick={startSpeech}
                  disabled={
                    loading ||
                    contextLoading
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

              <button
                className="btn btn-secondary"
                onClick={testVoice}
              >
                🔊 Test voice
              </button>

              <button
                className="btn btn-secondary"
                onClick={hearLastReply}
              >
                ▶️ Hear last reply
              </button>

              {isSpeaking && (
                <button
                  className="btn btn-secondary"
                  onClick={stopSpeaking}
                >
                  🔇 Stop Alfred
                </button>
              )}

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setAutoSpeak(!autoSpeak)
                }
              >
                {autoSpeak
                  ? "🔊 Auto voice on"
                  : "🔈 Auto voice off"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={clearConversation}
              >
                Clear
              </button>
            </div>

            <div
              className="mode"
              style={{ marginTop: "14px" }}
            >
              <strong>Voice status</strong>
              <span>{voiceStatus}</span>
            </div>
          </div>
        </section>

        {alfredMode === "command" && (
          <section
            className="card"
            style={{ marginTop: "28px" }}
          >
            <div className="panel-title">
              Command approval
            </div>

            {commandMessage && (
              <div
                className="mode"
                style={{ marginTop: "16px" }}
              >
                <strong>Status</strong>
                <span>{commandMessage}</span>
              </div>
            )}

            {!pendingCommand ? (
              <div
                className="mode"
                style={{ marginTop: "16px" }}
              >
                <strong>
                  No pending CRM change
                </strong>
                <span>
                  Speak or type an instruction above.
                </span>
              </div>
            ) : (
              <div
                className="mode"
                style={{ marginTop: "16px" }}
              >
                <strong>
                  Proposed CRM update
                </strong>

                <span>
                  Company:{" "}
                  {pendingCommand.lead.company ||
                    pendingCommand.lead.name}
                </span>

                <span>
                  {pendingCommand.summary}
                </span>

                {pendingCommand.stage && (
                  <span>
                    Stage:{" "}
                    {pendingCommand.lead.stage ||
                      "new"}{" "}
                    → {pendingCommand.stage}
                  </span>
                )}

                {pendingCommand.nextAction && (
                  <span>
                    Next action:{" "}
                    {pendingCommand.nextAction}
                  </span>
                )}

                {pendingCommand.nextActionDate && (
                  <span>
                    Due:{" "}
                    {pendingCommand.nextActionDate}
                  </span>
                )}

                {pendingCommand.activityNote && (
                  <span>
                    Activity note:{" "}
                    {pendingCommand.activityNote}
                  </span>
                )}

                <div
                  className="actions"
                  style={{ marginTop: "16px" }}
                >
                  <button
                    className="btn"
                    onClick={confirmCommand}
                    disabled={commandSaving}
                  >
                    {commandSaving
                      ? "Saving..."
                      : "Confirm update"}
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={cancelCommand}
                    disabled={commandSaving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {alfredMode === "ask" && (
          <section
            className="card"
            style={{ marginTop: "28px" }}
          >
            <div className="panel-title">
              Quick directions
            </div>

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
                    loading ||
                    contextLoading
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
        )}

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
                Ask a question or give Alfred a
                command.
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
                    <>
                      <div className="markdown-output">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                      </div>

                      <div
                        className="actions"
                        style={{
                          marginTop: "12px",
                        }}
                      >
                        <button
                          className="btn btn-secondary"
                          onClick={() =>
                            speak(
                              message.content
                            )
                          }
                        >
                          🔊 Hear Alfred
                        </button>
                      </div>
                    </>
                  ) : (
                    <span>
                      {message.content}
                    </span>
                  )}
                </div>
              ))}
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
              <h3>Knowledge</h3>
              <p>{knowledge.length}</p>
            </div>

            <div className="mini-card">
              <h3>Memory</h3>
              <p>{thoughts.length}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
