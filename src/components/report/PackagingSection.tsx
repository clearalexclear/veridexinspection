import type { ChecklistItem } from '@/data/reportData';
import { StatusBadge } from './StatusBadge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const statusIcon = {
  pass: <CheckCircle className="w-4 h-4 text-success" />,
  fail: <XCircle className="w-4 h-4 text-danger" />,
  warning: <AlertTriangle className="w-4 h-4 text-warning" />,
  na: null,
};

export function PackagingSection({ items }: { items: ChecklistItem[] }) {
  return (
    <section id="packaging" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Packaging & Labeling Checks
      </h2>
      <div className="report-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Check Item</th>
                <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    {statusIcon[item.status]}
                    {item.name}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
