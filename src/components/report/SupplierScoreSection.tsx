import type { SupplierScore } from '@/data/reportData';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 10) * 100;
  const color = value >= 7 ? 'bg-success' : value >= 5 ? 'bg-warning' : 'bg-danger';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-bold tabular-nums text-foreground">{value}/10</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function SupplierScoreSection({ score }: { score: SupplierScore }) {
  const overallColor = score.overall >= 7 ? 'text-success' : score.overall >= 5 ? 'text-warning' : 'text-danger';

  return (
    <section id="supplier" className="report-section">
      <h2 className="section-title">
        <Building2 className="w-5 h-5 text-primary" />
        Supplier Reliability Score
      </h2>

      <div className="report-card p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall score */}
          <div className="flex flex-col items-center justify-center text-center p-4">
            <span className={cn('text-6xl font-extrabold tabular-nums leading-none', overallColor)}>
              {score.overall}
            </span>
            <span className="text-lg text-muted-foreground font-medium mt-1">/ 10</span>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mt-3">Overall Score</p>
          </div>

          {/* Breakdown */}
          <div className="space-y-4 lg:col-span-1">
            <ScoreBar label="Quality Consistency" value={score.qualityConsistency} />
            <ScoreBar label="Packaging Accuracy" value={score.packagingAccuracy} />
            <ScoreBar label="Defect Rate" value={score.defectRate} />
            <ScoreBar label="Professionalism" value={score.professionalism} />
          </div>

          {/* Insight */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border flex items-start">
            <p className="text-sm text-muted-foreground leading-relaxed">{score.insight}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
