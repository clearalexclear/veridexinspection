import logo from '@/assets/inspectra-icon.png';
import { OverallResultBadge } from './StatusBadge';
import type { InspectionReport } from '@/data/reportData';

export function ReportHeader({ report }: { report: InspectionReport }) {
  return (
    <section id="header" className="report-section pt-8">
      <div className="report-card">
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Inspectra" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-foreground leading-tight">Inspection Report</h1>
                <p className="text-sm text-muted-foreground mt-0.5 font-mono">{report.id}</p>
              </div>
            </div>
            <OverallResultBadge result={report.overallResult} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
            {[
              ['Inspection Date', report.date],
              ['Factory', report.factoryName],
              ['Supplier', report.supplierName],
              ['Product', report.productName],
              ['PO Number', report.poNumber],
              ['Order Qty', report.orderQuantity.toLocaleString()],
              ['Inspected Qty', report.inspectedQuantity.toLocaleString()],
              ['Destination', report.destinationCountry],
              ['Inspector', report.inspectorName],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</dt>
                <dd className="text-sm font-medium text-foreground mt-0.5">{value}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
