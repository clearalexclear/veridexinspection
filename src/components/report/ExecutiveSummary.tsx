import { ScoreRing } from './ScoreRing';
import { OverallResultBadge, RiskBadge, DecisionBadge } from './StatusBadge';
import { AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import type { InspectionReport, DefectItem } from '@/data/reportData';

export function ExecutiveSummary({ report, defects }: { report: InspectionReport; defects: DefectItem[] }) {
  const critical = defects.filter(d => d.severity === 'critical').length;
  const major = defects.filter(d => d.severity === 'major').length;
  const minor = defects.filter(d => d.severity === 'minor').length;

  return (
    <section id="summary" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Executive Summary
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score & Status */}
        <div className="report-card p-6 flex flex-col items-center justify-center text-center fade-in-up">
          <ScoreRing score={report.qualityScore} size={140} strokeWidth={10} />
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-4 font-medium">Quality Score</p>
          <div className="mt-4 flex gap-3 flex-wrap justify-center">
            <OverallResultBadge result={report.overallResult} className="text-xs px-3 py-1.5" />
            <RiskBadge level={report.riskLevel} />
          </div>
        </div>

        {/* Issue Counts */}
        <div className="report-card p-6 fade-in-up stagger-1">
          <h3 className="text-sm font-semibold text-foreground mb-4">Issues Found</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-danger/5 border border-danger/10">
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-5 h-5 text-danger" />
                <span className="text-sm font-medium">Critical</span>
              </div>
              <span className="text-2xl font-bold tabular-nums text-danger">{critical}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/10">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium">Major</span>
              </div>
              <span className="text-2xl font-bold tabular-nums text-warning">{major}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">Minor</span>
              </div>
              <span className="text-2xl font-bold tabular-nums text-muted-foreground">{minor}</span>
            </div>
          </div>
        </div>

        {/* Decision */}
        <div className="report-card p-6 fade-in-up stagger-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Decision</h3>
          <div className="flex justify-center mb-4">
            <DecisionBadge decision={report.decision} className="text-base px-6 py-3" />
          </div>
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">{report.recommendation}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
