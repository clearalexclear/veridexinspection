import { ScoreRing } from './ScoreRing';
import { OverallResultBadge, RiskBadge } from './StatusBadge';
import { AlertTriangle, AlertOctagon, Info, BarChart3 } from 'lucide-react';
import type { InspectionReport, DefectItem, AQLData } from '@/data/reportData';

export function ExecutiveSummary({ report, defects, aql }: { report: InspectionReport; defects: DefectItem[]; aql: AQLData }) {
  const critical = defects.filter(d => d.severity === 'critical').length;
  const major = defects.filter(d => d.severity === 'major').length;
  const minor = defects.filter(d => d.severity === 'minor').length;

  const aqlLabel = aql.result === 'pass' ? 'PASSED' : aql.result === 'fail' ? 'FAILED' : 'WARNING';
  const aqlColor = aql.result === 'pass' ? 'text-success' : aql.result === 'fail' ? 'text-danger' : 'text-warning';

  return (
    <section id="summary" className="report-section">
      <h2 className="section-title">
        <BarChart3 className="w-5 h-5 text-primary" />
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

        {/* Issue Counts + AQL */}
        <div className="report-card p-6 fade-in-up stagger-1">
          <h3 className="text-sm font-semibold text-foreground mb-4">Issues Found</h3>
          <div className="space-y-3">
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
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">AQL Result</span>
            <span className={`text-sm font-bold ${aqlColor}`}>{aqlLabel}</span>
          </div>
        </div>

        {/* Risk Explanation */}
        <div className="report-card p-6 fade-in-up stagger-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Explanation</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{report.recommendation}</p>
          <div className="p-3 rounded-lg bg-warning/5 border border-warning/10">
            <p className="text-xs font-semibold text-warning mb-1">Key Risk</p>
            <p className="text-xs text-muted-foreground">
              AQL Major defects ({aql.major.found} found vs {aql.major.accept} acceptable) exceed threshold. {aql.minor.found > aql.minor.accept ? 'Minor defects also exceed limit.' : 'Minor defects within tolerance.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
