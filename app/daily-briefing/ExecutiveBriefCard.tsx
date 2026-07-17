"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Clock3, Sparkles, Target, TrendingUp } from "lucide-react";

import type { ExecutiveBriefing } from "../../lib/intelligence/executive";

type ExecutiveBriefCardProps = {
  ruleBriefing: ExecutiveBriefing;
};

type IntelligenceSource = "claude" | "rules";

type ExecutiveApiResponse = {
  briefing?: ExecutiveBriefing;
  source?: IntelligenceSource;
  fallbackUsed?: boolean;
  cacheHit?: boolean;
  cachedAt?: string;
  expiresAt?: string;
  error?: string;
};

function getStatusLabel({
  isLoading,
  source,
  cacheHit,
}: {
  isLoading: boolean;
  source: IntelligenceSource;
  cacheHit: boolean;
}) {
  if (isLoading) return "Thinking";
  if (cacheHit) return "Cached";
  if (source === "claude") return "Claude";
  return "Rules";
}

export default function ExecutiveBriefCard({
  ruleBriefing,
}: ExecutiveBriefCardProps) {
  const [briefing, setBriefing] = useState<ExecutiveBriefing>(ruleBriefing);
  const [source, setSource] = useState<IntelligenceSource>("rules");
  const [cacheHit, setCacheHit] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const initialRequestStarted = useRef(false);

  const loadExecutiveBriefing = useCallback(
    async (forceRefresh = false) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch("/api/intelligence/executive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ ruleBriefing, forceRefresh }),
        });

        const data = (await response.json()) as ExecutiveApiResponse;

        if (!response.ok || !data.briefing) {
          throw new Error(
            data.error || "Alfred could not generate the executive briefing.",
          );
        }

        setBriefing(data.briefing);
        setSource(data.source || "rules");
        setCacheHit(Boolean(data.cacheHit));
        setFallbackUsed(Boolean(data.fallbackUsed));
      } catch (error) {
        console.error("Failed to load Alfred Executive Brief:", error);
        setBriefing(ruleBriefing);
        setSource("rules");
        setCacheHit(false);
        setFallbackUsed(true);
        setErrorMessage(
          "Claude is temporarily unavailable. Alfred is using the rules engine.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [ruleBriefing],
  );

  useEffect(() => {
    if (initialRequestStarted.current) return;
    initialRequestStarted.current = true;
    void loadExecutiveBriefing(false);
  }, [loadExecutiveBriefing]);

  const statusLabel = getStatusLabel({ isLoading, source, cacheHit });

  return (
    <section className="card" style={{ marginTop: "28px" }}>
      <div
        className="actions"
        style={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <div className="kicker">Alfred Executive Brief</div>
          <h2 style={{ marginTop: "12px" }}>{briefing.headline}</h2>
        </div>

        <div className="actions">
          <span className="nav-pill">{statusLabel}</span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => void loadExecutiveBriefing(true)}
            disabled={isLoading}
          >
            {isLoading ? "Analysing..." : "Refresh"}
          </button>
        </div>
      </div>

      <p className="lead" style={{ marginTop: "14px" }}>
        {briefing.summary}
      </p>

      {fallbackUsed && (
        <div className="mode" style={{ marginTop: "18px" }}>
          <strong>Rules fallback active</strong>
          <span>
            Claude was unavailable, so Alfred is using the rule-based briefing.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="mode" style={{ marginTop: "12px" }}>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mode-grid" style={{ marginTop: "18px" }}>
        <div className="mode">
          <Target size={18} />
          <strong>Priority</strong>
          <span>{briefing.priority}</span>
          <span>{briefing.reason}</span>
        </div>

        <div className="mode">
          <Clock3 size={18} />
          <strong>Risk</strong>
          <span>{briefing.risk}</span>
        </div>

        <div className="mode">
          <TrendingUp size={18} />
          <strong>Opportunity</strong>
          <span>{briefing.opportunity}</span>
        </div>

        <div className="mode">
          <Sparkles size={18} />
          <strong>CEO Question</strong>
          <span>{briefing.question}</span>
        </div>
      </div>
    </section>
  );
}
