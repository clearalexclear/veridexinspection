import type { DefectItem } from '@/data/reportData';
import { SeverityBadge } from './StatusBadge';
import { AlertTriangle } from 'lucide-react';

export function DefectsSection({ defects }: { defects: DefectItem[] }) {
  if (defects.length === 0) return null;

  return (
    <section id="defects" className="report-section">
      <h2 className="section-title">
        <AlertTriangle className="w-5 h-5 text-warning" />
        Defects
      </h2>

      <div className="space-y-4">
        {defects.map((d) => (
          <div key={d.id} className="report-card overflow-hidden">
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-mono text-muted-foreground">{d.id}</span>
                <SeverityBadge severity={d.severity} />
                <span className="text-sm font-semibold text-foreground">{d.title}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{d.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Qty affected</span>
                  <p className="font-semibold text-foreground mt-0.5">{d.quantityAffected} units ({d.percentAffected}%)</p>
                </div>
                {d.affectedCartons && (
                  <div>
                    <span className="text-muted-foreground">Affected cartons</span>
                    <p className="font-semibold text-foreground mt-0.5">{d.affectedCartons}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
