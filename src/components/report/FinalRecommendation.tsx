import type { InspectionReport } from '@/data/reportData';
import { DecisionBadge } from './StatusBadge';
import { CheckCircle, ArrowRight } from 'lucide-react';

export function FinalRecommendation({ report }: { report: InspectionReport }) {
  return (
    <section id="recommendation" className="report-section pb-16">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Final Recommendation
      </h2>

      <div className="report-card p-8">
        <div className="flex justify-center mb-8">
          <DecisionBadge decision={report.decision} className="text-lg px-8 py-4" />
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Reasons</h3>
          <ol className="space-y-3">
            {report.topReasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground">{reason}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-4 rounded-lg border border-border mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Recommended Next Step</h3>
          </div>
          <p className="text-sm text-muted-foreground">{report.nextStep}</p>
        </div>

        <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Inspector</p>
            <p className="text-sm font-medium text-foreground mt-1">{report.inspectorName}</p>
            <div className="mt-3 h-10 border-b-2 border-foreground/20 w-48" />
            <p className="text-[10px] text-muted-foreground mt-1">Signature</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Report Date</p>
            <p className="text-sm font-medium text-foreground mt-1">{report.date}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Report ID</p>
            <p className="text-sm font-medium text-foreground mt-1 font-mono">{report.id}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
