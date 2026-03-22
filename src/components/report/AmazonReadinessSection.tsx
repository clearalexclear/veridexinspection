import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ShoppingCart, CheckCircle2, AlertTriangle, XCircle, Package, Tag, ShieldCheck, Box, Barcode } from 'lucide-react';

export type AmazonStatus = 'READY' | 'READY WITH FIXES' | 'NOT READY';
export type CategoryStatus = 'ok' | 'issue' | 'critical';

export interface AmazonCategory {
  name: string;
  status: CategoryStatus;
  explanation: string;
}

export interface AmazonReadinessData {
  overallStatus: AmazonStatus;
  categories: AmazonCategory[];
  riskSummary: string;
  actionsRequired: string[];
}

const statusConfig: Record<AmazonStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  'READY': { label: 'READY', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30', icon: CheckCircle2 },
  'READY WITH FIXES': { label: 'READY WITH FIXES', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30', icon: AlertTriangle },
  'NOT READY': { label: 'NOT READY', color: 'bg-red-500/10 text-red-600 border-red-500/30', icon: XCircle },
};

const catStatusStyle: Record<CategoryStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  'ok': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: CheckCircle2 },
  'issue': { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: AlertTriangle },
  'critical': { bg: 'bg-red-500/10', text: 'text-red-600', icon: XCircle },
};

const catIcons: Record<string, typeof Package> = {
  'Labeling': Tag,
  'Packaging': Package,
  'Product Condition': ShieldCheck,
  'Compliance': Barcode,
  'Carton Quality': Box,
};

export function AmazonReadinessSection({ data }: { data: AmazonReadinessData }) {
  const cfg = statusConfig[data.overallStatus];
  const StatusIcon = cfg.icon;

  return (
    <section id="amazon-readiness" className="py-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <ShoppingCart className="w-5 h-5 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Amazon Readiness</h2>
      </div>

      {/* Overall Status */}
      <div className={cn('rounded-xl border p-6 flex items-center gap-4', cfg.color)}>
        <StatusIcon className="w-8 h-8 shrink-0" />
        <div>
          <p className="text-lg font-bold">{cfg.label}</p>
          <p className="text-sm opacity-80 mt-1">Amazon FBA compliance assessment for this shipment</p>
        </div>
      </div>

      {/* Categories */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.categories.map((cat) => {
          const style = catStatusStyle[cat.status];
          const CatIcon = catIcons[cat.name] || Package;
          const CatStatusIcon = style.icon;
          return (
            <div key={cat.name} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CatIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-sm text-foreground">{cat.name}</span>
                </div>
                <Badge className={cn('text-[10px] uppercase font-bold gap-1', style.bg, style.text, 'border-0')}>
                  <CatStatusIcon className="w-3 h-3" />
                  {cat.status === 'ok' ? 'OK' : cat.status === 'issue' ? 'Issue' : 'Critical'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{cat.explanation}</p>
            </div>
          );
        })}
      </div>

      {/* Risk Summary */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <p className="text-sm font-semibold text-foreground mb-1">Amazon Risk Summary</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.riskSummary}</p>
      </div>

      {/* Actions Required */}
      {data.actionsRequired.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <p className="text-sm font-semibold text-foreground">Actions Required for Amazon</p>
          <ul className="space-y-2">
            {data.actionsRequired.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
