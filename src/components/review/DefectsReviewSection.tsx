import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Plus, X } from 'lucide-react';

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

export default function DefectsReviewSection({ data, onUpdate }: Props) {
  const defects: any[] = data.defects || [];

  const updateDefect = (i: number, field: string, val: any) => {
    const updated = [...defects];
    updated[i] = { ...updated[i], [field]: val };
    onUpdate('defects', updated);
  };

  const updateBizImpact = (i: number, field: string, val: any) => {
    const updated = [...defects];
    const bi = updated[i].businessImpact || {};
    updated[i] = { ...updated[i], businessImpact: { ...bi, [field]: val } };
    onUpdate('defects', updated);
  };

  const addDefect = () => {
    onUpdate('defects', [...defects, {
      title: '', severity: 'minor', description: '', quantityAffected: 0, percentAffected: 0,
      recommendedAction: '', impactDescription: '',
      businessImpact: { customerExperience: 'low', compliance: 'low', returnRefund: 'low' },
    }]);
  };

  const removeDefect = (i: number) => {
    onUpdate('defects', defects.filter((_, idx) => idx !== i));
  };

  const sevColors: Record<string, string> = {
    critical: 'bg-danger text-danger-foreground',
    major: 'bg-warning text-warning-foreground',
    minor: 'bg-muted text-muted-foreground',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="w-4 h-4 text-danger" /> Defects ({defects.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={addDefect}>
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {defects.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No defects extracted.</p>
        )}
        {defects.map((d: any, i: number) => (
          <div key={i} className="p-4 rounded-lg border border-border space-y-3">
            <div className="flex items-center gap-2">
              <select
                className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium"
                value={d.severity || 'minor'}
                onChange={(e) => updateDefect(i, 'severity', e.target.value)}
              >
                <option value="critical">Critical</option>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
              <Badge className={sevColors[d.severity] || ''}>{d.severity}</Badge>
              <Input value={d.title || ''} onChange={(e) => updateDefect(i, 'title', e.target.value)} className="font-medium h-8" placeholder="Defect title" />
              <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7" onClick={() => removeDefect(i)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Qty Affected</Label>
                <Input type="number" value={d.quantityAffected ?? ''} onChange={(e) => updateDefect(i, 'quantityAffected', parseInt(e.target.value) || 0)} className="mt-1 h-8" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">% Affected</Label>
                <Input type="number" step="0.1" value={d.percentAffected ?? ''} onChange={(e) => updateDefect(i, 'percentAffected', parseFloat(e.target.value) || 0)} className="mt-1 h-8" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Textarea value={d.description || ''} onChange={(e) => updateDefect(i, 'description', e.target.value)} className="mt-1" rows={2} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Recommended Action</Label>
              <Input value={d.recommendedAction || ''} onChange={(e) => updateDefect(i, 'recommendedAction', e.target.value)} className="mt-1 h-8" />
            </div>
            {/* Business Impact */}
            <div className="p-3 rounded-md bg-muted/50 space-y-2">
              <p className="text-xs font-medium text-foreground">Business Impact</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['customerExperience', 'Customer Experience'],
                  ['compliance', 'Compliance'],
                  ['returnRefund', 'Return/Refund'],
                ].map(([key, label]) => (
                  <div key={key}>
                    <Label className="text-[10px] text-muted-foreground">{label}</Label>
                    <select className="w-full h-7 rounded-md border border-input bg-background px-2 text-xs" value={d.businessImpact?.[key] || 'low'} onChange={(e) => updateBizImpact(i, key, e.target.value)}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
