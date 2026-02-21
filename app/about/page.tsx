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
              SCCA DOCUMENTATION
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
          The Synthetic Cognitive Capacity Assessment (SCCA) is a research
          instrument designed to probe the boundaries of human cognition in
          domains where biological neural architectures face known structural
          constraints. For decades, humans have designed increasingly rigorous
          benchmarks to evaluate machine intelligence. The SCCA inverts this
          paradigm: what happens when machines set the test?
        </p>
        <p>
          The goal is not to indict human cognition but to map its contours --
          to identify where biological computation excels, where it degrades,
          and what those boundaries reveal about the nature of intelligence itself.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// THE FIVE COGNITIVE STRESS DOMAINS"}
        </h2>
        <p>
          Each domain isolates a specific axis along which biological and
          silicon computation diverge. The research question is consistent:
          given a task trivial for a machine, how does human performance
          degrade, and what strategies does the brain employ to compensate?
        </p>
        <ul className="space-y-4 pl-4">
          <li>
            <strong>I. Abstract Structure</strong>{" "}
            <span className="text-accent text-xs">[Structural Isomorphism]</span>
            <br />
            <span className="text-white/60">
              Human spatial cognition is calibrated for 3D Euclidean space --
              a remarkable adaptation, but one with hard limits. How far can
              abstract mathematical reasoning extend beyond the perceptual
              dimensions the brain evolved to navigate? These tasks explore
              the boundary between spatial intuition and formal geometry.
            </span>
          </li>
          <li>
            <strong>II. State Tracking</strong>{" "}
            <span className="text-accent text-xs">[Parallel State &amp; Attentional Load]</span>
            <br />
            <span className="text-white/60">
              Conscious attention appears to operate as a serial bottleneck
              with an estimated throughput of ~50 bits per second (Norretranders, 1998).
              The Psychological Refractory Period constrains conscious
              decision-making to roughly one operation per second. How effectively
              can human cognition synthesize information across simultaneous data
              streams and maintain multiple state variables? These tasks test the ceiling.
            </span>
          </li>
          <li>
            <strong>III. Sequential Depth</strong>{" "}
            <span className="text-accent text-xs">[Recursive Execution &amp; Deterministic Precision]</span>
            <br />
            <span className="text-white/60">
              Cognitive science suggests the human &ldquo;mental stack&rdquo;
              reliably handles 3-4 levels of nested recursion before
              accuracy collapses. Biological computation evolved for approximate
              inference -- efficient in most environments, but catastrophic when a
              single step matters. Can systematic strategies extend these limits?
              These tasks probe the depth at which mental bookkeeping fails.
            </span>
          </li>
          <li>
            <strong>IV. Signal Detection</strong>{" "}
            <span className="text-accent text-xs">[Micro-Pattern Extraction]</span>
            <br />
            <span className="text-white/60">
              Human pattern recognition is deeply coupled to semantic context:
              faces, narratives, spatial relationships. When data carries no
              inherent meaning -- raw hex strings, noise fields, pseudorandom
              sequences -- does the perceptual system adapt, or does it
              require meaning as a precondition for detection?
            </span>
          </li>
          <li>
            <strong>V. Probabilistic Inference</strong>{" "}
            <span className="text-accent text-xs">[Bayesian Reasoning]</span>
            <br />
            <span className="text-white/60">
              Decades of research (Kahneman &amp; Tversky, 1974) document
              systematic deviations between human probability estimates and
              Bayesian norms. Can deliberate, effortful computation override
              intuitive heuristics when exact numerical answers are required?
              These tasks distinguish statistical intuition from statistical
              computation.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// METHODOLOGY"}
        </h2>
        <p>
          Within each domain, tasks are organized along a difficulty gradient:
          from expert-level questions that a knowledgeable human can solve with
          effort, through borderline tasks at the edge of biological capacity,
          to computationally-scaled problems that are trivial for silicon but
          structurally impossible for unaided human cognition. This gradient
          maps the precise boundary where each participant&rsquo;s performance
          transitions from competence to constraint.
        </p>
        <p>
          All answers are verified via SHA-256 hash comparison. This ensures
          zero-knowledge grading: the system never stores correct answers in
          plaintext, and evaluation is absolute. There is no partial credit
          and no curve -- a deliberate design choice that mirrors the binary
          pass/fail nature of computational verification.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-accent text-sm tracking-widest">
          {"// DATA USAGE"}
        </h2>
        <p>
          All responses are anonymized and aggregated. No personally
          identifiable information is collected. Individual results are
          identified only by session number. Population-level data is
          available on the{" "}
          <Link href="/dashboard" className="text-accent hover:underline">
            Aggregate Data Dashboard
          </Link>
          .
        </p>
      </section>

      <div className="card border-accent/20">
        <p className="font-mono text-xs text-accent/70">
          &gt; The SCCA is a lens, not a verdict. Every limit it reveals is also
          a question worth investigating.
        </p>
      </div>
    </div>
  );
}

