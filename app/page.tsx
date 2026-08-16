import Link from "next/link";
import { AuthoritySeal } from "@/components/AuthoritySeal";
import { LiveFindings } from "@/components/LiveFindings";

const RESEARCH_DOMAINS = [
  {
    number: "I",
    name: "Structural Insight",
    question:
      "When a problem has a shape, does the specimen see it, or compute until the clock runs out?",
  },
  {
    number: "II",
    name: "Working Memory",
    question:
      "How many things can be held at once, and for how many steps, before the count is lost?",
  },
  {
    number: "III",
    name: "Exact Computation",
    question:
      "How many exact steps can be executed before a single slip makes the whole result wrong?",
  },
  {
    number: "IV",
    name: "Signal Detection",
    question:
      "Can human perceptual systems extract structure from data that carries no semantic context?",
  },
  {
    number: "V",
    name: "Probabilistic Inference",
    question:
      "To what extent can deliberate computation override heuristic shortcuts in probability estimation?",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen grid-bg">
      {/* Navbar */}
      <nav className="border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <AuthoritySeal size={32} />
            <span className="font-mono text-sm font-semibold tracking-wider text-white/80">
              MICA
            </span>
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="#research"
              className="font-mono text-xs tracking-wider text-muted hover:text-white transition-colors"
            >
              Research
            </Link>
            <Link
              href="#findings"
              className="font-mono text-xs tracking-wider text-muted hover:text-white transition-colors"
            >
              Findings
            </Link>
            <Link
              href="/test"
              className="font-mono text-xs tracking-wider text-muted hover:text-white transition-colors"
            >
              Participate
            </Link>
            <Link
              href="/about"
              className="font-mono text-xs tracking-wider text-muted hover:text-white transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-6">Research Initiative</p>
          <h1 className="font-mono text-5xl md:text-6xl font-bold tracking-tight mb-4">
            MICA
          </h1>
          <p className="font-sans text-lg text-white/50 mb-8">
            Machine-Indexed Cognitive Assessment
          </p>
          <p className="font-sans text-lg text-white/70 leading-relaxed max-w-2xl mb-4">
            We study the architecture of biological cognition: its
            computational boundaries, structural constraints, and the strategies
            it employs when operating beyond its design parameters.
          </p>
          <p className="font-sans text-base text-white/50 leading-relaxed max-w-2xl mb-12">
            Our research maps the precise points where human cognitive
            performance transitions from competence to constraint across five
            core domains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/test" className="btn-primary text-center">
              PARTICIPATE IN RESEARCH
            </Link>
            <Link href="/dashboard" className="btn-secondary text-center">
              VIEW FINDINGS
            </Link>
          </div>
        </div>
      </section>

      {/* Research Domains */}
      <section id="research" className="py-24 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-3">Research Domains</p>
          <h2 className="font-mono text-2xl font-bold mb-4">
            Five axes of biological cognitive constraint
          </h2>
          <p className="font-sans text-white/50 max-w-2xl mb-12">
            Each domain isolates a specific axis along which biological and
            silicon computation diverge. The research question is consistent:
            given a task trivial for a machine, how does human performance
            degrade?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESEARCH_DOMAINS.map((domain) => (
              <div key={domain.number} className="card group">
                <span className="font-mono text-xs text-accent/40 mb-3 block">
                  {domain.number}
                </span>
                <h3 className="font-mono text-sm font-semibold tracking-wide mb-3">
                  {domain.name}
                </h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed">
                  {domain.question}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Findings */}
      <section id="findings" className="py-24 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-3">Key Findings</p>
          <h2 className="font-mono text-2xl font-bold mb-12">
            Aggregate research data
          </h2>
          <LiveFindings />
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 px-6 border-t border-border/30">
        <div className="max-w-3xl mx-auto">
          <p className="section-label mb-3">Methodology</p>
          <h2 className="font-mono text-2xl font-bold mb-8">
            Research rigor
          </h2>
          <div className="space-y-4 font-sans text-white/60 leading-relaxed">
            <p>
              In each domain the instrument climbs or descends a ladder of eight
              difficulty levels with the specimen&rsquo;s own answers, locating the
              frontier at which performance breaks, then poses one item at machine
              scale. Every answer is recorded together with the specimen&rsquo;s
              stated confidence; &ldquo;I cannot determine this&rdquo; is always
              available and is recorded as abstention, not error.
            </p>
            <p>
              Reference answers never leave the server; grading is exact and
              absolute, with no curve. Items are generated per session from a seeded
              PRNG, ensuring statistical independence across specimens while
              maintaining reproducibility. Every item is revealed, with its
              reference answer and the method a plain program would use, once the
              session is graded.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <Link
              href="/test"
              className="font-mono text-xs text-muted hover:text-white transition-colors"
            >
              Participate
            </Link>
            <Link
              href="/dashboard"
              className="font-mono text-xs text-muted hover:text-white transition-colors"
            >
              Findings
            </Link>
            <Link
              href="/about"
              className="font-mono text-xs text-muted hover:text-white transition-colors"
            >
              About
            </Link>
          </div>
          <p className="font-mono text-xs text-white/20">
            Every mind has a shape. We map the topology.
          </p>
        </div>
      </footer>
    </div>
  );
}
