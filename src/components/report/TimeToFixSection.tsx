import type { TimeToFixItem } from '@/data/reportData';
import { Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TimeToFixSection({ items }: { items: TimeToFixItem[] }) {
  return (
    <section id="time-to-fix" className="report-section">
      <h2 className="section-title">
        <Clock className="w-5 h-5 text-primary" />
        Estimated Time to Make Shipment Compliant
      </h2>

      <div className="report-card p-6">
        <div className="space-y-3">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg',
                  isLast ? 'bg-primary/5 border-2 border-primary/20' : 'bg-muted/50'
                )}
              >
                <div className="flex items-center gap-3">
                  {isLast ? (
                    <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 shrink-0" />
                  )}
                  <span className={cn('text-sm', isLast ? 'font-bold text-foreground' : 'text-foreground')}>{item.task}</span>
                </div>
                <span className={cn('text-sm font-semibold tabular-nums', isLast ? 'text-primary' : 'text-muted-foreground')}>
                  {item.estimatedDays}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
