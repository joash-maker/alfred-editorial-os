"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const [briefing, setBriefing] =
    useState<ExecutiveBriefing>(ruleBriefing);

  const [source, setSource] =
    useState<IntelligenceSource>("rules");

  const [cacheHit, setCacheHit] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  const initialRequestStarted = useRef(false);

  const loadExecutiveBriefing = useCallback(
    async (forceRefresh = false) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(
          "/api/intelligence/executive",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
            body: JSON.stringify({
              ruleBriefing,
              forceRefresh,
            }),
          }
        );

        const data =
          (await response.json()) as ExecutiveApiResponse;

        if (!response.ok || !data.briefing) {
          throw new Error(
            data.error ||
              "Alfred could not generate the executive briefing."
          );
        }

        setBriefing(data.briefing);
        setSource(data.source || "rules");
        setCacheHit(Boolean(data.cacheHit));
        setFallbackUsed(Boolean(data.fallbackUsed));
      } catch (error) {
        console.error(
          "Failed to load Alfred Executive Brief:",
          error
        );

        setBriefing(ruleBriefing);
        setSource("rules");
        setCacheHit(false);
        setFallbackUsed(true);

        setErrorMessage(
          "Claude is temporarily unavailable. Alfred is using the rules engine."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [ruleBriefing]
  );

  useEffect(() => {
    if (initialRequestStarted.current) return;

    initialRequestStarted.current = true;
    void loadExecutiveBriefing(false);
  }, [loadExecutiveBriefing]);

  const statusLabel = getStatusLabel({
    isLoading,
    source,
    cacheHit,
  });

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
            Alfred Executive Brief
          </p>

          <h2 className="mt-3 max-w-4xl text-2xl font-semibold leading-tight text-white md:text-3xl">
            {briefing.headline}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/50">
            {statusLabel}
          </span>

          <button
            type="button"
            onClick={() => void loadExecutiveBriefing(true)}
            disabled={isLoading}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Analysing…" : "Refresh"}
          </button>
        </div>
      </div>

      <p className="max-w-4xl text-sm leading-7 text-white/65 md:text-base">
        {briefing.summary}
      </p>

      {fallbackUsed && (
        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-100/70">
          Claude was unavailable, so Alfred is using the
          rule-based briefing.
        </div>
      )}

      {errorMessage && (
        <p className="mt-3 text-xs text-white/40">
          {errorMessage}
        </p>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Priority
          </p>

          <p className="mt-3 text-lg font-semibold leading-7 text-white">
            {briefing.priority}
          </p>

          <p className="mt-3 text-sm leading-6 text-white/55">
            {briefing.reason}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Risk
          </p>

          <p className="mt-3 text-sm leading-7 text-white/70">
            {briefing.risk}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Opportunity
          </p>

          <p className="mt-3 text-sm leading-7 text-white/70">
            {briefing.opportunity}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            CEO Question
          </p>

          <p className="mt-3 text-sm font-medium leading-7 text-white">
            {briefing.question}
          </p>
        </div>
      </div>
    </section>
  );
}
