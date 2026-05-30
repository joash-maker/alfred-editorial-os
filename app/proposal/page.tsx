"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Printer } from "lucide-react";

export default function ProposalPage() {
  const [proposal, setProposal] = useState("");

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  const proposalRef = useMemo(() => {
    return `MHI-${Date.now().toString().slice(-6)}`;
  }, []);

  useEffect(() => {
    const saved =
      localStorage.getItem("alfredProposal") ||
      sessionStorage.getItem("alfredProposal");

    setProposal(saved || "");
  }, []);

  function printProposal() {
    window.print();
  }

  function backToAlfred() {
    window.location.href = "/";
  }

  return (
    <main className="proposal-page">
      <section className="proposal-toolbar no-print">
        <div className="proposal-toolbar-actions">
          <button className="proposal-back-btn" onClick={backToAlfred}>
            <ArrowLeft size={18} />
            Back to Alfred OS
          </button>

          <button onClick={printProposal}>
            <Printer size={18} />
            Save as PDF
          </button>
        </div>

        <p className="print-note">
          Before sending to a client, untick "Headers and footers" in your browser print settings so the Alfred URL does not appear on the PDF.
        </p>
      </section>

      <section className="proposal-cover">
        <div>
          <p className="proposal-kicker">Mediahubink</p>
          <h1>Commercial Proposal</h1>
          <p className="proposal-subtitle">
            Commercial enquiry systems for lead capture, qualification and business development.
          </p>
        </div>

        <div className="proposal-meta">
          <p>
            <strong>Prepared by:</strong> Joash F. Perera
          </p>
          <p>
            <strong>Company:</strong> Mediahubink Limited
          </p>
          <p>
            <strong>Date:</strong> {today}
          </p>
          <p>
            <strong>Reference:</strong> {proposalRef}
          </p>
          <p>
            <strong>Status:</strong> Confidential
          </p>
        </div>
      </section>

      <section className="proposal-body">
        {proposal ? (
          <ReactMarkdown>{proposal}</ReactMarkdown>
        ) : (
          <p>No proposal found. Go back to Alfred OS and generate a proposal first.</p>
        )}
      </section>

      <footer className="proposal-footer">
        <p>Mediahubink Limited · Confidential commercial document</p>
        <p>www.mediahubink.com</p>
      </footer>
    </main>
  );
}
