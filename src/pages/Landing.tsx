import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import veridexLogo from '@/assets/veridex-logo-full.png';
import { ttqTrack, ttqTrackOnce } from '@/lib/tiktok';

import { useAuth } from '@/hooks/useAuth';
import {
  ArrowRight, FileCheck, X, Check, Zap, Camera, ClipboardList, ListChecks,
  Package, Clock, BadgeCheck, AlertTriangle, CheckCircle, XCircle,
} from 'lucide-react';

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, cls: visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6' };
}

/* ── Cycling status badge ── */
const statuses = [
  { label: 'AQL MAJOR: EXCEEDED', icon: XCircle, color: 'bg-danger/15 text-danger', glow: 'shadow-[0_0_20px_hsl(0_72%_51%/0.25)]' },
  { label: '2 TESTS: WARNING', icon: AlertTriangle, color: 'bg-warning/15 text-warning', glow: 'shadow-[0_0_20px_hsl(27_96%_61%/0.25)]' },
  { label: 'ALL CHECKS: PASS', icon: CheckCircle, color: 'bg-success/15 text-success', glow: 'shadow-[0_0_20px_hsl(142_71%_45%/0.25)]' },
];

function CyclingStatus() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => { setIdx((i) => (i + 1) % statuses.length); setFading(false); }, 300);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const d = statuses[idx];
  const Icon = d.icon;
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-bold transition-all duration-300 ${d.color} ${d.glow} ${fading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <Icon className="w-5 h-5" /> {d.label}
    </div>
  );
}

