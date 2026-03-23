import { AlertTriangle, AlertOctagon, Info, Target, Package, ClipboardList, Beaker } from 'lucide-react';
import type { InspectionReport, DefectItem, AQLData, TestItem } from '@/data/reportData';

interface Props {
  report: InspectionReport;
  defects: DefectItem[];
  aql: AQLData;
  tests: TestItem[];
}

export function InspectionSummary({ report, defects, aql, tests }: Props) {
  const critical = defects.filter(d => d.severity === 'critical').length;
  const major = defects.filter(d => d.severity === 'major').length;
  const minor = defects.filter(d => d.severity === 'minor').length;

  const failedTests = tests.filter(t => t.status === 'fail');
  const warningTests = tests.filter(t => t.status === 'warning');

  const aqlCriticalStatus = aql.critical.found > aql.critical.accept ? 'fail' : 'pass';
  const aqlMajorStatus = aql.major.found > aql.major.accept ? 'fail' : 'pass';
  const aqlMinorStatus = aql.minor.found > aql.minor.accept ? 'fail' : 'pass';

  const quantityDiff = report.orderQuantity - report.quantityAvailable;

  return (
    <section id="inspection-summary" className="report-section">
      <h2 className="section-title">
        <ClipboardList className="w-5 h-5 text-primary" />
        Inspection Summary
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Defect Counts */}
        <div className="report-card p-6 fade-in-up">
          <h3 className="text-sm font-semibold text-foreground mb-4">Defects Found</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-danger/5 border border-danger/10">
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-5 h-5 text-danger" />
                <span className="text-sm font-medium">Critical</span>
              </div>
              <span className="text-2xl font-bold tabular-nums text-danger">{critical}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/10">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium">Major</span>
              </div>
              <span className="text-2xl font-bold tabular-nums text-warning">{major}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">Minor</span>
              </div>
              <span className="text-2xl font-bold tabular-nums text-muted-foreground">{minor}</span>
            </div>
          </div>
        </div>

        {/* AQL Results */}
        <div className="report-card p-6 fade-in-up stagger-1">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> AQL Results
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Critical', found: aql.critical.found, accept: aql.critical.accept, status: aqlCriticalStatus },
              { label: 'Major', found: aql.major.found, accept: aql.major.accept, status: aqlMajorStatus },
              { label: 'Minor', found: aql.minor.found, accept: aql.minor.accept, status: aqlMinorStatus },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                <span className="text-sm font-medium">{row.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{row.found} found / {row.accept} accept</span>
                  <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${row.status === 'fail' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                    {row.status === 'fail' ? 'EXCEEDED' : 'WITHIN'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Sample Size</span>
            <span className="text-sm font-bold tabular-nums">{aql.sampleSize} units</span>
          </div>
        </div>

        {/* Quantities & Tests */}
        <div className="report-card p-6 fade-in-up stagger-2">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Quantities
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Order quantity</span>
              <span className="font-bold tabular-nums">{report.orderQuantity.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available for inspection</span>
              <span className="font-bold tabular-nums">{report.quantityAvailable.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Inspected (sample)</span>
              <span className="font-bold tabular-nums">{report.inspectedQuantity.toLocaleString()}</span>
            </div>
            {quantityDiff > 0 && (
              <div className="flex items-center justify-between text-sm p-2 rounded-lg bg-warning/5 border border-warning/10">
                <span className="text-warning font-medium">Discrepancy</span>
                <span className="font-bold tabular-nums text-warning">{quantityDiff.toLocaleString()} units</span>
              </div>
            )}
          </div>

          {(failedTests.length > 0 || warningTests.length > 0) && (
            <div className="mt-5 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-primary" /> Tests Requiring Attention
              </h4>
              <div className="space-y-1.5">
                {failedTests.map((t) => (
                  <div key={t.name} className="text-xs flex items-center gap-2 p-2 rounded bg-danger/5 border border-danger/10">
                    <span className="font-bold text-danger uppercase px-1.5 py-0.5 rounded bg-danger/10">FAIL</span>
                    <span className="text-foreground">{t.name}</span>
                  </div>
                ))}
                {warningTests.map((t) => (
                  <div key={t.name} className="text-xs flex items-center gap-2 p-2 rounded bg-warning/5 border border-warning/10">
                    <span className="font-bold text-warning uppercase px-1.5 py-0.5 rounded bg-warning/10">WARN</span>
                    <span className="text-foreground">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {failedTests.length === 0 && warningTests.length === 0 && (
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">All tests completed — no failures noted.</p>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
        <p className="text-[11px] text-muted-foreground italic">
          This report presents structured inspection data without interpretation. Final decisions remain the responsibility of the client.
        </p>
      </div>
    </section>
  );
}
