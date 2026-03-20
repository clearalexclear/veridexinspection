import type { InspectionReport } from '@/data/reportData';

export function InspectionOverview({ report }: { report: InspectionReport }) {
  const fields = [
    ['Inspection Type', report.inspectionType],
    ['Date & Time', `${report.date} — 08:30 to 16:45 CST`],
    ['Factory Address', report.factoryAddress],
    ['Supplier Contact', report.supplierContact],
    ['Product Category', report.productCategory],
    ['SKU / Model', report.skuModel],
    ['Quantity Ordered', report.orderQuantity.toLocaleString()],
    ['Quantity Packed', report.quantityPacked.toLocaleString()],
    ['Quantity Available', report.quantityAvailable.toLocaleString()],
    ['Sampling Standard', report.samplingStandard],
    ['Inspection Scope', report.inspectionScope],
  ];

  return (
    <section id="overview" className="report-section">
      <h2 className="section-title">
        <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
        Inspection Overview
      </h2>
      <div className="report-card p-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {fields.map(([label, value]) => (
            <div key={label} className="py-2 border-b border-border last:border-0">
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</dt>
              <dd className="text-sm text-foreground mt-1">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