/* ── Data ── */
const traditionalPains = [
  '30-page PDFs nobody reads',
  'No structured data',
  'Hard to compare inspections',
  'Takes days to understand',
];
const veridexWins = [
  'Structured, fact-based reports',
  'Defects, AQL, and tests — clearly organized',
  'Visual proof with categorized photos',
  'Understand everything in seconds',
];
const productFeatures = [
  { icon: ClipboardList, title: 'All facts at a glance', desc: 'Defect counts, AQL results, quantities, and test outcomes — structured and clear.' },
  { icon: ListChecks, title: 'See what failed and what passed', desc: 'Every check is categorized by status: pass, fail, or warning.' },
  { icon: Zap, title: 'Structured data, not opinions', desc: 'Facts presented without interpretation — you decide what matters.' },
  { icon: Camera, title: 'Visual proof you can trust', desc: 'Defect photos, packaging shots, and shipping marks — categorized and captioned.' },
];
const steps = [
  { num: '01', title: 'Book your inspection', desc: 'Tell us the product, factory, and date. Takes 2 minutes.' },
  { num: '02', title: 'We inspect in China', desc: 'Our inspector visits the factory, checks everything, takes photos.' },
  { num: '03', title: 'Get your report in 24h', desc: 'Receive a structured, fact-based inspection report — not a boring PDF.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const hero = useReveal();
  const dark = useReveal();
  const contrast = useReveal();
  const showcase = useReveal();
  const howIt = useReveal();
  const pricing = useReveal();
  const cta = useReveal();

  // Scroll-depth tracking (once per session)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (max <= 0) return;
      const pct = (h.scrollTop / max) * 100;
      const tiers: Array<[number, string]> = [
        [25, 'Homepage 25 Percent Scroll'],
        [50, 'Homepage 50 Percent Scroll'],
        [75, 'Homepage 75 Percent Scroll'],
        [90, 'Homepage 90 Percent Scroll'],
      ];
      for (const [t, name] of tiers) {
        if (pct >= t) ttqTrackOnce(`scroll-${t}`, 'ViewContent', { content_name: name, content_type: 'scroll' });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pricing section in-view
  useEffect(() => {
    const el = pricing.ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        ttqTrackOnce('pricing-view', 'ViewContent', { content_name: 'Pricing Section Viewed', content_type: 'pricing' });
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [pricing.ref]);

  const trackCta = (text: string) => ttqTrack('ClickButton', { content_name: 'Primary CTA Click', button_text: text });
  const trackPricing = (plan: string) => ttqTrack('ClickButton', { content_name: 'Pricing Plan Click', plan_name: plan });
  const trackSample = () => ttqTrack('ClickButton', { content_name: 'View Sample Report Click', content_type: 'cta' });

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-36 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5" aria-label="Veridex home">
            <img src={veridexLogo} alt="Veridex logo" className="h-28 w-auto" />
          </button>
          <div className="flex items-center gap-3">
            {user ? (
              <Button size="sm" className="btn-gradient" onClick={() => navigate('/dashboard')}>Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Sign In</Button>
                <Button size="sm" className="btn-gradient" onClick={() => { trackCta('Get Started'); navigate('/auth'); }}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: 'linear-gradient(135deg, hsl(217 91% 53%), hsl(192 91% 42%))' }} />

        <div ref={hero.ref} className={`relative max-w-4xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ease-out ${hero.cls}`}>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-foreground leading-[1.08] mb-6">
            Make sure your shipment is<br className="hidden sm:block" /> Amazon-ready before it leaves the factory.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Veridex turns factory inspections into structured, fact-based data — defects, AQL, tests, and photos — delivered in 24h.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button className="btn-gradient h-12 px-8 rounded-lg text-base inline-flex items-center gap-2" onClick={() => { trackCta('Book Inspection'); navigate('/book'); }}>
              Book Inspection <ArrowRight className="w-4 h-4" />
            </button>
            <Button variant="outline" size="lg" className="px-8 h-12 text-base border-primary/30 text-primary hover:bg-primary/5" onClick={() => { trackSample(); navigate('/sample-report'); }}>
              <FileCheck className="w-4 h-4 mr-1" /> View Sample Report
            </Button>
          </div>
        </div>
      </section>

      {/* Dark Report Preview */}
      <section className="py-20 sm:py-28" style={{ backgroundColor: 'hsl(220 40% 8%)' }}>
        <div ref={dark.ref} className={`max-w-5xl mx-auto px-4 sm:px-6 transition-all duration-700 ease-out ${dark.cls}`}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-4" style={{ color: 'hsl(220 13% 91%)' }}>
            Your report looks like this
          </h2>
          <p className="text-center mb-14" style={{ color: 'hsl(215 16% 60%)' }}>
            Not a PDF. A structured, interactive inspection report.
          </p>

          <div className="max-w-2xl mx-auto rounded-2xl border p-6 sm:p-8 space-y-5"
            style={{ backgroundColor: 'hsl(220 30% 12%)', borderColor: 'hsl(220 20% 18%)' }}>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'hsl(215 16% 50%)' }}>Inspection Status</p>
                <CyclingStatus />
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'hsl(215 16% 50%)' }}>Sample Size</p>
                <p className="text-3xl font-extrabold text-accent">315</p>
              </div>
            </div>

            <div className="h-px" style={{ backgroundColor: 'hsl(220 20% 18%)' }} />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'hsl(215 16% 50%)' }}>Defects Found</p>
              <div className="space-y-2.5">
                {[
                  { text: 'Label misalignment — 26 units (8.2%)', severity: 'major' },
                  { text: 'Missing suffocation warnings — 11 units', severity: 'major' },
                  { text: 'Minor cosmetic dents — 4 units', severity: 'minor' },
                ].map((issue) => (
                  <div key={issue.text}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: 'hsl(220 13% 80%)' }}>
                    {issue.severity === 'major'
                      ? <XCircle className="w-4 h-4 text-warning shrink-0" />
                      : <CheckCircle className="w-4 h-4 text-success shrink-0" />}
                    {issue.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px" style={{ backgroundColor: 'hsl(220 20% 18%)' }} />

            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'hsl(215 16% 50%)' }}>AQL Major</p>
                <p className="text-lg font-bold text-danger">37 found <span className="text-xs" style={{ color: 'hsl(215 16% 50%)' }}>/ 7 accept</span></p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'hsl(215 16% 50%)' }}>AQL Minor</p>
                <p className="text-lg font-bold text-warning">12 found <span className="text-xs" style={{ color: 'hsl(215 16% 50%)' }}>/ 10 accept</span></p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'hsl(215 16% 50%)' }}>Tests</p>
                <p className="text-lg font-bold" style={{ color: 'hsl(220 13% 80%)' }}>5 run</p>
              </div>
            </div>
          </div>

          <p className="text-center mt-8">
            <button className="text-accent hover:underline text-sm font-medium inline-flex items-center gap-1" onClick={() => { trackSample(); navigate('/sample-report'); }}>
              Explore full sample report <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </p>
        </div>
      </section>

      {/* Contrast */}
      <section className="py-20 sm:py-24">
        <div ref={contrast.ref} className={`max-w-5xl mx-auto px-4 sm:px-6 transition-all duration-700 ease-out ${contrast.cls}`}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-4">Most inspection reports are useless.</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14">Traditional reports bury the facts in 30 pages. Veridex structures everything clearly.</p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">Traditional Reports</p>
              <ul className="space-y-4">
                {traditionalPains.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground"><X className="w-5 h-5 text-danger shrink-0 mt-0.5" /><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-card p-6 sm:p-8 shadow-md relative transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm">Veridex</div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">Veridex Reports</p>
              <ul className="space-y-4">
                {veridexWins.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-foreground"><Check className="w-5 h-5 text-success shrink-0 mt-0.5" /><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-20 sm:py-24 bg-muted/40">
        <div ref={showcase.ref} className={`max-w-5xl mx-auto px-4 sm:px-6 transition-all duration-700 ease-out ${showcase.cls}`}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-4">See exactly what you get</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14">Every report is structured to show you the facts — clearly and fast.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {productFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/20">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24">
        <div ref={howIt.ref} className={`max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-700 ease-out ${howIt.cls}`}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground text-center mb-14">Three steps. Clear inspection data.</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <span className="text-5xl font-extrabold block mb-3 font-mono bg-gradient-to-br from-primary/20 to-accent/20 bg-clip-text text-transparent">{s.num}</span>
                <h3 className="font-bold text-foreground text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-14 bg-muted/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Package className="w-4 h-4 text-accent" /> Built for e-commerce brands</span>
            <span className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-accent" /> Independent inspections</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent" /> Reports within 24h</span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-24">
        <div ref={pricing.ref} className={`max-w-4xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ease-out ${pricing.cls}`}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mb-14 max-w-lg mx-auto">No contracts. No subscriptions. Pay per inspection.</p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-border bg-card p-8 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Pre-Shipment Inspection</p>
              <div className="mb-4"><span className="text-4xl font-extrabold text-foreground">$249</span><span className="text-muted-foreground ml-1">/inspection</span></div>
              <ul className="space-y-2.5 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Full product & packaging check</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Structured report in 24h</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Photo gallery included</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> AQL, defects & test results</li>
              </ul>
              <Button className="w-full" variant="outline" onClick={() => { trackPricing('Pre-Shipment Inspection'); trackCta('Book Now'); navigate('/book'); }}>Book Now</Button>
            </div>

            <div className="rounded-2xl border-2 border-primary bg-card p-8 text-left shadow-lg relative transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-xs font-semibold shadow-sm btn-gradient">Priority</div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Priority Inspection</p>
              <div className="mb-4"><span className="text-4xl font-extrabold text-foreground">$349</span><span className="text-muted-foreground ml-1">/inspection</span></div>
              <ul className="space-y-2.5 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Everything in standard</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Report delivered in 12h</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Priority scheduling</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Dedicated inspector</li>
              </ul>
              <button className="btn-gradient w-full h-10 rounded-lg text-sm" onClick={() => { trackPricing('Priority Inspection'); trackCta('Book Priority'); navigate('/book'); }}>Book Priority</button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-28 relative overflow-hidden" style={{ backgroundColor: 'hsl(220 40% 8%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-15 blur-[100px] pointer-events-none"
          style={{ background: 'linear-gradient(135deg, hsl(217 91% 53%), hsl(192 91% 42%))' }} />
        <div ref={cta.ref} className={`relative max-w-2xl mx-auto px-4 sm:px-6 text-center transition-all duration-700 ease-out ${cta.cls}`}>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4" style={{ color: 'hsl(220 13% 91%)' }}>
            Stop guessing.<br />Get the facts before you ship.
          </h2>
          <p className="mb-8" style={{ color: 'hsl(215 16% 60%)' }}>Book your inspection and get your structured report in 24h.</p>
          <button className="btn-gradient h-12 px-10 rounded-lg text-base inline-flex items-center gap-2" onClick={() => { trackCta('Book Your Inspection'); navigate('/book'); }}>
            Book Your Inspection <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">© {new Date().getFullYear()} Veridex</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <button onClick={() => { trackSample(); navigate('/sample-report'); }} className="hover:text-foreground transition-colors">Sample Report</button>
            <button onClick={() => navigate('/auth')} className="hover:text-foreground transition-colors">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
