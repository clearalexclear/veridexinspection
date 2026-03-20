import type { AQLData } from '@/data/reportData';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

export function AQLSection({ aql }: { aql: AQLData }) {
  const rows = [
    { label: 'Critical', accept: aql.critical.accept, found: aql.critical.found, pass: aql.critical.found <= aql.critical.accept },
    { label: 'Major', accept: aql.major.accept, found: aql.major.found, pass: aql.major.found <= aql.major.accept },
    { label: 'Minor', accept: aql.minor.accept, found: aql.minor.found, pass: aql.minor.found <= aql.minor.accept },
  ];

  return (
    <section id="aql" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        AQL & Sampling Summary
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="report-card p-6">
          <h3 className="text-sm font-semibold mb-4">Sampling Parameters</h3>
          <dl className="space-y-3">
            {[
              ['Inspection Level', aql.inspectionLevel],
              ['Sample Size Code', aql.sampleSizeCode],
              ['Sample Size', aql.sampleSize.toString()],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between items-center py-2 border-b border-border">
                <dt className="text-sm text-muted-foreground">{l}</dt>
                <dd className="text-sm font-medium font-mono">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium">AQL Result</span>
            <StatusBadge status={aql.result} />
          </div>
        </div>

        <div className="report-card p-6">
          <h3 className="text-sm font-semibold mb-4">Defects vs Acceptance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Category</th>
                  <th className="text-center py-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Accept #</th>
                  <th className="text-center py-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Found</th>
                  <th className="text-right py-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.label} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{r.label}</td>
                    <td className="py-3 text-center font-mono">{r.accept}</td>
                    <td className={cn('py-3 text-center font-mono font-semibold', !r.pass && 'text-danger')}>{r.found}</td>
                    <td className="py-3 text-right">
                      <StatusBadge status={r.pass ? 'pass' : 'fail'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
