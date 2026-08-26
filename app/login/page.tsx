"use client";

import {
  FormEvent,
  useState,
} from "react";

export default function AlfredLoginPage() {
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!password.trim()) {
      setError(
        "Enter your Alfred password."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to sign in."
        );
        return;
      }

      const params =
        new URLSearchParams(
          window.location.search
        );

      const destination =
        params.get("next") ||
        "/alfred";

      window.location.href =
        destination;
    } catch {
      setError(
        "Unable to reach Alfred."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at top, #151515 0%, #080808 45%, #030303 100%)",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          border:
            "1px solid rgba(255,255,255,0.12)",
          borderRadius: "24px",
          background:
            "rgba(255,255,255,0.04)",
          padding: "32px",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            textTransform:
              "uppercase",
            letterSpacing:
              "0.14em",
            opacity: 0.65,
            marginBottom:
              "12px",
          }}
        >
          Private Command Centre
        </div>

        <h1
          style={{
            fontSize: "38px",
            lineHeight: 1,
            margin:
              "0 0 14px",
          }}
        >
          Alfred
        </h1>

        <p
          style={{
            lineHeight: 1.6,
            opacity: 0.72,
            margin:
              "0 0 28px",
          }}
        >
          Sign in to access your
          private Sales, Strategy
          and Operating Chief of
          Staff.
        </p>

        <form
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="password"
            style={{
              display: "block",
              fontSize: "14px",
              marginBottom:
                "8px",
            }}
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            placeholder="Enter password"
            style={{
              width: "100%",
              boxSizing:
                "border-box",
              border:
                "1px solid rgba(255,255,255,0.16)",
              borderRadius:
                "14px",
              background:
                "rgba(255,255,255,0.06)",
              color: "#ffffff",
              padding:
                "15px 16px",
              fontSize: "16px",
              outline: "none",
            }}
          />

          {error && (
            <div
              style={{
                marginTop:
                  "12px",
                padding:
                  "12px 14px",
                borderRadius:
                  "12px",
                background:
                  "rgba(255,80,80,0.10)",
                border:
                  "1px solid rgba(255,80,80,0.22)",
                fontSize:
                  "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop:
                "18px",
              padding:
                "15px 18px",
              border: 0,
              borderRadius:
                "14px",
              fontSize: "16px",
              fontWeight: 700,
              cursor:
                loading
                  ? "wait"
                  : "pointer",
            }}
          >
            {loading
              ? "Opening Alfred..."
              : "Open Alfred"}
          </button>
        </form>

        <p
          style={{
            margin:
              "22px 0 0",
            fontSize: "12px",
            lineHeight: 1.5,
            opacity: 0.45,
          }}
        >
          Mediahubink private
          operating system
        </p>
      </div>
    </main>
  );
}
