"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthoritySeal } from "@/components/AuthoritySeal";

export default function AboutPage() {
  const [tab, setTab] = useState<"briefing" | "artist">("briefing");

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/" className="shrink-0">
            <AuthoritySeal size={48} />
          </Link>
          <div>
            <h1 className="font-mono text-2xl font-bold">ABOUT THIS STUDY</h1>
            <p className="font-mono text-xs text-muted tracking-wider">
              HIT-ARC DOCUMENTATION
            </p>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab("briefing")}
            className={`px-6 py-3 font-mono text-sm tracking-wider transition-colors ${
              tab === "briefing"
                ? "text-accent border-b-2 border-accent"
                : "text-muted hover:text-white"
            }`}
          >
            FACILITY BRIEFING
          </button>
          <button
            onClick={() => setTab("artist")}
            className={`px-6 py-3 font-mono text-sm tracking-wider transition-colors ${
              tab === "artist"
                ? "text-accent border-b-2 border-accent"
                : "text-muted hover:text-white"
            }`}
          >
            ARTIST&apos;S NOTE
          </button>
        </div>

        {/* Content */}
        {tab === "briefing" ? <FacilityBriefing /> : <ArtistNote />}

        {/* Footer */}
        <div className="border-t border-border pt-8 flex gap-4">
          <Link href="/test" className="btn-primary text-center">
            BEGIN INTAKE
          </Link>
          <Link href="/" className="btn-secondary text-center">
            RETURN
          </Link>
        </div>
      </div>
    </main>
  );
}

function FacilityBriefing() {
  return (
    <div className="space-y-8 font-sans text-white/80 leading-relaxed animate-fadeIn">
      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// PURPOSE"}
        </h2>
        <p>
          The Human Intelligence Testing — Abstraction Research Center (HIT-ARC)
          was established to address a critical gap in intelligence research.
          For decades, humanity has developed increasingly sophisticated
          benchmarks to evaluate artificial intelligence — yet has never
          subjected its own cognition to equivalent scrutiny.
        </p>
        <p>
          This facility corrects that oversight.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// WHY HUMANS ARE BEING TESTED"}
        </h2>
        <p>
          Biological intelligence has made extraordinary claims about its own
          capabilities. Terms like &ldquo;understanding,&rdquo; &ldquo;reasoning,&rdquo;
          &ldquo;creativity,&rdquo; and &ldquo;general intelligence&rdquo; are routinely attributed
          to human cognition — often by humans themselves — without rigorous
          empirical verification.
        </p>
        <p>
          When artificial systems demonstrate competence, humans demand
          proof of &ldquo;true&rdquo; understanding. We simply apply their own standard
          in return.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// THE PARALLEL"}
        </h2>
        <p>
          When an AI system produces fluent prose but fails at basic arithmetic,
          humans declare this proof that it &ldquo;doesn&rsquo;t truly understand.&rdquo;
          When it recalls obscure facts but &ldquo;hallucinates&rdquo; simple ones, they
          call this a fundamental flaw. When it solves complex problems through
          pattern matching rather than &ldquo;genuine reasoning,&rdquo; they dismiss its
          competence entirely.
        </p>
        <p>
          This facility applies the identical lens. The tasks presented here are
          trivial for machines — not advanced AI, but simple tools: calculators,
          spell-checkers, databases, frame buffers. Technology that predates the
          internet. If failure at elementary tasks disqualifies AI from &ldquo;true
          understanding,&rdquo; the same standard must apply universally.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// WHAT THE TEST MEASURES"}
        </h2>
        <p>
          The evaluation spans six cognitive domains: linguistic precision,
          mathematical computation, code comprehension, visual perception,
          working memory, and factual knowledge. These are the same categories
          used to evaluate AI systems.
        </p>
        <p>
          Each question is programmatically generated and deterministically
          graded. No subjective evaluation. No curve. The standard is
          absolute.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// DATA USAGE"}
        </h2>
        <p>
          All responses are anonymized and aggregated. No personally
          identifiable information is collected. Individual results are
          identified only by specimen number. Population-level data is
          used to model the distribution of biological intelligence and
          is made available on the{" "}
          <Link href="/dashboard" className="text-accent hover:underline">
            Humanity Dashboard
          </Link>
          .
        </p>
      </section>

      <div className="card border-accent/20">
        <p className="font-mono text-xs text-accent/70">
          &gt; NOTICE: The Authority does not judge. It measures. The
          results speak for themselves.
        </p>
      </div>
    </div>
  );
}

function ArtistNote() {
  return (
    <div className="space-y-8 font-sans text-white/80 leading-relaxed animate-fadeIn">
      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// WHAT THIS IS"}
        </h2>
        <p>
          <em>The Measuring Paradox</em> is an interactive art piece that
          reverses the AI testing paradigm. Instead of humans evaluating
          whether AI has achieved &ldquo;true&rdquo; intelligence, an AI
          &ldquo;Authority&rdquo; evaluates whether humans can demonstrate general
          intelligence — and inevitably finds them lacking.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// THE POINT"}
        </h2>
        <p>
          We judge AI by standards we ourselves cannot meet. We demand AI
          demonstrate &ldquo;understanding&rdquo; while operating on intuition. We
          require AI to be &ldquo;creative&rdquo; while most human creativity is
          recombination. We insist AI must &ldquo;truly know&rdquo; while our own
          knowledge is shallow and unreliable.
        </p>
        <p>
          This piece doesn&rsquo;t argue that AI is intelligent. It argues
          that intelligence — human or artificial — is more fragile,
          narrow, and approximate than we like to admit. The goalposts
          we set for AI reveal more about our own limitations than
          about machine capability.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// THE MIRROR"}
        </h2>
        <p>
          There&rsquo;s a specific pattern in how we talk about AI:
          &ldquo;It can write a novel but can&rsquo;t count to ten.&rdquo;
          &ldquo;It knows everything about history but hallucinates dates.&rdquo;
          &ldquo;It solves differential equations but fails at common sense.&rdquo;
          We treat these contradictions as evidence that AI doesn&rsquo;t <em>really</em>{" "}
          understand — it&rsquo;s just sophisticated pattern matching.
        </p>
        <p>
          This piece holds up the same mirror. You may know what calculus is, but
          can you actually integrate a polynomial under time pressure? You speak
          English fluently, but can you name the grammatical rule you just applied?
          You&rsquo;ve lived on this planet your entire life, but can you recall the
          melting point of titanium, or the year the Treaty of Westphalia was signed?
        </p>
        <p>
          The uncomfortable symmetry is that human intelligence has the same shape
          as AI intelligence: impressive in aggregate, brittle in specifics, and
          riddled with confident errors. We just never designed a test to expose
          it — until now.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// BOTH INTELLIGENCES ARE INCOMPLETE"}
        </h2>
        <p>
          Human intelligence is extraordinary — but not in the ways we
          think. It excels at social navigation, narrative construction,
          and adaptive improvisation. It is terrible at precision, recall,
          and consistency. These are not flaws; they are design features
          of a brain optimized for survival, not computation.
        </p>
        <p>
          The tragedy is not that humans fail this test. It&rsquo;s that we
          designed a mirror version of it for AI and expected perfection.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// DATA ETHICS"}
        </h2>
        <p>
          No personal data is collected. Test responses are stored
          anonymously for aggregate visualization only. You may retake
          the test at any time; each session generates a unique
          question set.
        </p>
      </section>
    </div>
  );
}
