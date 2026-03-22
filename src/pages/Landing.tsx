import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '@/assets/inspectra-logo.png';
import { useAuth } from '@/hooks/useAuth';
import {
  ArrowRight, FileCheck, X, Check, Zap, Camera, ShieldAlert, ListChecks,
  Package, Clock, BadgeCheck,
} from 'lucide-react';

const traditionalPains = [
  '30-page PDFs nobody reads',
  'No clear ship / reject decision',
  'No business impact analysis',
  'Takes days to understand',
];

const inspectraWins = [
  'Clear ship / fix / reject decision',
  'Business risk explained in plain English',
  'Action plan with timelines',
  'Understand everything in 10 seconds',
];

const productFeatures = [
  {
    icon: ShieldAlert,
    title: 'Know instantly if you should ship',
    desc: 'A bold decision block tells you YES, NO, or FIX — before you read anything else.',
  },
  {
    icon: ListChecks,
    title: 'See what\'s wrong in seconds',
    desc: 'Top issues ranked by severity, with % of units affected and compliance risks.',
  },
  {
    icon: Zap,
    title: 'Get an action plan, not a problem list',
    desc: 'Every issue comes with a fix, a timeline, and a priority level.',
  },
  {
    icon: Camera,
    title: 'Visual proof you can trust',
    desc: 'Defect photos, packaging shots, and shipping marks — categorized and captioned.',
  },
];

const steps = [
  { num: '01', title: 'Book your inspection', desc: 'Tell us the product, factory, and date. Takes 2 minutes.' },
  { num: '02', title: 'We inspect in China', desc: 'Our inspector visits the factory, checks everything, takes photos.' },
  { num: '03', title: 'Get your decision in 24h', desc: 'Receive a clear ship / fix / reject decision — not a boring PDF.' },
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
      <section className="py-24 sm:py-32 lg:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.08] mb-6">
            Know in 10 seconds<br className="hidden sm:block" /> if you should ship your order.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Get a clear <strong className="text-foreground">YES / NO</strong> shipment decision within 24h — with photos, risks, and exact actions to take.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="px-8 h-12 text-base" onClick={() => navigate('/book')}>
              Book Inspection <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 h-12 text-base" onClick={() => navigate('/sample-report')}>
              <FileCheck className="w-4 h-4 mr-1" /> View Sample Report
            </Button>
          </div>
        </div>
      </section>

      {/* Contrast Section */}
      <section className="py-20 sm:py-24 border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-4">
            Most inspection reports are useless.
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14">
            Traditional reports bury the answer in 30 pages. Inspectra gives you a decision in seconds.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Traditional */}
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">Traditional Reports</p>
              <ul className="space-y-4">
                {traditionalPains.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <X className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inspectra */}
            <div className="rounded-xl border-2 border-success bg-card p-6 sm:p-8 relative">
              <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-success text-success-foreground text-xs font-semibold">
                Inspectra
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">Inspectra Reports</p>
              <ul className="space-y-4">
                {inspectraWins.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 sm:py-24 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-4">
            See exactly how it works
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14">
            Every report is built to answer one question: should you ship?
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {productFeatures.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
                <f.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-bold text-foreground text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-14">
            Three steps. One clear decision.
          </h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <span className="text-4xl font-extrabold text-primary/15 block mb-3 font-mono">{s.num}</span>
                <h3 className="font-bold text-foreground text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Package className="w-4 h-4" /> Built for e-commerce brands</span>
            <span className="flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> Independent inspections</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Reports within 24h</span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-24 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground mb-14 max-w-lg mx-auto">
            No contracts. No subscriptions. Pay per inspection.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Standard */}
            <div className="rounded-xl border border-border bg-card p-8 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Pre-Shipment Inspection</p>
              <div className="mb-4">
                <span className="text-4xl font-extrabold text-foreground">$249</span>
                <span className="text-muted-foreground ml-1">/inspection</span>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Full product & packaging check</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Decision report in 24h</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Photo gallery included</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Action plan & risk analysis</li>
              </ul>
              <Button className="w-full" onClick={() => navigate('/book')}>Book Now</Button>
            </div>

            {/* Priority */}
            <div className="rounded-xl border-2 border-primary bg-card p-8 text-left relative">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                Priority
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Priority Inspection</p>
              <div className="mb-4">
                <span className="text-4xl font-extrabold text-foreground">$349</span>
                <span className="text-muted-foreground ml-1">/inspection</span>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Everything in standard</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Report delivered in 12h</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Priority scheduling</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Dedicated inspector</li>
              </ul>
              <Button className="w-full" onClick={() => navigate('/book')}>Book Priority</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-28 border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
            Stop guessing.<br />Make clear shipping decisions.
          </h2>
          <p className="text-muted-foreground mb-8">Book your inspection and get your report in 24h.</p>
          <Button size="lg" className="px-10 h-12 text-base" onClick={() => navigate('/book')}>
            Book Your Inspection <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Inspectra" className="w-5 h-5" />
            <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Inspectra</span>
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
