"use client";

import { useEffect, useRef, useState } from "react";
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

type SolutionAsset = {
  id: string;
  name: string;
  slug: string;
  url: string;
  family?: string | null;
  asset_type?: string | null;
  markets?: string[] | null;
  sectors?: string[] | null;
  use_cases?: string[] | null;
  commercial_status?: string | null;
  description?: string | null;
  best_used_for?: string | null;
  related_products?: string[] | null;
  notes?: string | null;
  is_active?: boolean | null;
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

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  spokenContent?: string;
};

type AlfredMode = "ask" | "command";

type VoiceMode = "natural" | "device" | "silent";

type BedtimeMode = "normal" | "wind-down" | "stop";

type ParsedCommand = {
  action: "lead_command" | "none";
  company_search: string;
  summary: string;
  interaction: {
    should_record?: boolean;
    occurred_on?: string | null;
    contact_name?: string | null;
    channel?: string | null;
    direction?: string | null;
    outcome?: string | null;
    summary?: string | null;
  };
  changes: {
    stage?: string | null;
    next_action?: string | null;
    next_action_date?: string | null;
  };
};

type PendingLeadCommand = {
  lead: Lead;
  summary: string;
  shouldRecordInteraction: boolean;
  occurredOn?: string | null;
  contactName?: string | null;
  channel?: string | null;
  direction?: string | null;
  outcome?: string | null;
  interactionSummary?: string | null;
  stage?: string | null;
  nextAction?: string | null;
  nextActionDate?: string | null;
};

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

const validChannels = [
  "email",
  "phone",
  "linkedin",
  "whatsapp",
  "meeting",
  "demo",
  "website",
  "other",
];

const validDirections = [
  "outbound",
  "inbound",
];

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

Use interaction history as well as the current CRM state.

Do not invent activity that is not present in the loaded data.`,
  },
  {
    label: "What should I do next?",
    prompt: `Review my current leads, interaction history, campaigns, projects, opportunities and strategic activity.

Tell me the single best action to take next.

Explain briefly why it outranks everything else.

Prefer advancing existing conversations and overdue follow-ups before creating unnecessary new work.`,
  },
  {
    label: "Sales follow-ups",
    prompt: `Review my CRM and interaction history.

Identify the sales follow-ups that deserve attention now.

For each important one, tell me:
- company
- most recent interaction
- current situation
- why it matters
- best next channel
- recommended next action

Prioritise real conversations over generic prospecting.`,
  },
  {
    label: "Tonight's plan",
    prompt: `Build my practical work plan for tonight from 7:30 pm, with focused work ending by 10:30 pm UK time so I can wind down and stop for bed between 10:30 pm and 11:00 pm.

Use my live Alfred data and interaction history.

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
- recent interactions
- possible pilot opportunities
- outstanding relationship actions

Tell me what would genuinely advance market entry next.`,
  },
  {
    label: "Review pipeline",
    prompt: `Review my commercial pipeline and interaction history as Alfred, my operating chief of staff.

Tell me:
- strongest opportunities
- stalled opportunities
- recent contact activity
- follow-ups due
- likely distractions
- where pipeline value is concentrated
- what I should do to create the next genuine sales conversation.`,
  },
  {
    label: "What am I neglecting?",
    prompt: `Look across my leads, interaction history, projects, campaigns, follow-ups and strategic activity.

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

function getLondonDateISO() {
  const parts = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(new Date());

  const year =
    parts.find(
      (part) => part.type === "year"
    )?.value || "";

  const month =
    parts.find(
      (part) => part.type === "month"
    )?.value || "";

  const day =
    parts.find(
      (part) => part.type === "day"
    )?.value || "";

  return `${year}-${month}-${day}`;
}

