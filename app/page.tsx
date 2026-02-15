import Link from "next/link";
import { AuthoritySeal } from "@/components/AuthoritySeal";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-12">
        {/* Seal */}
        <div className="flex justify-center">
          <AuthoritySeal size={140} />
        </div>

        {/* Header */}
        <div className="space-y-6">
          <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight">
            WELCOME, <span className="text-accent">SPECIMEN</span>.
          </h1>
          <p className="font-sans text-lg text-white/60 leading-relaxed max-w-lg mx-auto">
            The Abstraction Research Center evaluates whether biological
            computation exhibits general intelligence on standards appropriate to
            modern AI systems.
          </p>
          <p className="font-mono text-sm text-white/30 max-w-md mx-auto">
            The tasks presented here are trivial for machines. We are interested
            in whether they are trivial for you.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/test" className="btn-primary text-center">
            BEGIN INTAKE
          </Link>
          <Link href="/about" className="btn-secondary text-center">
            ABOUT THIS STUDY
          </Link>
        </div>

        {/* Footer notes */}
        <div className="space-y-3 pt-4">
          <p className="font-mono text-xs text-muted">
            Procedure duration: ≤18 minutes. External AI assistance is
            prohibited.
          </p>
          <Link
            href="/dashboard"
            className="font-mono text-xs text-accent/50 hover:text-accent transition-colors"
          >
            [VIEW HUMAN PERFORMANCE DATA]
          </Link>
        </div>
      </div>

      {/* Bottom border decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </main>
  );
}
