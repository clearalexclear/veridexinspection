import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Plus, X } from 'lucide-react';

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

export default function TestsSection({ data, onUpdate }: Props) {
  const tests: any[] = data.tests || [];

  const updateTest = (i: number, field: string, val: any) => {
    const updated = [...tests];
    updated[i] = { ...updated[i], [field]: val };
    onUpdate('tests', updated);
  };

  const addTest = () => {
    onUpdate('tests', [...tests, { name: '', description: '', unitsTested: 0, passed: 0, failed: 0, notes: '', status: 'pass' }]);
  };

  const removeTest = (i: number) => {
    onUpdate('tests', tests.filter((_, idx) => idx !== i));
  };

  const statusColors: Record<string, string> = {
    pass: 'bg-success/10 text-success',
    fail: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-primary" /> Tests ({tests.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={addTest}>
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tests.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No tests extracted.</p>
        )}
        {tests.map((t: any, i: number) => (
          <div key={i} className="p-3 rounded-lg border border-border space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={statusColors[t.status] || ''}>
                {t.status}
              </Badge>
              <Input value={t.name || ''} onChange={(e) => updateTest(i, 'name', e.target.value)} placeholder="Test name" className="font-medium h-8" />
              <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7" onClick={() => removeTest(i)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
            <Input value={t.description || ''} onChange={(e) => updateTest(i, 'description', e.target.value)} placeholder="Description" className="h-8 text-sm" />
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">Sample</Label>
                <Input type="number" value={t.unitsTested ?? ''} onChange={(e) => updateTest(i, 'unitsTested', parseInt(e.target.value) || 0)} className="h-7 text-xs" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Passed</Label>
                <Input type="number" value={t.passed ?? ''} onChange={(e) => updateTest(i, 'passed', parseInt(e.target.value) || 0)} className="h-7 text-xs" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Failed</Label>
                <Input type="number" value={t.failed ?? ''} onChange={(e) => updateTest(i, 'failed', parseInt(e.target.value) || 0)} className="h-7 text-xs" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Status</Label>
                <select className="h-7 w-full rounded-md border border-input bg-background px-2 text-xs" value={t.status || 'pass'} onChange={(e) => updateTest(i, 'status', e.target.value)}>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
            </div>
            <Input value={t.notes || ''} onChange={(e) => updateTest(i, 'notes', e.target.value)} placeholder="Comments" className="h-8 text-xs" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
