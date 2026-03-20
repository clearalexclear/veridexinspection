import type { ConformityItem } from '@/data/reportData';
import { StatusBadge } from './StatusBadge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const icons = {
  pass: <CheckCircle className="w-4 h-4 text-success" />,
  fail: <XCircle className="w-4 h-4 text-danger" />,
  warning: <AlertTriangle className="w-4 h-4 text-warning" />,
  na: null,
};

export function ConformitySection({ items }: { items: ConformityItem[] }) {
  return (
    <section id="conformity" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Product Conformity
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.name} className="report-card p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                {icons[item.status]}
                <span className="text-sm font-semibold text-foreground">{item.name}</span>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
