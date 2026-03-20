import type { MeasurementRow } from '@/data/reportData';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

export function MeasurementsSection({ rows }: { rows: MeasurementRow[] }) {
  return (
    <section id="measurements" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Measurement & Specification Check
      </h2>
      <div className="report-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Parameter</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Spec</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Actual</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Tolerance</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.parameter} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{r.parameter}</td>
                  <td className="px-4 py-4 text-center font-mono text-xs">{r.spec}</td>
                  <td className={cn('px-4 py-4 text-center font-mono text-xs font-semibold', r.status === 'fail' && 'text-danger')}>{r.actual}</td>
                  <td className="px-4 py-4 text-center font-mono text-xs text-muted-foreground">{r.tolerance}</td>
                  <td className="px-4 py-4 text-center"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
