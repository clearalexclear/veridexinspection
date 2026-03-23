import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, Star, AlertCircle, Info } from 'lucide-react';

export interface SupplierProfileData {
  supplierName: string;
  score: number; // 0-10
  summary: string;
  factors: { label: string; value: string; status: 'positive' | 'neutral' | 'negative' }[];
  sources: string[];
}

function ScoreDisplay({ score }: { score: number }) {
  const color = score >= 7 ? 'text-success' : score >= 4 ? 'text-warning' : 'text-destructive';
  return (
    <div className="flex items-center gap-3">
      <div className={`text-4xl font-bold ${color}`}>{score.toFixed(1)}</div>
      <div className="text-xs text-muted-foreground">/ 10</div>
    </div>
  );
}

export function SupplierProfileSection({ data }: { data: SupplierProfileData }) {
  if (!data || !data.supplierName) return null;

  return (
    <section id="supplier-profile" className="scroll-mt-24 mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-primary" />
            Supplier Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <ScoreDisplay score={data.score} />
              <p className="text-xs text-muted-foreground mt-1">AI-Suggested Score</p>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-sm">{data.supplierName}</h3>
              <p className="text-sm text-muted-foreground">{data.summary}</p>
            </div>
          </div>

          {data.factors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.factors.map((f, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                  {f.status === 'positive' && <Star className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />}
                  {f.status === 'neutral' && <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />}
                  {f.status === 'negative' && <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className="text-xs font-medium">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.sources.length > 0 && (
            <div className="flex items-start gap-2 pt-2 border-t">
              <Globe className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-[10px] text-muted-foreground space-y-0.5">
                <p className="font-medium">Sources</p>
                {data.sources.map((s, i) => (
                  <p key={i}>{s}</p>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground italic border-t pt-3">
            This score is AI-generated based on publicly available information and inspection data. It is provided as an informational reference only, not as a verified assessment.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
