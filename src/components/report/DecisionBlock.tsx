import type { InspectionReport } from '@/data/reportData';
import { ScoreRing } from './ScoreRing';
import { Shield, TrendingDown, AlertTriangle, CheckCircle, XCircle, Send, RotateCcw, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const decisionConfig = {
  'low-risk': {
    label: 'LOW RISK – READY FOR SHIPMENT',
    icon: '✅',
    bg: 'bg-success/8',
    border: 'border-success/30',
    text: 'text-success',
    glow: 'shadow-[0_0_40px_-8px_hsl(152,60%,36%,0.3)]',
  },
  'moderate-risk': {
    label: 'MODERATE RISK – IMPROVEMENTS RECOMMENDED',
    icon: '⚠️',
    bg: 'bg-warning/8',
    border: 'border-warning/30',
    text: 'text-warning',
    glow: 'shadow-[0_0_40px_-8px_hsl(38,92%,50%,0.3)]',
  },
  'high-risk': {
    label: 'HIGH RISK – ACTION REQUIRED BEFORE SHIPPING',
    icon: '❌',
    bg: 'bg-danger/8',
    border: 'border-danger/30',
    text: 'text-danger',
    glow: 'shadow-[0_0_40px_-8px_hsl(0,72%,51%,0.3)]',
  },
};

const riskConfig = {
  low: { label: 'LOW RISK', classes: 'bg-success/10 text-success border-success/20' },
  medium: { label: 'MEDIUM RISK', classes: 'bg-warning/10 text-warning border-warning/20' },
  high: { label: 'HIGH RISK', classes: 'bg-danger/10 text-danger border-danger/20' },
};

export function DecisionBlock({ report }: { report: InspectionReport }) {
  const dc = decisionConfig[report.decision];
  const rc = riskConfig[report.riskLevel];

  return (
    <section id="decision" className="report-section pt-6 pb-8">
      <div className={cn('report-card border-2 p-0 overflow-hidden', dc.border, dc.glow)}>
        {/* Decision header bar */}
        <div className={cn('px-8 py-6', dc.bg)}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{dc.icon}</span>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1">Shipment Assessment</p>
                <h2 className={cn('text-2xl lg:text-3xl font-extrabold tracking-tight leading-none', dc.text)}>
                  {dc.label}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <span className={cn('inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border', rc.classes)}>
                <Shield className="w-3.5 h-3.5" />
                {rc.label}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Confidence */}
          <div className="p-6 flex flex-col items-center text-center">
            <ScoreRing score={report.confidenceScore} size={110} strokeWidth={8} />
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mt-3">Confidence Score</p>
          </div>

          {/* Business Impact */}
          <div className="p-6">
            <div className="flex items-start gap-3 mb-3">
              <TrendingDown className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-1.5">Estimated Business Impact</p>
                <p className="text-sm text-foreground leading-relaxed">{report.businessImpact}</p>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-1.5">Quick Summary</p>
                <p className="text-sm text-foreground leading-relaxed">{report.quickSummary}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="border-t border-border px-8 py-5 bg-muted/30">
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-success text-success-foreground text-sm font-semibold hover:bg-success/90 active:scale-[0.97] transition-all duration-150">
              <Send className="w-4 h-4" />
              Approve Shipment
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-warning text-warning-foreground text-sm font-semibold hover:bg-warning/90 active:scale-[0.97] transition-all duration-150">
              <Wrench className="w-4 h-4" />
              Request Corrections
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted active:scale-[0.97] transition-all duration-150">
              <RotateCcw className="w-4 h-4" />
              Schedule Re-inspection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
