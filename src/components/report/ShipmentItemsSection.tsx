import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ShipmentItem } from '@/data/reportData';
import { Package, Box, AlertTriangle, CheckCircle2, XCircle, Beaker } from 'lucide-react';

const severityStyle = {
  critical: 'bg-red-500/10 text-red-600 border-red-500/30',
  major: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  minor: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
};

const statusIcon = {
  pass: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
  fail: <XCircle className="w-3.5 h-3.5 text-red-500" />,
  warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  na: <span className="text-[10px] text-muted-foreground">N/A</span>,
};

function DefectList({ defects, severity }: { defects: ShipmentItem['defects']['critical']; severity: string }) {
  if (defects.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold capitalize text-muted-foreground">{severity} ({defects.length})</p>
      {defects.map((d, i) => (
        <div key={i} className={cn('rounded-lg border px-3 py-2 text-xs', severityStyle[severity as keyof typeof severityStyle])}>
          <span className="font-medium">{d.description}</span>
          <span className="ml-2 opacity-70">— {d.quantityAffected} units</span>
        </div>
      ))}
    </div>
  );
}

export function ShipmentItemsSection({ items }: { items: ShipmentItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section id="items" className="py-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Package className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Shipment Items</h2>
        <Badge variant="secondary" className="text-xs">{items.length} variant{items.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => {
          const totalDefects = item.defects.critical.length + item.defects.major.length + item.defects.minor.length;
          return (
            <div key={idx} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Item Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.itemName}</p>
                    {item.colorVariant && (
                      <p className="text-xs text-muted-foreground">Variant: {item.colorVariant}</p>
                    )}
                  </div>
                </div>
                {totalDefects > 0 ? (
                  <Badge className={cn('text-[10px]', totalDefects > 2 ? severityStyle.major : severityStyle.minor)}>
                    {totalDefects} defect{totalDefects !== 1 ? 's' : ''}
                  </Badge>
                ) : (
                  <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">No defects</Badge>
                )}
              </div>

              <div className="p-5 space-y-5">
                {/* Quantities */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Quantities</p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { label: 'Ordered', value: item.orderQuantity },
                      { label: 'Packed', value: item.packedQuantity },
                      { label: 'Cartons', value: item.cartonsCount },
                      { label: 'Per Carton', value: item.unitsPerCarton },
                      { label: 'Total Units', value: item.totalUnits },
                    ].map(q => (
                      <div key={q.label} className="rounded-lg bg-muted/40 px-3 py-2 text-center">
                        <p className="text-lg font-bold text-foreground">{q.value.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">{q.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Defects */}
                {totalDefects > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Defects</p>
                    <div className="space-y-2">
                      <DefectList defects={item.defects.critical} severity="critical" />
                      <DefectList defects={item.defects.major} severity="major" />
                      <DefectList defects={item.defects.minor} severity="minor" />
                    </div>
                  </div>
                )}

                {/* Packaging */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Packaging</p>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <Box className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Method:</span>
                      <span className="font-medium text-foreground">{item.packaging.method}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Size: <span className="font-medium text-foreground">{item.packaging.cartonSize}</span></span>
                      <span>Weight: <span className="font-medium text-foreground">{item.packaging.cartonWeight}</span></span>
                    </div>
                    {item.packaging.issues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {item.packaging.issues.map((issue, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-amber-600">
                            <AlertTriangle className="w-3 h-3" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tests */}
                {item.tests.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Tests</p>
                    <div className="space-y-1.5">
                      {item.tests.map((test, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2">
                          <div className="flex items-center gap-2 text-xs">
                            <Beaker className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-medium text-foreground">{test.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {test.comments && <span className="text-[10px] text-muted-foreground max-w-[200px] truncate">{test.comments}</span>}
                            {statusIcon[test.result]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
