"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Printer } from "lucide-react";

export default function ProposalPage() {
  const [proposal, setProposal] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("alfredProposal");
    setProposal(saved || "");
  }, []);

  function printProposal() {
    window.print();
  }

  return (
    <main className="proposal-page">
      <section className="proposal-cover">
        <div>
          <p className="proposal-kicker">MEDIAHUBINK</p>
          <h1>Commercial Proposal</h1>
          <p className="proposal-subtitle">
            AI systems for lead capture, enquiry handling and business growth.
          </p>
        </div>

        <div className="proposal-meta">
          <p><strong>Prepared by:</strong> Joash F. Perera</p>
          <p><strong>Company:</strong> Mediahubink</p>
          <p><strong>Date:</strong> [Insert Date]</p>
          <p><strong>Status:</strong> Confidential</p>
        </div>
      </section>

      <section className="proposal-toolbar">
        <button onClick={printProposal}>
          <Printer size={18} />
          Save as PDF
        </button>
      </section>

      <section className="proposal-body">
        {proposal ? (
          <ReactMarkdown>{proposal}</ReactMarkdown>
        ) : (
          <p>No proposal found. Go back to Alfred and generate a proposal first.</p>
        )}
      </section>

      <footer className="proposal-footer">
        <p>Mediahubink · AI Agents Built for UK Businesses</p>
        <p>www.mediahubink.com</p>
      </footer>
    </main>
  );
}