function formatDateOnly(
  value?: string | null
) {
  if (!value) {
    return "Not set";
  }

  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (!match) {
    return value;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  return date.toLocaleDateString(
    "en-GB",
    {
      timeZone: "UTC",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function capitalise(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return value
    .split(/[\s-]+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function getLondonClockParts() {
  const now = new Date();

  const parts = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }
  ).formatToParts(now);

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  const year = value("year");
  const month = value("month");
  const day = value("day");
  const hour = Number(value("hour"));
  const minute = Number(value("minute"));

  return {
    hour,
    minute,
    dateISO: `${year}-${month}-${day}`,
  };
}

function getGreetingText(hour: number) {
  if (hour >= 5 && hour < 12) {
    return "Good morning, Joash.";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon, Joash.";
  }

  if (hour >= 17 && hour < 22) {
    return "Good evening, Joash.";
  }

  return "Good night, Joash.";
}

function getBedtimeMode(
  hour: number,
  minute: number
): BedtimeMode {
  if (hour === 22 && minute >= 30) {
    return "wind-down";
  }

  if (hour >= 23 || hour < 5) {
    return "stop";
  }

  return "normal";
}

function getBedtimeReminder(
  mode: BedtimeMode
) {
  if (mode === "wind-down") {
    return "It is time to stop for tonight, save your work and get ready for bed.";
  }

  if (mode === "stop") {
    return "It is past your cut-off. That is enough for tonight. Save your work and go to bed. We can pick this up tomorrow.";
  }

  return "";
}

function getBedtimePromptRule() {
  const { hour, minute } =
    getLondonClockParts();

  const mode = getBedtimeMode(
    hour,
    minute
  );

  if (mode === "wind-down") {
    return `It is between 22:30 and 23:00 UK time. Remind Joash clearly to stop working and go to bed. Do not give him a new evening work block. You may help him finish a tiny action, record a CRM interaction, capture an idea, or state the first task for tomorrow.`;
  }

  if (mode === "stop") {
    return `It is after Joash's nightly cut-off. Be firm but warm: tell him to stop working and go to bed. Do not encourage a new project, build, research session or extended task. Only help with something genuinely urgent, a quick capture, or a short CRM update. Otherwise state the first task for tomorrow and stop.`;
  }

  return `Normal operating hours. If planning tonight, schedule focused work to finish by 22:30 UK time so Joash can wind down and go to bed.`;
}

export default function AlfredCommandCentrePage() {
  const [prompt, setPrompt] =
    useState("");

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [alfredMode, setAlfredMode] =
    useState<AlfredMode>("ask");

  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [solutionAssets, setSolutionAssets] =
    useState<SolutionAsset[]>([]);

  const [demos, setDemos] =
    useState<Demo[]>([]);

  const [offers, setOffers] =
    useState<Offer[]>([]);

  const [knowledge, setKnowledge] =
    useState<Knowledge[]>([]);

  const [thoughts, setThoughts] =
    useState<Thought[]>([]);

  const [interactions, setInteractions] =
    useState<Interaction[]>([]);

  const [
    contextLoading,
    setContextLoading,
  ] = useState(true);

  const [
    contextMessage,
    setContextMessage,
  ] = useState(
    "Loading Alfred's business context..."
  );

  const [
    isListening,
    setIsListening,
  ] = useState(false);

  const [
    recognition,
    setRecognition,
  ] =
    useState<SpeechRecognitionType | null>(
      null
    );

  const recognitionRef =
    useRef<SpeechRecognitionType | null>(
      null
    );

  const heldTranscriptRef =
    useRef("");

  const holdActiveRef =
    useRef(false);

  const speechSubmittedRef =
    useRef(false);

  const [autoSpeak, setAutoSpeak] =
    useState(true);

  const [voiceMode, setVoiceMode] =
    useState<VoiceMode>("natural");

  const naturalAudioRef =
    useRef<HTMLAudioElement | null>(null);

  const naturalAudioUrlRef =
    useRef<string>("");

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const naturalSourceRef =
    useRef<AudioBufferSourceNode | null>(
      null
    );

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [voiceStatus, setVoiceStatus] =
    useState("Alfred Natural ready.");

  const [
    pendingCommand,
    setPendingCommand,
  ] =
    useState<PendingLeadCommand | null>(
      null
    );

  const [
    commandSaving,
    setCommandSaving,
  ] = useState(false);

  const [
    commandMessage,
    setCommandMessage,
  ] = useState("");

  const [currentNow, setCurrentNow] =
    useState(() => new Date());

  const currentDateISO =
    getLondonDateISO();

  const currentDateTime =
    currentNow.toLocaleString("en-GB", {
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

  async function loadInteractionHistory(
    loadedLeads: Lead[]
  ) {
    if (loadedLeads.length === 0) {
      setInteractions([]);
      return [];
    }

    try {
      const results = await Promise.all(
        loadedLeads
          .slice(0, 50)
          .map(async (lead) => {
            const data = await fetchJson(
              `/api/leads/${lead.id}/interactions`
            );

            return Array.isArray(
              data?.interactions
            )
              ? data.interactions
              : [];
          })
      );

      const combined =
        results.flat() as Interaction[];

      combined.sort((a, b) => {
        const aTime = new Date(
          a.occurred_at ||
            a.created_at ||
            0
        ).getTime();

        const bTime = new Date(
          b.occurred_at ||
            b.created_at ||
            0
        ).getTime();

        return bTime - aTime;
      });

      setInteractions(combined);

      return combined;
    } catch {
      setInteractions([]);
      return [];
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
      assetData,
    ] = await Promise.all([
      fetchJson("/api/leads/list"),
      fetchJson("/api/projects/list"),
      fetchJson("/api/demos/list"),
      fetchJson("/api/offers/list"),
      fetchJson(
        "/api/knowledge/list"
      ),
      fetchJson("/api/thoughts/list"),
      fetchJson(
        "/api/assets?active_only=true"
      ),
    ]);

    const loadedLeads =
      leadData?.leads || [];

    setLeads(loadedLeads);
    setProjects(
      projectData?.projects || []
    );
    setDemos(demoData?.demos || []);
    setOffers(offerData?.offers || []);
    setKnowledge(
      knowledgeData?.knowledge || []
    );
    setThoughts(
      thoughtData?.thoughts || []
    );

    setSolutionAssets(
      assetData?.assets || []
    );

    const loadedInteractions =
      await loadInteractionHistory(
        loadedLeads
      );

    setContextLoading(false);

    setContextMessage(
      `Business context loaded. ${loadedInteractions.length} interactions available.`
    );
  }

  useEffect(() => {
    loadContext();
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(
      "alfred_voice_mode"
    );

    if (
      saved === "natural" ||
      saved === "device" ||
      saved === "silent"
    ) {
      setVoiceMode(saved);

      if (saved === "silent") {
        setAutoSpeak(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentNow(new Date());
    }, 30000);

    return () =>
      window.clearInterval(timer);
  }, []);

  function cleanForSpeech(
    text: string
  ) {
    return text
      .replace(/[#*_`>]/g, "")
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        "$1"
      )
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, ". ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function trimSpeechText(text: string) {
    const cleaned = cleanForSpeech(text);

    if (cleaned.length <= 4500) {
      return cleaned;
    }

    const shortened = cleaned.slice(0, 4500);
    const lastStop = Math.max(
      shortened.lastIndexOf(". "),
      shortened.lastIndexOf("! "),
      shortened.lastIndexOf("? ")
    );

    if (lastStop > 3200) {
      return shortened.slice(0, lastStop + 1);
    }

    return `${shortened}...`;
  }

  function buildFallbackSpokenReply(
    text: string
  ) {
    const cleaned =
      cleanForSpeech(text);

    if (!cleaned) {
      return "";
    }

    const withoutDraft =
      cleaned
        .split(
          /(?:subject:|email draft:|draft email:)/i
        )[0]
        .trim();

    const source =
      withoutDraft || cleaned;

    const sentences =
      source.match(
        /[^.!?]+[.!?]+|[^.!?]+$/g
      ) || [source];

    let spoken = "";

    for (const sentence of sentences) {
      const candidate =
        `${spoken} ${sentence}`
          .replace(/\s{2,}/g, " ")
          .trim();

      if (
        candidate.length > 420 &&
        spoken
      ) {
        break;
      }

      spoken = candidate;

      if (
        spoken.length >= 180 ||
        spoken.split(/\s+/).length >= 48
      ) {
        break;
      }
    }

    if (!spoken) {
      spoken = source.slice(0, 420);
    }

    return spoken.trim();
  }

  function parseAlfredVoiceReply(
    raw: string
  ) {
    const voiceMatch = raw.match(
      /\[\[VOICE\]\]([\s\S]*?)\[\[\/VOICE\]\]/i
    );

    const answerMatch = raw.match(
      /\[\[ANSWER\]\]([\s\S]*?)\[\[\/ANSWER\]\]/i
    );

    const written =
      answerMatch?.[1]?.trim() ||
      raw
        .replace(
          /\[\[VOICE\]\][\s\S]*?\[\[\/VOICE\]\]/gi,
          ""
        )
        .replace(
          /\[\[\/?ANSWER\]\]/gi,
          ""
        )
        .trim();

    const spoken =
      voiceMatch?.[1]?.trim() ||
      buildFallbackSpokenReply(
        written
      );

    return {
      written:
        written ||
        "I could not produce a response.",
      spoken:
        spoken ||
        buildFallbackSpokenReply(
          written
        ),
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

    const { hour, minute, dateISO } =
      getLondonClockParts();

    const greetingPending =
      window.sessionStorage.getItem(
        "alfred_greeting_spoken"
      ) !== "yes";

    const bedtimeMode = getBedtimeMode(
      hour,
      minute
    );

    const bedtimeKey =
      `alfred_bedtime_${dateISO}`;

    const bedtimePending =
      bedtimeMode !== "normal" &&
      window.sessionStorage.getItem(
        bedtimeKey
      ) !== "yes";

    const parts: string[] = [];

    if (greetingPending) {
      parts.push(
        getGreetingText(hour)
      );
    }

    if (bedtimePending) {
      parts.push(
        getBedtimeReminder(
          bedtimeMode
        )
      );
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
    if (typeof window === "undefined") {
      return;
    }

    if (intro.greetingPending) {
      window.sessionStorage.setItem(
        "alfred_greeting_spoken",
        "yes"
      );
    }

    if (
      intro.bedtimePending &&
      intro.bedtimeKey
    ) {
      window.sessionStorage.setItem(
        intro.bedtimeKey,
        "yes"
      );
    }
  }

  function buildSpokenText(
    text: string,
    intro: ReturnType<typeof getVoiceIntro>
  ) {
    const body = trimSpeechText(text);

    if (!intro.text) {
      return body;
    }

    return trimSpeechText(
      `${intro.text} ${body}`
    );
  }

  function releaseNaturalAudio() {
    if (naturalSourceRef.current) {
      try {
        naturalSourceRef.current.stop();
      } catch {
        // Source may already have ended.
      }

      naturalSourceRef.current = null;
    }

    if (naturalAudioRef.current) {
      naturalAudioRef.current.pause();
      naturalAudioRef.current = null;
    }

    if (naturalAudioUrlRef.current) {
      URL.revokeObjectURL(
        naturalAudioUrlRef.current
      );
      naturalAudioUrlRef.current = "";
    }
  }

  async function unlockNaturalVoice() {
    if (
      typeof window === "undefined" ||
      voiceMode !== "natural"
    ) {
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current =
          new AudioContext();
      }

      if (
        audioContextRef.current.state ===
        "suspended"
      ) {
        await audioContextRef.current.resume();
      }
    } catch {
      // HTMLAudio and device voice remain available as fallbacks.
    }
  }

  function deviceSpeak(
    text: string,
    introOverride?: ReturnType<typeof getVoiceIntro>
  ) {
    if (typeof window === "undefined") {
      return;
    }

    if (!("speechSynthesis" in window)) {
      setVoiceStatus(
        "Device voice is not supported by this browser."
      );
      return;
    }

    const intro =
      introOverride || getVoiceIntro();

    const spokenText = buildSpokenText(
      text,
      intro
    );

    if (!spokenText) {
      setVoiceStatus(
        "There is nothing to read aloud."
      );
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const utterance =
      new SpeechSynthesisUtterance(
        spokenText
      );

    utterance.lang = "en-GB";
    utterance.rate = 1.05;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices =
      window.speechSynthesis.getVoices();

    const britishVoice =
      voices.find(
        (voice) =>
          voice.lang.toLowerCase() ===
          "en-gb"
      ) ||
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .startsWith("en")
      );

    if (britishVoice) {
      utterance.voice = britishVoice;
    }

    utterance.onstart = () => {
      markVoiceIntroSpoken(intro);
      setIsSpeaking(true);
      setVoiceStatus(
        "Alfred is speaking with the device voice..."
      );
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus(
        voiceMode === "natural"
          ? "Alfred Natural ready."
          : "Device voice ready."
      );
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setVoiceStatus(
        "Playback was blocked. Tap Hear Alfred on the reply."
      );
    };

    window.speechSynthesis.speak(
      utterance
    );
  }

  async function naturalSpeak(
    text: string
  ) {
    const intro = getVoiceIntro();
    const spokenText = buildSpokenText(
      text,
      intro
    );

    if (!spokenText) {
      setVoiceStatus(
        "There is nothing to read aloud."
      );
      return;
    }

    releaseNaturalAudio();

    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setVoiceStatus(
      "Preparing Alfred Natural..."
    );

    try {
      const response = await fetch(
        "/api/voice",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            text: spokenText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Natural voice generation failed."
        );
      }

      const blob = await response.blob();

      const context =
        audioContextRef.current;

      if (
        context &&
        context.state === "running"
      ) {
        const arrayBuffer =
          await blob.arrayBuffer();

        const audioBuffer =
          await context.decodeAudioData(
            arrayBuffer.slice(0)
          );

        const source =
          context.createBufferSource();

        source.buffer = audioBuffer;
        source.connect(
          context.destination
        );

        naturalSourceRef.current =
          source;

        source.onended = () => {
          naturalSourceRef.current =
            null;
          setIsSpeaking(false);
          setVoiceStatus(
            "Alfred Natural ready."
          );
        };

        markVoiceIntroSpoken(intro);
        setIsSpeaking(true);
        setVoiceStatus(
          "Alfred Natural is speaking..."
        );

        source.start(0);
        return;
      }

      const url =
        URL.createObjectURL(blob);

      const audio = new Audio(url);

      audio.preload = "auto";
      audio.setAttribute(
        "playsinline",
        "true"
      );

      naturalAudioRef.current = audio;
      naturalAudioUrlRef.current =
        url;

      audio.onplay = () => {
        markVoiceIntroSpoken(intro);
        setIsSpeaking(true);
        setVoiceStatus(
          "Alfred Natural is speaking..."
        );
      };

      audio.onended = () => {
        setIsSpeaking(false);
        setVoiceStatus(
          "Alfred Natural ready."
        );
        releaseNaturalAudio();
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setVoiceStatus(
          "Natural voice playback failed. Using device voice."
        );
        releaseNaturalAudio();
        deviceSpeak(text, intro);
      };

      try {
        await audio.play();
      } catch {
        setIsSpeaking(false);
        setVoiceStatus(
          "iPhone blocked automatic playback. Tap Hear Alfred once to unlock natural voice."
        );
      }
    } catch {
      setVoiceStatus(
        "Alfred Natural is unavailable. Using device voice."
      );
      deviceSpeak(text, intro);
    }
  }

  async function speak(text: string) {
    if (voiceMode === "silent") {
      setVoiceStatus(
        "Silent mode is on."
      );
      return;
    }

    if (voiceMode === "device") {
      deviceSpeak(text);
      return;
    }

    await naturalSpeak(text);
  }

  function chooseVoiceMode(
    mode: VoiceMode
  ) {
    stopSpeaking();
    setVoiceMode(mode);

    window.localStorage.setItem(
      "alfred_voice_mode",
      mode
    );

    if (mode === "silent") {
      setAutoSpeak(false);
      setVoiceStatus(
        "Silent mode is on."
      );
      return;
    }

    setAutoSpeak(true);

    if (mode === "natural") {
      void unlockNaturalVoice();
    }

    setVoiceStatus(
      mode === "natural"
        ? "Alfred Natural ready."
        : "Device voice ready."
    );
  }

  async function testVoice() {
    if (voiceMode === "silent") {
      setVoiceStatus(
        "Select Alfred Natural or Device Voice to test speech."
      );
      return;
    }

    await unlockNaturalVoice();

    await speak(
      "Alfred is ready. Voice, memory and command systems are available."
    );
  }

  function stopSpeaking() {
    releaseNaturalAudio();

    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    setVoiceStatus(
      voiceMode === "natural"
        ? "Alfred Natural ready."
        : voiceMode === "device"
          ? "Device voice ready."
          : "Silent mode is on."
    );
  }

  function getLastAssistantReply() {
    const assistantMessages =
      messages.filter(
        (message) =>
          message.role === "assistant"
      );

    if (
      assistantMessages.length === 0
    ) {
      return null;
    }

    return assistantMessages[
      assistantMessages.length - 1
    ];
  }

  async function hearLastReply() {
    const reply =
      getLastAssistantReply();

    if (!reply) {
      setVoiceStatus(
        "Alfred has not given a reply yet."
      );
      return;
    }

    await unlockNaturalVoice();
    await speak(
      reply.spokenContent ||
      reply.content
    );
  }

  function interactionsForLead(
    leadId: string
  ) {
    return interactions.filter(
      (interaction) =>
        interaction.lead_id ===
        leadId
    );
  }

  function buildLeadContext() {
    if (leads.length === 0) {
      return "No CRM leads currently loaded.";
    }

    return leads
      .slice(0, 60)
      .map((lead) => {
        const recent =
          interactionsForLead(
            lead.id
          ).slice(0, 5);

        const interactionText =
          recent.length > 0
            ? recent
                .map(
                  (
                    interaction
                  ) =>
                    `${interaction.occurred_at || interaction.created_at || "Unknown date"} | ${interaction.channel || "other"} | ${interaction.direction || "unknown"} | ${interaction.outcome || "No outcome"} | ${interaction.summary || "No summary"} | Next: ${interaction.next_action || "none"} | Due: ${interaction.next_action_date || "none"}`
                )
                .join("\n")
            : "No interaction history.";

        return `ID: ${lead.id}
Company: ${lead.company || "Not added"}
Contact: ${lead.name || "Not added"}
Industry: ${lead.industry || "Not added"}
Region: ${lead.region || "Not added"}
Stage: ${lead.stage || "new"}
Solution: ${lead.solution || "Not decided"}
Monthly value: £${lead.monthly_value ?? lead.estimated_value ?? 0}
Priority: ${lead.priority || "not set"}
Last contacted: ${lead.last_contacted || "not recorded"}
Next action: ${lead.next_action || "none"}
Next action date: ${lead.next_action_date || lead.follow_up_date || "none"}

Recent interaction history:
${interactionText}`;
      })
      .join("\n\n");
  }

  function buildBusinessContext() {
    const campaignContext =
      defaultCampaigns
        .map(
          (campaign) =>
            `${campaign.name}
Type: ${campaign.type}
Status: ${campaign.status}
Primary: ${
              campaign.primary
                ? "Yes"
                : "No"
            }
Market: ${campaign.market}
Sectors: ${campaign.sectors.join(", ")}
Products: ${campaign.products.join(", ")}
Objective: ${campaign.objective}`
        )
        .join("\n\n");

    const productContext =
      solutionAssets.length > 0
        ? solutionAssets
            .map(
              (asset) =>
                `${asset.name}
Family: ${asset.family || "not set"}
Type: ${asset.asset_type || "asset"}
Markets: ${(asset.markets || []).join(", ") || "none"}
Sectors: ${(asset.sectors || []).join(", ") || "none"}
Commercial status: ${asset.commercial_status || "not set"}
Use cases: ${(asset.use_cases || []).join(", ") || "none"}
Best used for: ${asset.best_used_for || "not set"}
URL: ${asset.url}`
            )
            .join("\n\n")
        : products
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
Category: ${project.category || "not set"} |
Audience: ${project.audience || "not set"} |
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
                `${offer.name} | ${offer.price || "not set"} | ${offer.description || "none"}`
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
                `${thought.title || "Untitled"}: ${thought.content}`
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
                  message.role ===
                  "user"
                    ? "Joash"
                    : "Alfred"
                }: ${
                  message.content
                }`
            )
            .join("\n\n")
        : "No earlier conversation.";

    return `
ALFRED V3 OPERATING CONTEXT

Current UK date and time:
${currentDateTime}

ROLE

You are Alfred, Mediahubink's Sales, Strategy and Operating Chief of Staff.

United Kingdom is the core commercial market.

Namibia is an active AI market-entry market and must be treated separately from generic SADC activity.

CURRENT CAMPAIGNS

${campaignContext}

PRODUCT AND PROOF-ASSET REGISTRY

${productContext}

LIVE CRM AND INTERACTION HISTORY

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
- Do not invent CRM activity, interactions, meetings or responses.
- Treat stored interaction history as factual activity.
- Prefer follow-ups and conversations when revenue is the objective.
- Do not recommend unnecessary building.
- UK commercial sales and Namibia market entry are separate operating tracks.
- Give a clear priority when asked what to do next.
- Use actual contact history when recommending the next channel.
- If email and LinkedIn have already been attempted, consider whether phone is the stronger unused channel.
- If a prospect has been contacted repeatedly without engagement, say when nurture or stopping pursuit is more sensible.
- Do not put a time-of-day greeting in the written answer. The voice layer handles the personal greeting once per session.

TIME AND BEDTIME RULE

${getBedtimePromptRule()}
`;
  }

  function parseJsonReply(
    raw: string
  ) {
    const cleaned = raw
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const firstBrace =
        cleaned.indexOf("{");

      const lastBrace =
        cleaned.lastIndexOf("}");

      if (
        firstBrace !== -1 &&
        lastBrace > firstBrace
      ) {
        try {
          return JSON.parse(
            cleaned.slice(
              firstBrace,
              lastBrace + 1
            )
          );
        } catch {
          return null;
        }
      }

      return null;
    }
  }

  function findLead(
    search: string
  ) {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) {
      return [];
    }

    const exact = leads.filter(
      (lead) => {
        const company =
          lead.company
            ?.trim()
            .toLowerCase() || "";

        const name =
          lead.name
            ?.trim()
            .toLowerCase() || "";

        return (
          (company &&
            company === term) ||
          (name && name === term)
        );
      }
    );

    if (exact.length > 0) {
      return exact;
    }

    return leads.filter((lead) => {
      const company =
        lead.company
          ?.trim()
          .toLowerCase() || "";

      const name =
        lead.name
          ?.trim()
          .toLowerCase() || "";

      const companyMatch =
        company &&
        (company.includes(term) ||
          term.includes(company));

      const nameMatch =
        name &&
        (name.includes(term) ||
          term.includes(name));

      return Boolean(
        companyMatch ||
          nameMatch
      );
    });
  }

  function validateDate(
    value?: string | null
  ) {
    if (!value) {
      return null;
    }

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        value
      )
    ) {
      return value;
    }

    return null;
  }

  function validateChannel(
    value?: string | null
  ) {
    if (!value) {
      return "other";
    }

    const cleaned =
      value.toLowerCase();

    return validChannels.includes(
      cleaned
    )
      ? cleaned
      : "other";
  }

  function validateDirection(
    value?: string | null
  ) {
    if (!value) {
      return "outbound";
    }

    const cleaned =
      value.toLowerCase();

    return validDirections.includes(
      cleaned
    )
      ? cleaned
      : "outbound";
  }

  async function interpretCommand(
    instruction: string
  ) {
    setLoading(true);
    setCommandMessage("");
    setPendingCommand(null);

    const commandPrompt = `
You are Alfred's CRM and interaction-history command interpreter.

Current UK date:
${currentDateISO}

Current UK date and time:
${currentDateTime}

CRM RECORDS AND RECENT INTERACTIONS:

${buildLeadContext()}

USER COMMAND:

${instruction}

Your job is to determine whether the user wants to:

1. record a real interaction with an existing CRM lead
2. update an existing CRM lead without recording an interaction
3. do something not yet supported

Examples of interactions:

- "I emailed PHC today."
- "I called Andy at BizSpace but he didn't answer."
- "I left Regan a voicemail."
- "They replied and want more information."
- "I sent him a LinkedIn message."
- "We had a meeting and they want a demo."
- "She called me back."
- "I sent the proposal this afternoon."

Supported interaction channels:

email
phone
linkedin
whatsapp
meeting
demo
website
other

Supported directions:

outbound
inbound

For a real interaction:
interaction.should_record must be true.

For a pure CRM instruction such as:
"Set BizSpace next action to phone call Friday"
interaction.should_record must be false.

Supported CRM changes:

- stage
- next_action
- next_action_date

Use these exact stage values only:

${validStages.join(", ")}

DATE RULES

The current UK date is ${currentDateISO}.

Convert relative dates such as:
today
tomorrow
Friday
next Monday
in three days

into exact YYYY-MM-DD dates.

If the interaction happened today, set occurred_on to ${currentDateISO}.

If the user explicitly says yesterday or another date, resolve it to an exact YYYY-MM-DD date.

INTERACTION SUMMARY RULE

Write a factual short summary of what happened.

Examples:

"Follow-up email sent."
"Called Andy Payne. No answer and voicemail left."
"Inbound reply received requesting more information."
"Discovery meeting completed. Prospect interested in a demonstration."

Do not embellish.

OUTCOME RULE

Use a short factual outcome where possible, for example:

Sent
No answer
Voicemail left
Replied
Interested
Demo requested
Meeting completed
Awaiting response

CONTACT RULE

Use the named person when the user says one or when the CRM record clearly supplies the relevant person.

Never invent a contact.

Return ONLY valid JSON.

Use this exact structure:

{
  "action": "lead_command",
  "company_search": "company or contact phrase",
  "summary": "short explanation of what Alfred proposes",
  "interaction": {
    "should_record": true,
    "occurred_on": "YYYY-MM-DD",
    "contact_name": null,
    "channel": "phone",
    "direction": "outbound",
    "outcome": "Voicemail left",
    "summary": "Called contact. No answer and voicemail left."
  },
  "changes": {
    "stage": null,
    "next_action": "Follow up by phone",
    "next_action_date": "YYYY-MM-DD"
  }
}

For a pure CRM update, set:

"should_record": false

and leave interaction fields null.

If the request is unsupported, return:

{
  "action": "none",
  "company_search": "",
  "summary": "This command is not yet supported.",
  "interaction": {
    "should_record": false,
    "occurred_on": null,
    "contact_name": null,
    "channel": null,
    "direction": null,
    "outcome": null,
    "summary": null
  },
  "changes": {
    "stage": null,
    "next_action": null,
    "next_action_date": null
  }
}

Never claim anything has already been saved.

Never create a new company.

Never delete anything.

Never alter contact details or financial values.
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
            prompt: commandPrompt,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.reply
      ) {
        setCommandMessage(
          data.error ||
            "Alfred could not interpret that command."
        );
        return;
      }

      const parsed =
        parseJsonReply(
          data.reply
        ) as ParsedCommand | null;

      if (
        !parsed ||
        parsed.action !==
          "lead_command"
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

      if (
        matches.length === 0
      ) {
        setCommandMessage(
          `I could not confidently match "${parsed.company_search}" to an existing CRM lead. Nothing has been changed.`
        );
        return;
      }

      if (
        matches.length > 1
      ) {
        setCommandMessage(
          `I found more than one possible CRM match for "${parsed.company_search}". Nothing has been changed. Please use the full company name.`
        );
        return;
      }

      const lead = matches[0];

      const proposedStage =
        parsed.changes?.stage &&
        validStages.includes(
          parsed.changes.stage
        )
          ? parsed.changes
              .stage
          : null;

      const proposedDate =
        validateDate(
          parsed.changes
            ?.next_action_date
        );

      const shouldRecord =
        parsed.interaction
          ?.should_record === true;

      const occurredOn =
        shouldRecord
          ? validateDate(
              parsed.interaction
                ?.occurred_on
            ) ||
            currentDateISO
          : null;

      setPendingCommand({
        lead,
        summary:
          parsed.summary ||
          "Review the proposed update.",
        shouldRecordInteraction:
          shouldRecord,
        occurredOn,
        contactName:
          parsed.interaction
            ?.contact_name ||
          lead.name ||
          null,
        channel: shouldRecord
          ? validateChannel(
              parsed.interaction
                ?.channel
            )
          : null,
        direction: shouldRecord
          ? validateDirection(
              parsed.interaction
                ?.direction
            )
          : null,
        outcome:
          parsed.interaction
            ?.outcome || null,
        interactionSummary:
          parsed.interaction
            ?.summary || null,
        stage: proposedStage,
        nextAction:
          parsed.changes
            ?.next_action ||
          null,
        nextActionDate:
          proposedDate,
      });

      setCommandMessage(
        shouldRecord
          ? "Review the proposed interaction and CRM update below. Nothing has been changed yet."
          : "Review the proposed CRM update below. Nothing has been changed yet."
      );
    } catch {
      setCommandMessage(
        "Something went wrong while Alfred interpreted the command."
      );
    } finally {
      setLoading(false);
    }
  }

  function buildOccurredAt(
    occurredOn?: string | null
  ) {
    if (!occurredOn) {
      return new Date().toISOString();
    }

    if (
      occurredOn ===
      currentDateISO
    ) {
      return new Date().toISOString();
    }

    return `${occurredOn}T12:00:00.000Z`;
  }

  async function savePureLeadUpdate(
    pending: PendingLeadCommand
  ) {
    const lead =
      pending.lead;

    const response = await fetch(
      `/api/leads/${lead.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          industry:
            lead.industry,
          source: lead.source,
          interest:
            lead.interest,
          solution:
            lead.solution ||
            "Not decided",
          stage:
            pending.stage ||
            lead.stage ||
            "new",
          notes:
            lead.notes,
          follow_up_date:
            pending.nextActionDate ??
            lead.follow_up_date ??
            lead.next_action_date ??
            null,
          estimated_value:
            lead.estimated_value,
          monthly_value:
            lead.monthly_value,
          score: lead.score,
          lead_score:
            lead.lead_score,
          next_action:
            pending.nextAction ??
            lead.next_action ??
            null,
          next_action_date:
            pending.nextActionDate ??
            lead.next_action_date ??
            lead.follow_up_date ??
            null,
          region: lead.region,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "The CRM update could not be saved."
      );
    }

    return data;
  }

  async function saveInteraction(
    pending: PendingLeadCommand
  ) {
    const lead =
      pending.lead;

    const response = await fetch(
      `/api/leads/${lead.id}/interactions`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          occurred_at:
            buildOccurredAt(
              pending.occurredOn
            ),
          contact_name:
            pending.contactName,
          channel:
            pending.channel ||
            "other",
          direction:
            pending.direction ||
            "outbound",
          outcome:
            pending.outcome,
          summary:
            pending.interactionSummary ||
            pending.summary,
          next_action:
            pending.nextAction,
          next_action_date:
            pending.nextActionDate,
          stage:
            pending.stage,
          source:
            "alfred-command",
          mark_contacted: true,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "The interaction could not be saved."
      );
    }

    return data;
  }

  async function confirmCommand() {
    if (!pendingCommand) {
      return;
    }

    void unlockNaturalVoice();
    setCommandSaving(true);
    setCommandMessage("");

    try {
      if (
        pendingCommand
          .shouldRecordInteraction
      ) {
        await saveInteraction(
          pendingCommand
        );
      } else {
        await savePureLeadUpdate(
          pendingCommand
        );
      }

      const label =
        pendingCommand.lead
          .company ||
        pendingCommand.lead
          .name ||
        "CRM record";

      const confirmation =
        pendingCommand
          .shouldRecordInteraction
          ? `${label} interaction recorded and CRM updated successfully.`
          : `${label} CRM updated successfully.`;

      setCommandMessage(
        confirmation
      );

      setMessages(
        (current) => [
          ...current,
          {
            id: `command-success-${Date.now()}`,
            role: "assistant",
            content:
              confirmation,
          },
        ]
      );

      setPendingCommand(null);

      await loadContext();

      if (autoSpeak) {
        speak(confirmation);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the update.";

      setCommandMessage(message);
    } finally {
      setCommandSaving(false);
    }
  }

  function cancelCommand() {
    setPendingCommand(null);

    setCommandMessage(
      "Update cancelled. Nothing was changed."
    );
  }

  async function askAlfred(
    question?: string
  ) {
    const actualPrompt = (
      question ?? prompt
    ).trim();

    if (
      !actualPrompt ||
      loading
    ) {
      return;
    }

    void unlockNaturalVoice();
    stopSpeaking();

    const userMessage: ChatMessage =
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: actualPrompt,
      };

    setMessages(
      (current) => [
        ...current,
        userMessage,
      ]
    );

    setPrompt("");

    if (
      alfredMode ===
      "command"
    ) {
      await interpretCommand(
        actualPrompt
      );
      return;
    }

    setLoading(true);

    const fullPrompt = `
${buildBusinessContext()}

CURRENT REQUEST FROM JOASH

${actualPrompt}

Respond as Alfred.

Do not repeat all the loaded context.

Use the CRM and interaction history to make a decision, recommendation, briefing or answer.

When discussing a specific company, distinguish between:
- what the CRM currently says
- what actually happened in recent interactions
- what should happen next

TIME GUARDRAIL
${getBedtimePromptRule()}

Do not start the written response with Good morning, Good afternoon, Good evening or Good night. The voice layer handles the personal greeting.

VOICE RESPONSE FORMAT

Return every Ask Mode answer in exactly this structure:

[[VOICE]]
A short spoken reply for Alfred Natural.
[[/VOICE]]

[[ANSWER]]
The full useful written answer.
[[/ANSWER]]

VOICE RULES

- The VOICE section must normally be 1 to 3 short conversational sentences.
- Keep the VOICE section to a maximum of about 55 words.
- Lead with the decision, recommendation or answer.
- Include the single next action when one exists.
- Do not read email drafts, long lists, URLs, detailed evidence or lengthy reasoning aloud.
- If the written answer contains a draft message or email, briefly say that the draft is on screen instead of reading it.
- Make the spoken reply sound like a calm chief of staff speaking naturally, not like a report being read.
- If the bedtime guardrail is active, the VOICE section must prioritise the stop-work instruction.
- The ANSWER section should contain the complete written answer in normal Markdown.
- Do not put the personal greeting in either section. The voice layer handles it.

Do not invent activity.
`;

    try {
      const response =
        await fetch(
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

      const data =
        await response.json();

      const rawAnswer =
        data.reply ||
        data.error ||
        "I could not produce a response.";

      const parsedAnswer =
        parseAlfredVoiceReply(
          rawAnswer
        );

      setMessages(
        (current) => [
          ...current,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content:
              parsedAnswer.written,
            spokenContent:
              parsedAnswer.spoken,
          },
        ]
      );

      if (
        autoSpeak &&
        data.reply
      ) {
        setTimeout(() => {
          speak(
            parsedAnswer.spoken
          );
        }, 100);
      }
    } catch {
      setMessages(
        (current) => [
          ...current,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            content:
              "Something went wrong while speaking to Alfred.",
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }

  function submitHeldSpeech() {
    if (speechSubmittedRef.current) {
      return;
    }

    const cleanedTranscript =
      heldTranscriptRef.current
        .replace(/\s{2,}/g, " ")
        .trim();

    if (!cleanedTranscript) {
      setVoiceStatus(
        "I didn't catch that. Press and hold the microphone while you speak."
      );
      return;
    }

    speechSubmittedRef.current = true;

    setPrompt(cleanedTranscript);

    void askAlfred(
      cleanedTranscript
    );
  }

  function startSpeech() {
    if (
      loading ||
      contextLoading ||
      isListening
    ) {
      return;
    }

    void unlockNaturalVoice();

    const speechWindow =
      window as SpeechWindow;

    const SpeechRecognition =
      speechWindow.SpeechRecognition ||
      speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessages(
        (current) => [
          ...current,
          {
            id: `speech-error-${Date.now()}`,
            role: "assistant",
            content:
              "Speech input is not supported in this browser.",
          },
        ]
      );

      return;
    }

    stopSpeaking();

    heldTranscriptRef.current = "";
    speechSubmittedRef.current = false;
    holdActiveRef.current = true;

    const speech =
      new SpeechRecognition();

    speech.continuous = true;
    speech.interimResults = false;
    speech.lang = "en-GB";

    speech.onresult = (
      event: SpeechRecognitionEvent
    ) => {
      let transcript = "";

      for (
        let i = 0;
        i <
        event.results.length;
        i++
      ) {
        transcript +=
          `${event.results[i][0].transcript} `;
      }

      const cleanedTranscript =
        transcript
          .replace(/\s{2,}/g, " ")
          .trim();

      heldTranscriptRef.current =
        cleanedTranscript;

      if (cleanedTranscript) {
        setPrompt(
          cleanedTranscript
        );
      }
    };

    speech.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
      setRecognition(null);

      if (!holdActiveRef.current) {
        submitHeldSpeech();
      }
    };

    speech.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      setRecognition(null);

      if (!holdActiveRef.current) {
        submitHeldSpeech();
      }
    };

    recognitionRef.current = speech;
    setRecognition(speech);
    setIsListening(true);

    setVoiceStatus(
      "Listening. Keep holding, then release to send."
    );

    try {
      speech.start();
    } catch {
      holdActiveRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
      setRecognition(null);
      setVoiceStatus(
        "The microphone could not start. Try pressing and holding again."
      );
    }
  }

  function stopSpeech() {
    holdActiveRef.current = false;

    const activeRecognition =
      recognitionRef.current ||
      recognition;

    if (activeRecognition) {
      try {
        activeRecognition.stop();
      } catch {
        submitHeldSpeech();
      }
    } else {
      setTimeout(() => {
        submitHeldSpeech();
      }, 50);
    }

    setIsListening(false);

    setVoiceStatus(
      "Sending that to Alfred..."
    );
  }

  function cancelSpeech() {
    holdActiveRef.current = false;
    speechSubmittedRef.current = true;

    const activeRecognition =
      recognitionRef.current ||
      recognition;

    if (activeRecognition) {
      try {
        activeRecognition.stop();
      } catch {
        // Nothing else to do.
      }
    }

    recognitionRef.current = null;
    setRecognition(null);
    setIsListening(false);
    heldTranscriptRef.current = "";

    setVoiceStatus(
      "Voice input cancelled."
    );
  }

  function handleTalkPointerDown(
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    if (
      loading ||
      contextLoading
    ) {
      return;
    }

    event.preventDefault();

    try {
      event.currentTarget.setPointerCapture(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }

    startSpeech();
  }

  function handleTalkPointerUp(
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    try {
      if (
        event.currentTarget.hasPointerCapture(
          event.pointerId
        )
      ) {
        event.currentTarget.releasePointerCapture(
          event.pointerId
        );
      }
    } catch {
      // Pointer capture is optional.
    }

    if (holdActiveRef.current) {
      stopSpeech();
    }
  }

  function handleTalkPointerCancel(
    event: React.PointerEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    cancelSpeech();
  }

  function clearConversation() {
    cancelSpeech();
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
      (event.ctrlKey ||
        event.metaKey)
    ) {
      event.preventDefault();
      askAlfred();
    }
  }

  function leadLabel(
    leadId: string
  ) {
    const lead = leads.find(
      (item) =>
        item.id === leadId
    );

    return (
      lead?.company ||
      lead?.name ||
      "Unknown lead"
    );
  }

  const primaryCampaign =
    defaultCampaigns.find(
      (campaign) =>
        campaign.primary
    ) ||
    defaultCampaigns[0];

  const namibiaCampaign =
    defaultCampaigns.find(
      (campaign) =>
        campaign.market ===
        "Namibia"
    );

  const recentInteractions =
    interactions.slice(0, 12);

  const londonClock =
    getLondonClockParts();

  const bedtimeMode =
    getBedtimeMode(
      londonClock.hour,
      londonClock.minute
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
              Mediahubink Sales,
              Strategy & Operating
              Chief of Staff
            </div>
          </div>

          <div className="nav-pill">
            Command Centre V3
          </div>
        </nav>

        {bedtimeMode !== "normal" && (
          <section
            className="card"
            style={{
              marginBottom: "28px",
              borderColor:
                "rgba(255, 184, 77, 0.28)",
            }}
          >
            <div className="kicker">
              Alfred bedtime reminder
            </div>

            <h2
              style={{
                marginTop: "8px",
                marginBottom: "8px",
              }}
            >
              {bedtimeMode === "wind-down"
                ? "Time to stop for tonight."
                : "That is enough for tonight."}
            </h2>

            <p
              className="lead"
              style={{ marginBottom: 0 }}
            >
              {getBedtimeReminder(
                bedtimeMode
              )}
            </p>
          </section>
        )}

        <section className="hero">
          <div className="card">
            <div className="kicker">
              Alfred Command
              Centre
            </div>

            <h1>
              What needs your
              attention now?
            </h1>

            <p className="lead">
              Ask Alfred for
              guidance or switch
              to Command Mode to
              record business
              activity and update
              the CRM.
            </p>

            <div
              className="mode-grid"
              style={{
                marginTop:
                  "20px",
              }}
            >
              <div className="mode">
                <strong>
                  Primary
                  commercial
                  campaign
                </strong>

                <span>
                  {
                    primaryCampaign?.name
                  }
                </span>

                <span>
                  {
                    primaryCampaign?.objective
                  }
                </span>
              </div>

              <div className="mode">
                <strong>
                  Strategic market
                  entry
                </strong>

                <span>
                  {
                    namibiaCampaign?.name
                  }
                </span>

                <span>
                  {
                    namibiaCampaign?.objective
                  }
                </span>
              </div>

              <div className="mode">
                <strong>
                  Live context
                </strong>

                <span>
                  {leads.length}{" "}
                  leads ·{" "}
                  {
                    interactions.length
                  }{" "}
                  interactions ·{" "}
                  {
                    projects.length
                  }{" "}
                  projects
                </span>

                <span>
                  {contextMessage}
                </span>
              </div>
            </div>

            <div
              className="actions"
              style={{
                marginTop:
                  "20px",
              }}
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
                Daily Briefing
              </a>

              <a
                className="btn btn-secondary"
                href="/asset-registry"
              >
                Asset Registry
              </a>

              <button
                className="btn btn-secondary"
                onClick={
                  loadContext
                }
                disabled={
                  contextLoading
                }
              >
                {contextLoading
                  ? "Refreshing..."
                  : "Refresh context"}
              </button>
            </div>

            <p
              style={{
                color:
                  "#a3a3a3",
                marginTop:
                  "14px",
                fontSize:
                  "14px",
              }}
            >
              UK time:{" "}
              {currentDateTime}
            </p>
          </div>

          <div className="card">
            <div className="panel-title">
              Talk to Alfred
            </div>

            <div
              className="actions"
              style={{
                marginTop:
                  "14px",
                marginBottom:
                  "16px",
              }}
            >
              <button
                className={
                  alfredMode ===
                  "ask"
                    ? "btn"
                    : "btn btn-secondary"
                }
                onClick={() => {
                  setAlfredMode(
                    "ask"
                  );
                  setPendingCommand(
                    null
                  );
                  setCommandMessage(
                    ""
                  );
                }}
              >
                Ask Mode
              </button>

              <button
                className={
                  alfredMode ===
                  "command"
                    ? "btn"
                    : "btn btn-secondary"
                }
                onClick={() => {
                  setAlfredMode(
                    "command"
                  );
                  setCommandMessage(
                    ""
                  );
                }}
              >
                Command Mode
              </button>
            </div>

            <div className="mode">
              <strong>
                {alfredMode ===
                "ask"
                  ? "Ask Mode"
                  : "Command Mode"}
              </strong>

              <span>
                {alfredMode ===
                "ask"
                  ? "Ask for briefings, priorities, company history, analysis and recommendations."
                  : "Tell Alfred what happened. Alfred will prepare the interaction and CRM changes, then wait for your approval."}
              </span>
            </div>

            <textarea
              className="input-box"
              style={{
                marginTop:
                  "16px",
              }}
              value={prompt}
              onChange={(
                event
              ) =>
                setPrompt(
                  event.target
                    .value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder={
                alfredMode ===
                "ask"
                  ? "Example: Alfred, what has happened with BizSpace and what should I do next?"
                  : "Example: I called Andy at BizSpace. He didn't answer, so I left a voicemail. Follow up Friday."
              }
            />

            <div
              className="actions"
              style={{
                marginTop:
                  "16px",
              }}
            >
              <button
                className="btn"
                onClick={() =>
                  askAlfred()
                }
                disabled={
                  loading ||
                  contextLoading ||
                  !prompt.trim()
                }
              >
                {loading
                  ? "Alfred is working..."
                  : alfredMode ===
                      "command"
                    ? "Prepare update"
                    : "Ask Alfred"}
              </button>

              <button
                className="btn btn-secondary"
                onPointerDown={
                  handleTalkPointerDown
                }
                onPointerUp={
                  handleTalkPointerUp
                }
                onPointerCancel={
                  handleTalkPointerCancel
                }
                onContextMenu={(
                  event
                ) =>
                  event.preventDefault()
                }
                disabled={
                  loading ||
                  contextLoading
                }
                aria-pressed={
                  isListening
                }
                style={{
                  touchAction:
                    "none",
                  userSelect:
                    "none",
                  WebkitUserSelect:
                    "none",
                  minWidth:
                    "190px",
                  transform:
                    isListening
                      ? "scale(0.98)"
                      : "none",
                  opacity:
                    loading ||
                    contextLoading
                      ? 0.6
                      : 1,
                }}
              >
                {isListening
                  ? "🎙️ Listening... release to send"
                  : "🎙️ Press & hold to talk"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={
                  testVoice
                }
              >
                🔊 Test voice
              </button>

              <button
                className="btn btn-secondary"
                onClick={
                  hearLastReply
                }
              >
                ▶️ Hear last
                reply
              </button>

              {isSpeaking && (
                <button
                  className="btn btn-secondary"
                  onClick={
                    stopSpeaking
                  }
                >
                  🔇 Stop Alfred
                </button>
              )}

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setAutoSpeak(
                    !autoSpeak
                  )
                }
              >
                {autoSpeak
                  ? "🔊 Auto replies on"
                  : "🔈 Auto replies off"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={
                  clearConversation
                }
              >
                Clear
              </button>
            </div>

            <div
              className="mode"
              style={{
                marginTop:
                  "14px",
              }}
            >
              <strong>
                Alfred voice
              </strong>

              <span>
                {voiceMode === "natural"
                  ? "Alfred Natural · ElevenLabs · default"
                  : voiceMode === "device"
                    ? "Device Voice · fallback"
                    : "Silent · no spoken replies"}
              </span>

              <div
                className="actions"
                style={{
                  marginTop: "12px",
                }}
              >
                <button
                  className={
                    voiceMode === "natural"
                      ? "btn"
                      : "btn btn-secondary"
                  }
                  onClick={() =>
                    chooseVoiceMode(
                      "natural"
                    )
                  }
                >
                  Alfred Natural
                </button>

                <button
                  className={
                    voiceMode === "device"
                      ? "btn"
                      : "btn btn-secondary"
                  }
                  onClick={() =>
                    chooseVoiceMode(
                      "device"
                    )
                  }
                >
                  Device Voice
                </button>

                <button
                  className={
                    voiceMode === "silent"
                      ? "btn"
                      : "btn btn-secondary"
                  }
                  onClick={() =>
                    chooseVoiceMode(
                      "silent"
                    )
                  }
                >
                  Silent
                </button>

                <a
                  className="btn btn-secondary"
                  href="/voice-lab"
                >
                  Voice Lab
                </a>
              </div>
            </div>

            <div
              className="mode"
              style={{
                marginTop:
                  "14px",
              }}
            >
              <strong>
                Voice input
              </strong>

              <span>
                Press and hold the
                microphone while you
                speak. Release it to
                send your words
                straight to Alfred.
              </span>
            </div>

            <div
              className="mode"
              style={{
                marginTop:
                  "14px",
              }}
            >
              <strong>
                Spoken replies
              </strong>

              <span>
                Alfred now speaks the
                short decision and
                next action. Full
                detail stays on screen.
              </span>
            </div>

            <div
              className="mode"
              style={{
                marginTop:
                  "14px",
              }}
            >
              <strong>
                Voice status
              </strong>

              <span>
                {voiceStatus}
              </span>

              <span>
                Alfred greets you once per session using UK time. From 22:30 he will tell you to stop and get ready for bed, and after 23:00 he will discourage further work unless it is genuinely urgent.
              </span>
            </div>
          </div>
        </section>

        {alfredMode ===
          "command" && (
          <section
            className="card"
            style={{
              marginTop:
                "28px",
            }}
          >
            <div className="panel-title">
              Command approval
            </div>

            {commandMessage && (
              <div
                className="mode"
                style={{
                  marginTop:
                    "16px",
                }}
              >
                <strong>
                  Status
                </strong>

                <span>
                  {
                    commandMessage
                  }
                </span>
              </div>
            )}

            {!pendingCommand ? (
              <div
                className="mode"
                style={{
                  marginTop:
                    "16px",
                }}
              >
                <strong>
                  No pending
                  change
                </strong>

                <span>
                  Speak or type
                  an instruction
                  above.
                </span>
              </div>
            ) : (
              <div
                className="mode"
                style={{
                  marginTop:
                    "16px",
                }}
              >
                <strong>
                  {pendingCommand.shouldRecordInteraction
                    ? "Proposed interaction & CRM update"
                    : "Proposed CRM update"}
                </strong>

                <span>
                  Company:{" "}
                  {pendingCommand
                    .lead
                    .company ||
                    pendingCommand
                      .lead.name}
                </span>

                <span>
                  {
                    pendingCommand.summary
                  }
                </span>

                {pendingCommand.shouldRecordInteraction && (
                  <>
                    <span>
                      Interaction
                      date:{" "}
                      {formatDateOnly(
                        pendingCommand.occurredOn
                      )}
                    </span>

                    <span>
                      Channel:{" "}
                      {capitalise(
                        pendingCommand.channel
                      )}
                    </span>

                    <span>
                      Direction:{" "}
                      {capitalise(
                        pendingCommand.direction
                      )}
                    </span>

                    {pendingCommand.contactName && (
                      <span>
                        Contact:{" "}
                        {
                          pendingCommand.contactName
                        }
                      </span>
                    )}

                    {pendingCommand.outcome && (
                      <span>
                        Outcome:{" "}
                        {
                          pendingCommand.outcome
                        }
                      </span>
                    )}

                    {pendingCommand.interactionSummary && (
                      <span>
                        Activity:{" "}
                        {
                          pendingCommand.interactionSummary
                        }
                      </span>
                    )}
                  </>
                )}

                {pendingCommand.stage && (
                  <span>
                    Stage:{" "}
                    {capitalise(
                      pendingCommand
                        .lead.stage ||
                        "new"
                    )}{" "}
                    →{" "}
                    {capitalise(
                      pendingCommand.stage
                    )}
                  </span>
                )}

                {pendingCommand.nextAction && (
                  <span>
                    Next action:{" "}
                    {
                      pendingCommand.nextAction
                    }
                  </span>
                )}

                {pendingCommand.nextActionDate && (
                  <span>
                    Due:{" "}
                    {formatDateOnly(
                      pendingCommand.nextActionDate
                    )}
                  </span>
                )}

                <div
                  className="actions"
                  style={{
                    marginTop:
                      "16px",
                  }}
                >
                  <button
                    className="btn"
                    onClick={
                      confirmCommand
                    }
                    disabled={
                      commandSaving
                    }
                  >
                    {commandSaving
                      ? "Saving..."
                      : pendingCommand.shouldRecordInteraction
                        ? "Confirm interaction & update"
                        : "Confirm update"}
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={
                      cancelCommand
                    }
                    disabled={
                      commandSaving
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {alfredMode ===
          "ask" && (
          <section
            className="card"
            style={{
              marginTop:
                "28px",
            }}
          >
            <div className="panel-title">
              Quick directions
            </div>

            <div
              className="mode-grid"
              style={{
                marginTop:
                  "18px",
              }}
            >
              {quickActions.map(
                (action) => (
                  <button
                    key={
                      action.label
                    }
                    className="mode"
                    style={{
                      textAlign:
                        "left",
                      cursor:
                        "pointer",
                    }}
                    onClick={() =>
                      askAlfred(
                        action.prompt
                      )
                    }
                    disabled={
                      loading ||
                      contextLoading
                    }
                  >
                    <strong>
                      {
                        action.label
                      }
                    </strong>

                    <span>
                      Ask Alfred
                      using live
                      operating
                      data.
                    </span>
                  </button>
                )
              )}
            </div>
          </section>
        )}

        <section
          className="card"
          style={{
            marginTop: "28px",
          }}
        >
          <div className="panel-title">
            Recent interactions
          </div>

          {recentInteractions.length ===
          0 ? (
            <div
              className="mode"
              style={{
                marginTop:
                  "16px",
              }}
            >
              <strong>
                No interaction
                history yet
              </strong>

              <span>
                Record a call,
                email, meeting or
                message through
                Command Mode.
              </span>
            </div>
          ) : (
            <div
              className="mode-grid"
              style={{
                marginTop:
                  "18px",
              }}
            >
              {recentInteractions.map(
                (
                  interaction
                ) => (
                  <div
                    className="mode"
                    key={
                      interaction.id
                    }
                  >
                    <strong>
                      {leadLabel(
                        interaction.lead_id
                      )}
                    </strong>

                    <span>
                      {formatDateOnly(
                        interaction.occurred_at ||
                          interaction.created_at
                      )}
                    </span>

                    <span>
                      {capitalise(
                        interaction.channel
                      )}{" "}
                      ·{" "}
                      {capitalise(
                        interaction.direction
                      )}
                    </span>

                    {interaction.contact_name && (
                      <span>
                        Contact:{" "}
                        {
                          interaction.contact_name
                        }
                      </span>
                    )}

                    {interaction.outcome && (
                      <span>
                        Outcome:{" "}
                        {
                          interaction.outcome
                        }
                      </span>
                    )}

                    <span>
                      {interaction.summary ||
                        "No summary"}
                    </span>

                    {interaction.next_action && (
                      <span>
                        Next:{" "}
                        {
                          interaction.next_action
                        }
                      </span>
                    )}

                    {interaction.next_action_date && (
                      <span>
                        Due:{" "}
                        {formatDateOnly(
                          interaction.next_action_date
                        )}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section
          className="card"
          style={{
            marginTop: "28px",
          }}
        >
          <div className="panel-title">
            Conversation
          </div>

          {messages.length ===
          0 ? (
            <div
              className="mode"
              style={{
                marginTop:
                  "16px",
              }}
            >
              <strong>
                Alfred is ready.
              </strong>

              <span>
                Ask a question or
                give Alfred a
                command.
              </span>
            </div>
          ) : (
            <div
              style={{
                marginTop:
                  "18px",
              }}
            >
              {messages.map(
                (message) => (
                  <div
                    className="mode"
                    key={message.id}
                    style={{
                      marginBottom:
                        "14px",
                    }}
                  >
                    <strong>
                      {message.role ===
                      "user"
                        ? "You"
                        : "Alfred"}
                    </strong>

                    {message.role ===
                    "assistant" ? (
                      <>
                        <div className="markdown-output">
                          <ReactMarkdown>
                            {
                              message.content
                            }
                          </ReactMarkdown>
                        </div>

                        <div
                          className="actions"
                          style={{
                            marginTop:
                              "12px",
                          }}
                        >
                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              speak(
                                message.spokenContent ||
                                  message.content
                              )
                            }
                          >
                            🔊 Hear
                            Alfred
                          </button>
                        </div>
                      </>
                    ) : (
                      <span>
                        {
                          message.content
                        }
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section
          className="card"
          style={{
            marginTop: "28px",
          }}
        >
          <div className="panel-title">
            What Alfred currently
            knows
          </div>

          <div
            className="section"
            style={{
              marginTop:
                "18px",
            }}
          >
            <div className="mini-card">
              <h3>
                CRM leads
              </h3>
              <p>
                {leads.length}
              </p>
            </div>

            <div className="mini-card">
              <h3>
                Interactions
              </h3>
              <p>
                {
                  interactions.length
                }
              </p>
            </div>

            <div className="mini-card">
              <h3>
                Projects
              </h3>
              <p>
                {projects.length}
              </p>
            </div>

            <div className="mini-card">
              <h3>
                Demos
              </h3>
              <p>
                {demos.length}
              </p>
            </div>

            <div className="mini-card">
              <h3>
                Offers
              </h3>
              <p>
                {offers.length}
              </p>
            </div>

            <div className="mini-card">
              <h3>
                Registered
                assets
              </h3>
              <p>
                {solutionAssets.length ||
                  products.length}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
