import type { KeyIssue } from '@/data/reportData';
import { SeverityBadge } from './StatusBadge';
import { Flame } from 'lucide-react';

export function KeyIssuesBlock({ issues }: { issues: KeyIssue[] }) {
  return (
    <section id="key-issues" className="report-section pt-0 pb-4">
      <h2 className="section-title">
        <Flame className="w-5 h-5 text-danger" />
        Top Issues You Must Fix Before Shipping
      </h2>

      <div className="space-y-3">
        {issues.map((issue, i) => (
          <div
            key={i}
            className="report-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3 shrink-0">
              <span className="w-8 h-8 rounded-full bg-danger/10 text-danger text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <SeverityBadge severity={issue.severity} className="text-xs px-3 py-1" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{issue.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{issue.impactDescription}</p>
            </div>
            <div className="shrink-0 px-3 py-1.5 rounded-lg bg-danger/5 border border-danger/10">
              <span className="text-xs font-semibold text-danger tabular-nums">{issue.percentAffected}%</span>
              <span className="text-xs text-muted-foreground ml-1">affected</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
