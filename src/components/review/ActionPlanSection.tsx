import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Plus, X } from 'lucide-react';

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

export default function ActionPlanReviewSection({ data, onUpdate }: Props) {
  const plan: any[] = data.actionPlan || [];

  const updateItem = (i: number, field: string, val: any) => {
    const updated = [...plan];
    updated[i] = { ...updated[i], [field]: val };
    onUpdate('actionPlan', updated);
  };

  const addItem = () => {
    onUpdate('actionPlan', [...plan, { issue: '', action: '', estimatedDays: '', priority: 'medium' }]);
  };

  const removeItem = (i: number) => {
    onUpdate('actionPlan', plan.filter((_, idx) => idx !== i));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" /> Action Plan ({plan.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={addItem}>
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {plan.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No action items extracted.</p>
        )}
        {plan.map((item: any, i: number) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-lg border border-border items-end">
            <div className="sm:col-span-4">
              <Label className="text-xs text-muted-foreground">Issue</Label>
              <Input value={item.issue || ''} onChange={(e) => updateItem(i, 'issue', e.target.value)} className="mt-1 h-8" />
            </div>
            <div className="sm:col-span-4">
              <Label className="text-xs text-muted-foreground">Action</Label>
              <Input value={item.action || ''} onChange={(e) => updateItem(i, 'action', e.target.value)} className="mt-1 h-8" />
            </div>
            <div className="sm:col-span-1">
              <Label className="text-xs text-muted-foreground">Days</Label>
              <Input value={item.estimatedDays || ''} onChange={(e) => updateItem(i, 'estimatedDays', e.target.value)} className="mt-1 h-8" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              <select className="mt-1 w-full h-8 rounded-md border border-input bg-background px-2 text-xs" value={item.priority || 'medium'} onChange={(e) => updateItem(i, 'priority', e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="sm:col-span-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(i)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
