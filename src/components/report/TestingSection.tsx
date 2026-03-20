import type { TestItem } from '@/data/reportData';
import { StatusBadge } from './StatusBadge';

export function TestingSection({ tests }: { tests: TestItem[] }) {
  return (
    <section id="testing" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Functional Testing
      </h2>
      <div className="report-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Test</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Tested</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Passed</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Failed</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Notes</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(t => (
                <tr key={t.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{t.name}</td>
                  <td className="px-4 py-4 text-center font-mono tabular-nums">{t.unitsTested}</td>
                  <td className="px-4 py-4 text-center font-mono tabular-nums text-success">{t.passed}</td>
                  <td className="px-4 py-4 text-center font-mono tabular-nums text-danger">{t.failed}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{t.notes}</td>
                  <td className="px-4 py-4 text-center"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
