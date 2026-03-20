import type { DefectItem } from '@/data/reportData';
import { SeverityBadge } from './StatusBadge';
import { AlertTriangle, Wrench, Package } from 'lucide-react';

export function DefectsSection({ defects }: { defects: DefectItem[] }) {
  const grouped = {
    critical: defects.filter(d => d.severity === 'critical'),
    major: defects.filter(d => d.severity === 'major'),
    minor: defects.filter(d => d.severity === 'minor'),
  };

  const allGroups = [
    { key: 'critical', items: grouped.critical },
    { key: 'major', items: grouped.major },
    { key: 'minor', items: grouped.minor },
  ].filter(g => g.items.length > 0);

  return (
    <section id="defects" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Defect Summary
      </h2>

      <div className="space-y-6">
        {allGroups.map(group => (
          <div key={group.key}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{group.key} Defects ({group.items.length})</h3>
            </div>
            <div className="space-y-4">
              {group.items.map(defect => (
                <div key={defect.id} className="report-card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{defect.id}</span>
                        <SeverityBadge severity={defect.severity} />
                      </div>
                      <h4 className="text-base font-semibold text-foreground">{defect.title}</h4>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-danger/5 border border-danger/10">
                      <span className="text-xs text-danger font-medium">{defect.quantityAffected} units affected</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{defect.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                      <Wrench className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Action</p>
                        <p className="text-xs text-foreground mt-0.5">{defect.recommendedAction}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                      <Package className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Affected</p>
                        <p className="text-xs text-foreground mt-0.5">{defect.affectedCartons}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
