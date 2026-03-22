import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

export default function DecisionSummarySection({ data, onUpdate }: Props) {
  const decisionColors: Record<string, string> = {
    'low-risk': 'border-l-success',
    'moderate-risk': 'border-l-warning',
    'high-risk': 'border-l-danger',
    // Legacy
    'ship': 'border-l-success',
    'ship-with-corrections': 'border-l-warning',
    'do-not-ship': 'border-l-danger',
  };

  return (
    <Card className={`border-l-4 ${decisionColors[data.decision] || 'border-l-muted'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Decision & Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Quality Score</Label>
            <Input type="number" min={0} max={100} value={data.qualityScore ?? ''} onChange={(e) => onUpdate('qualityScore', parseInt(e.target.value) || 0)} className="mt-1 font-bold text-lg h-11" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Confidence</Label>
            <Input type="number" min={0} max={100} value={data.confidenceScore ?? ''} onChange={(e) => onUpdate('confidenceScore', parseInt(e.target.value) || 0)} className="mt-1 h-11" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Risk Level</Label>
            <select className="mt-1 w-full h-11 rounded-md border border-input bg-background px-3 text-sm" value={data.riskLevel || 'medium'} onChange={(e) => onUpdate('riskLevel', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Decision</Label>
            <select className="mt-1 w-full h-11 rounded-md border border-input bg-background px-3 text-sm" value={data.decision || 'ship-with-corrections'} onChange={(e) => onUpdate('decision', e.target.value)}>
              <option value="ship">✅ Approved — Ship</option>
              <option value="ship-with-corrections">⚠️ Ship with Corrections</option>
              <option value="do-not-ship">❌ Do Not Ship</option>
            </select>
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Quick Summary</Label>
          <Textarea value={data.quickSummary || ''} onChange={(e) => onUpdate('quickSummary', e.target.value)} className="mt-1" rows={2} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Recommendation</Label>
          <Textarea value={data.recommendation || ''} onChange={(e) => onUpdate('recommendation', e.target.value)} className="mt-1" rows={3} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Business Impact</Label>
          <Textarea value={data.businessImpact || ''} onChange={(e) => onUpdate('businessImpact', e.target.value)} className="mt-1" rows={2} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Inspector Comments</Label>
          <Textarea value={data.inspectorComments || ''} onChange={(e) => onUpdate('inspectorComments', e.target.value)} className="mt-1" rows={4} />
        </div>
      </CardContent>
    </Card>
  );
}
