import type { ActionPlanItem } from '@/data/reportData';
import { ListChecks, Clock, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const priorityConfig = {
  high: { label: 'HIGH', classes: 'bg-danger/10 text-danger border-danger/20' },
  medium: { label: 'MEDIUM', classes: 'bg-warning/10 text-warning border-warning/20' },
  low: { label: 'LOW', classes: 'bg-muted text-muted-foreground border-border' },
};

export function ActionPlanSection({ items }: { items: ActionPlanItem[] }) {
  return (
    <section id="action-plan" className="report-section pt-0">
      <h2 className="section-title">
        <ListChecks className="w-5 h-5 text-primary" />
        What Should You Do Next?
      </h2>

      <div className="space-y-3">
        {items.map((item, i) => {
          const pc = priorityConfig[item.priority];
          return (
            <div key={i} className="report-card p-5 fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
                    <h3 className="text-sm font-semibold text-foreground">{item.issue}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">{item.action}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">{item.estimatedDays}</span>
                  </div>
                  <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border', pc.classes)}>
                    {pc.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
