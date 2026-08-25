"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HealthStatus {
  status: string;
}

function HeroSection() {
  const [health, setHealth] = useState<string>("checking...");

  useEffect(() => {
    apiGet<HealthStatus>("/health").then(({ data, error }) => {
      setHealth(data?.status ?? error ?? "unknown");
    });
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-observatory text-paper">
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
          <circle cx="200" cy="150" r="4" fill="#4C6FFF" />
          <circle cx="400" cy="100" r="3" fill="#8B6FE8" />
          <circle cx="600" cy="200" r="5" fill="#4C6FFF" />
          <circle cx="300" cy="350" r="4" fill="#8B6FE8" />
          <circle cx="500" cy="400" r="3" fill="#4C6FFF" />
          <circle cx="150" cy="450" r="4" fill="#8B6FE8" />
          <circle cx="700" cy="350" r="3" fill="#4C6FFF" />
          <line x1="200" y1="150" x2="400" y2="100" stroke="#4C6FFF" strokeWidth="1" opacity="0.4" />
          <line x1="400" y1="100" x2="600" y2="200" stroke="#8B6FE8" strokeWidth="1" opacity="0.4" />
          <line x1="200" y1="150" x2="300" y2="350" stroke="#4C6FFF" strokeWidth="1" opacity="0.3" />
          <line x1="600" y1="200" x2="500" y2="400" stroke="#8B6FE8" strokeWidth="1" opacity="0.3" />
          <line x1="300" y1="350" x2="500" y2="400" stroke="#4C6FFF" strokeWidth="1" opacity="0.25" />
          <line x1="150" y1="450" x2="300" y2="350" stroke="#8B6FE8" strokeWidth="1" opacity="0.2" />
          <line x1="500" y1="400" x2="700" y2="350" stroke="#4C6FFF" strokeWidth="1" opacity="0.2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <Badge variant="signal" className="mb-6">
          AI-Powered Research Intelligence
        </Badge>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
          Research should
          <br />
          connect itself.
        </h1>
        <p className="text-lg md:text-xl text-paper/70 max-w-2xl mx-auto mb-10">
          We turn isolated papers, datasets, and code into a living map of ideas,
          people, and discoveries. AI finds the connections between research
          across your university.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/explore">
            <Button size="lg">Explore the network</Button>
          </Link>
          <Link href="/upload">
            <Button variant="secondary" size="lg">Upload research</Button>
          </Link>
        </div>

        <div className="mt-12 inline-flex items-center gap-2 text-sm text-paper/50 font-data">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Backend: {health}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      title: "Research silos",
      description:
        "Papers, datasets, and code live in separate departments with no shared visibility.",
    },
    {
      title: "Duplicate effort",
      description:
        "Teams unknowingly repeat studies because similar work is happening elsewhere.",
    },
    {
      title: "Hidden collaborations",
      description:
        "Researchers working on related problems never discover each other.",
    },
    {
      title: "Lost datasets",
      description:
        "Valuable datasets remain undiscovered, limiting reproducibility and progress.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-paper">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-data uppercase tracking-wider text-signal mb-3">
          The problem
        </p>
        <h2 className="font-display text-3xl md:text-4xl mb-4">
          University research is fragmented.
        </h2>
        <p className="text-archive/60 text-lg max-w-2xl mb-12">
          Research papers, datasets, theses, and repositories are scattered
          across departments. No system connects them.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((p) => (
            <Card key={p.title}>
              <h3 className="font-medium text-lg mb-2">{p.title}</h3>
              <p className="text-archive/60 text-sm">{p.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const steps = [
    { label: "Ingest", description: "PDFs, markdown, repositories" },
    { label: "Understand", description: "AI entity extraction" },
    { label: "Connect", description: "Relationship mapping" },
    { label: "Discover", description: "Hidden insights revealed" },
  ];

  return (
    <section className="py-24 px-6 bg-observatory text-paper">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-data uppercase tracking-wider text-discovery mb-3">
          How it works
        </p>
        <h2 className="font-display text-3xl md:text-4xl mb-12">
          From documents to discovered connections.
        </h2>

        <div className="flex flex-col md:flex-row gap-8 md:gap-4">
          {steps.map((step, i) => (
            <div key={step.label} className="flex-1 relative">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-data text-sm text-discovery">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-medium text-lg">{step.label}</h3>
              </div>
              <p className="text-paper/60 text-sm">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-4 -right-4 text-paper/20">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-[var(--radius-md)] border border-paper/10 bg-paper/5">
          <p className="text-sm text-paper/50 mb-2 font-data uppercase tracking-wider">
            The pipeline
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            {[
              "Research Files",
              "AI Extraction",
              "Entity Recognition",
              "Relationship Detection",
              "Vector Search",
              "Knowledge Graph",
              "Hidden Insights",
            ].map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                <span className="text-discovery">{item}</span>
                {i < 6 && <span className="text-paper/20">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechnologySection() {
  const technologies = [
    { name: "Vertex AI", role: "Entity extraction, embeddings, generative responses" },
    { name: "AlloyDB", role: "PostgreSQL vector search, structured storage" },
    { name: "Cloud Run", role: "Scalable backend hosting" },
    { name: "Firebase", role: "Authentication, real-time status" },
    { name: "LangChain", role: "Document loaders, retrieval, prompt templates" },
    { name: "LangGraph", role: "Multi-agent research pipeline orchestration" },
    { name: "Next.js", role: "React frontend, server components, deployment" },
  ];

  return (
    <section className="py-24 px-6 bg-paper">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-data uppercase tracking-wider text-signal mb-3">
          Technology
        </p>
        <h2 className="font-display text-3xl md:text-4xl mb-12">
          Built on Google Cloud and modern AI.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((t) => (
            <div
              key={t.name}
              className="p-4 rounded-[var(--radius-md)] border border-archive/8 bg-white"
            >
              <h3 className="font-medium mb-1">{t.name}</h3>
              <p className="text-sm text-archive/50">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 px-6 bg-observatory text-paper text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl mb-4">
          Start discovering connections.
        </h2>
        <p className="text-paper/60 text-lg mb-8">
          Upload your first research document and see what the AI finds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/upload">
            <Button size="lg">Upload research</Button>
          </Link>
          <Link href="/explore">
            <Button variant="secondary" size="lg">Explore the network</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 bg-archive text-paper/50 text-sm">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-display text-paper/80">Research Nexus AI</span>
        <span>AI-powered research intelligence platform</span>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <TechnologySection />
      <CTASection />
      <Footer />
    </>
  );
}
