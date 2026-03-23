import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ShoppingCart, CheckCircle2, AlertTriangle, XCircle, Package, Tag, ShieldCheck, Box, Barcode } from 'lucide-react';

export type CategoryStatus = 'ok' | 'issue' | 'critical';

export interface AmazonCategory {
  name: string;
  status: CategoryStatus;
  explanation: string;
}

export interface AmazonReadinessData {
  categories: AmazonCategory[];
  findings: string;
}

const catStatusStyle: Record<CategoryStatus, { bg: string; text: string; icon: typeof CheckCircle2; label: string }> = {
  'ok': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: CheckCircle2, label: 'OK' },
  'issue': { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: AlertTriangle, label: 'Issue Found' },
  'critical': { bg: 'bg-red-500/10', text: 'text-red-600', icon: XCircle, label: 'Critical' },
};

const catIcons: Record<string, typeof Package> = {
  'Labeling': Tag,
  'Packaging': Package,
  'Product Condition': ShieldCheck,
  'Compliance': Barcode,
  'Carton Quality': Box,
};

export function AmazonReadinessSection({ data }: { data: AmazonReadinessData }) {
  if (!data.categories || data.categories.length === 0) return null;

  return (
    <section id="amazon-readiness" className="py-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <ShoppingCart className="w-5 h-5 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Amazon FBA Checklist</h2>
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
                  {style.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{cat.explanation}</p>
            </div>
          );
        })}
      </div>

      {/* Findings */}
      {data.findings && (
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <p className="text-sm font-semibold text-foreground mb-1">Findings</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.findings}</p>
        </div>
      )}

      <div className="p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-[11px] text-muted-foreground italic">
          This checklist reflects inspection observations against standard Amazon FBA requirements. It does not constitute certification or guarantee of acceptance.
        </p>
      </div>
    </section>
  );
}
