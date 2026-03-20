import type { sampleCartonData } from '@/data/reportData';
import { StatusBadge } from './StatusBadge';

export function CartonsSection({ data }: { data: typeof sampleCartonData }) {
  return (
    <section id="cartons" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Carton & Quantity Verification
      </h2>
      <div className="report-card p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {[
            ['Cartons Available', data.cartonsAvailable.toString()],
            ['Qty Per Carton', data.quantityPerCarton.toString()],
            ['Total Packed', data.totalPacked.toLocaleString()],
            ['Verification', ''],
          ].map(([label, value], i) => (
            <div key={label} className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
              {i === 3 ? (
                <div className="mt-2"><StatusBadge status={data.verificationResult} /></div>
              ) : (
                <p className="text-2xl font-bold text-foreground mt-1 tabular-nums font-mono">{value}</p>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="p-4 rounded-lg border border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Random Carton Check</p>
            <p className="text-sm text-foreground">{data.randomCheckNotes}</p>
          </div>
          <div className="p-4 rounded-lg border border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">Short Shipment Risk</p>
            <p className="text-sm text-foreground">{data.shortShipmentRisk}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