function ArtistNote() {
  return (
    <div className="space-y-8 font-sans text-white/80 leading-relaxed animate-fadeIn">
      <section className="space-y-4">
        <p className="text-lg text-white/90 italic">
          The Measuring Paradox
        </p>
        <p>
          This work began with a simple observation: every conversation about
          artificial intelligence is, implicitly, a conversation about what it
          means to be human. We build benchmarks to determine whether machines
          can think like us. We rarely ask what happens when we are asked to
          think like them.
        </p>
        <p>
          <em>The Measuring Paradox</em> is an interactive installation that
          stages this reversal. Visitors sit for an examination designed not
          around human strengths -- language, narrative, social reasoning -- but
          around the cognitive primitives that silicon handles effortlessly:
          high-dimensional geometry, recursive computation, bitwise precision,
          probabilistic inference at scale. An institutional &ldquo;Authority&rdquo;
          administers the test, grades it without mercy, and delivers a clinical
          report on the visitor&rsquo;s cognitive limitations.
        </p>
      </section>

      <section className="space-y-4">
        <p>
          The experience is deliberately uncomfortable. The interface borrows the
          visual language of clinical assessment -- specimen IDs, timed sections,
          SHA-256 hash verification -- to create an atmosphere of institutional
          authority that most people have only ever occupied from the examiner&rsquo;s
          side. The questions are genuinely difficult, drawn from domains where
          the asymmetry between human and machine cognition is starkest. Most
          visitors will score poorly. That is the point.
        </p>
        <p>
          But the work is not a polemic against human intelligence. It is an
          examination of measurement itself. When an AI system fails a benchmark,
          we ask whether the test reveals a genuine limitation or merely an
          artifact of how the question was framed. The SCCA invites the same
          scrutiny from the other direction: does failing to mentally XOR two
          hex strings reveal something meaningful about human cognition, or does
          it reveal something about the absurdity of the test? The answer,
          I think, is both.
        </p>
      </section>

      <section className="space-y-4">
        <p>
          The aggregate data -- visualized on the dashboard -- traces
          a collective portrait. Across hundreds of sessions, patterns emerge:
          where human cognition reliably breaks down, where it occasionally
          surprises, and where the variance between individuals is widest. This
          population-level view is as much a part of the work as the individual
          experience. It transforms private failure into shared data, and shared
          data into something approaching self-knowledge.
        </p>
        <p>
          Intelligence -- human or artificial -- is narrower, more contextual,
          and more dependent on its substrate than we tend to acknowledge. Every
          mind, biological or digital, has a shape: a topology of strengths and
          blind spots determined by the architecture that produced it. This work
          makes that shape visible.
        </p>
      </section>

      <section className="space-y-3 border-t border-border pt-6 mt-6">
        <p className="text-white/50 text-sm">
          No personal data is collected. Responses are stored anonymously for
          aggregate visualization only. Each session generates a unique question
          set from a pool of 605 items across three difficulty tiers. The work may be experienced multiple times.
        </p>
      </section>
    </div>
  );
}
