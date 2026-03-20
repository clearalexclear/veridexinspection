import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '@/assets/inspectra-logo.png';
import { useAuth } from '@/hooks/useAuth';
import {
  Shield, CheckCircle, BarChart3, Clock, ArrowRight, Zap, Eye, FileCheck,
} from 'lucide-react';

const features = [
  { icon: Shield, title: 'Decision-First Reports', desc: 'Know in seconds whether to ship, fix, or reject — not after reading 20 pages.' },
  { icon: BarChart3, title: 'Supplier Scoring', desc: 'Track supplier reliability over time with data-driven scorecards.' },
  { icon: Clock, title: 'Time-to-Fix Estimates', desc: 'Get actionable timelines for correcting issues before shipment.' },
  { icon: Eye, title: 'Visual Evidence', desc: 'High-resolution photo galleries with defect tagging and categorization.' },
];

const steps = [
  { num: '01', title: 'Book Inspection', desc: 'Tell us what, where, and when. We handle the rest.' },
  { num: '02', title: 'We Inspect', desc: 'Our inspector visits the factory and checks everything.' },
  { num: '03', title: 'Get Your Report', desc: 'Receive an interactive decision report — not a boring PDF.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Inspectra" className="w-7 h-7" />
            <span className="font-semibold text-foreground text-sm tracking-tight">Inspectra</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button size="sm" onClick={() => navigate('/dashboard')}>Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Sign In</Button>
                <Button size="sm" onClick={() => navigate('/auth')}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            Quality intelligence for modern importers
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.08] mb-6">
            Know in 10 seconds if you should ship your order
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Inspectra turns factory inspections into clear, actionable shipment decisions. No more 30-page PDFs — just the answer you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="px-8" onClick={() => navigate('/book')}>
              Book Inspection <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" size="lg" className="px-8" onClick={() => navigate('/sample-report')}>
              <FileCheck className="w-4 h-4 mr-1" /> See Sample Report
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">Why importers choose Inspectra</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="report-card p-6">
                <f.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <span className="text-3xl font-bold text-primary/20 block mb-3 font-mono">{s.num}</span>
                <h3 className="font-semibold text-foreground mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to take control of your supply chain?</h2>
          <p className="text-muted-foreground mb-8">Book your first inspection and see the difference.</p>
          <Button size="lg" className="px-10" onClick={() => navigate('/book')}>
            Book Inspection <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inspectra" className="w-5 h-5" />
            <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Inspectra Quality Services</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <button onClick={() => navigate('/sample-report')} className="hover:text-foreground transition-colors">Sample Report</button>
            <button onClick={() => navigate('/auth')} className="hover:text-foreground transition-colors">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
