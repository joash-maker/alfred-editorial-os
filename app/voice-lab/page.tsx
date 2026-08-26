"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

const defaultText =
  "Good evening. I've reviewed your priorities. BizSpace is the one I would deal with first. Everything else can wait.";

export default function VoiceLabPage() {
  const [text, setText] =
    useState(defaultText);

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState(
      "Alfred Natural is ready for testing."
    );

  const [audioUrl, setAudioUrl] =
    useState("");

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null
    );

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(
          audioUrl
        );
      }
    };
  }, [audioUrl]);

  async function generateVoice() {
    const cleanText =
      text.trim();

    if (!cleanText) {
      setStatus(
        "Enter something for Alfred to say."
      );
      return;
    }

    setLoading(true);

    setStatus(
      "Generating Alfred's natural voice..."
    );

    try {
      if (audioUrl) {
        URL.revokeObjectURL(
          audioUrl
        );

        setAudioUrl("");
      }

      const response =
        await fetch(
          "/api/voice",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              text: cleanText,
            }),
          }
        );

      if (!response.ok) {
        let message =
          "Alfred's voice could not be generated.";

        try {
          const data =
            await response.json();

          if (data?.error) {
            message =
              data.error;
          }
        } catch {
          // Keep the default message.
        }

        setStatus(message);
        return;
      }

      const audioBlob =
        await response.blob();

      const url =
        URL.createObjectURL(
          audioBlob
        );

      setAudioUrl(url);

      setStatus(
        "Alfred's voice is ready. Tap Play Alfred."
      );
    } catch (error) {
      console.error(
        "Voice Lab error:",
        error
      );

      setStatus(
        "Something went wrong connecting to Alfred's voice."
      );
    } finally {
      setLoading(false);
    }
  }

  async function playAlfred() {
    if (
      !audioRef.current
    ) {
      return;
    }

    try {
      audioRef.current.currentTime =
        0;

      await audioRef.current.play();

      setStatus(
        "Alfred is speaking..."
      );
    } catch {
      setStatus(
        "Your iPhone blocked playback. Use the audio controls below."
      );
    }
  }

  function briefingSample() {
    setText(
      "Good morning. I've reviewed the position. There are three things worth your attention today, but only one needs to happen first. Follow up the strongest live opportunity before starting anything new."
    );
  }

  function confirmationSample() {
    setText(
      "That's done. I've recorded the interaction and updated the CRM. Your next follow-up is scheduled for Friday."
    );
  }

  function adviceSample() {
    setText(
      "You have quite enough projects already. I wouldn't build another one this evening. Deal with the follow-up first, then we can decide whether anything else genuinely deserves your attention."
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background:
          "radial-gradient(circle at top, #171717 0%, #090909 45%, #030303 100%)",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <a
          href="/alfred"
          style={{
            display: "inline-block",
            color: "#b5b5b5",
            textDecoration: "none",
            fontSize: "14px",
            marginBottom: "28px",
          }}
        >
          ← Back to Alfred
        </a>

        <section
          style={{
            border:
              "1px solid rgba(255,255,255,0.12)",
            borderRadius: "26px",
            padding: "28px",
            background:
              "rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              textTransform:
                "uppercase",
              letterSpacing:
                "0.14em",
              fontSize: "12px",
              opacity: 0.55,
            }}
          >
            ElevenLabs Voice Test
          </div>

          <h1
            style={{
              margin:
                "12px 0 14px",
              fontSize:
                "clamp(38px, 9vw, 62px)",
              lineHeight: 1,
            }}
          >
            Alfred Natural
          </h1>

          <p
            style={{
              margin: 0,
              color: "#b5b5b5",
              lineHeight: 1.7,
              fontSize: "16px",
            }}
          >
            Test Alfred's selected
            ElevenLabs voice before
            we connect it to the
            main Command Centre.
          </p>

          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "14px",
              background:
                "rgba(255,255,255,0.04)",
              border:
                "1px solid rgba(255,255,255,0.08)",
              color: "#a8a8a8",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Alfred Natural uses an
            AI-generated synthetic
            voice.
          </div>
        </section>

        <section
          style={{
            marginTop: "20px",
            border:
              "1px solid rgba(255,255,255,0.12)",
            borderRadius: "26px",
            padding: "28px",
            background:
              "rgba(255,255,255,0.04)",
          }}
        >
          <label
            htmlFor="alfred-text"
            style={{
              display: "block",
              fontWeight: 700,
              marginBottom: "10px",
            }}
          >
            What should Alfred say?
          </label>

          <textarea
            id="alfred-text"
            value={text}
            onChange={(
              event
            ) =>
              setText(
                event.target.value
              )
            }
            rows={7}
            style={{
              width: "100%",
              boxSizing:
                "border-box",
              borderRadius: "16px",
              border:
                "1px solid rgba(255,255,255,0.14)",
              background:
                "#101010",
              color: "#ffffff",
              fontSize: "16px",
              lineHeight: 1.6,
              padding: "16px",
              resize: "vertical",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
              marginTop: "14px",
            }}
          >
            <button
              type="button"
              onClick={
                briefingSample
              }
              style={
                secondaryButton
              }
            >
              Morning briefing
            </button>

            <button
              type="button"
              onClick={
                confirmationSample
              }
              style={
                secondaryButton
              }
            >
              CRM confirmation
            </button>

            <button
              type="button"
              onClick={
                adviceSample
              }
              style={
                secondaryButton
              }
            >
              Alfred advice
            </button>
          </div>

          <button
            type="button"
            onClick={
              generateVoice
            }
            disabled={loading}
            style={{
              width: "100%",
              border: 0,
              borderRadius: "16px",
              padding: "17px",
              marginTop: "22px",
              fontSize: "17px",
              fontWeight: 800,
              cursor:
                loading
                  ? "wait"
                  : "pointer",
              opacity:
                loading
                  ? 0.7
                  : 1,
            }}
          >
            {loading
              ? "Generating Alfred..."
              : "Generate Alfred's voice"}
          </button>

          <div
            style={{
              marginTop: "16px",
              padding: "14px",
              borderRadius: "14px",
              background:
                "rgba(255,255,255,0.045)",
              color: "#c2c2c2",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {status}
          </div>

          {audioUrl && (
            <div
              style={{
                marginTop: "18px",
              }}
            >
              <button
                type="button"
                onClick={
                  playAlfred
                }
                style={{
                  ...secondaryButton,
                  width: "100%",
                  padding: "15px",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                🔊 Play Alfred
              </button>

              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                playsInline
                onEnded={() =>
                  setStatus(
                    "Alfred Natural is ready."
                  )
                }
                style={{
                  width: "100%",
                  marginTop: "14px",
                }}
              />
            </div>
          )}
        </section>

        <section
          style={{
            marginTop: "20px",
            border:
              "1px solid rgba(255,255,255,0.12)",
            borderRadius: "26px",
            padding: "24px",
            background:
              "rgba(255,255,255,0.04)",
          }}
        >
          <strong>
            Selected Alfred voice
          </strong>

          <p
            style={{
              color: "#aaa",
              lineHeight: 1.6,
              marginBottom: 0,
            }}
          >
            The actual ElevenLabs
            voice is controlled by
            your private
            ELEVENLABS_VOICE_ID
            environment variable.
            The voice ID is never
            required from the
            browser.
          </p>
        </section>
      </div>
    </main>
  );
}

const secondaryButton:
  React.CSSProperties = {
    border:
      "1px solid rgba(255,255,255,0.13)",
    borderRadius: "13px",
    background:
      "rgba(255,255,255,0.05)",
    color: "#ffffff",
    padding: "12px",
    cursor: "pointer",
  };
