import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, X } from 'lucide-react';

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

export default function RemarksSection({ data, onUpdate }: Props) {
  const remarks: any[] = data.remarks || [];

  const updateRemark = (i: number, field: string, val: any) => {
    const updated = [...remarks];
    updated[i] = { ...updated[i], [field]: val };
    onUpdate('remarks', updated);
  };

  const addRemark = () => {
    onUpdate('remarks', [...remarks, { text: '', category: 'remark' }]);
  };

  const removeRemark = (i: number) => {
    onUpdate('remarks', remarks.filter((_, idx) => idx !== i));
  };

  const catColors: Record<string, string> = {
    remark: 'bg-muted text-muted-foreground',
    pending: 'bg-warning/10 text-warning',
    failure: 'bg-danger/10 text-danger',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Remarks & Findings ({remarks.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={addRemark}>
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {remarks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No remarks extracted. Click Add to create one.</p>
        )}
        {remarks.map((r: any, i: number) => (
          <div key={i} className="flex gap-3 p-3 rounded-lg border border-border">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <select
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  value={r.category || 'remark'}
                  onChange={(e) => updateRemark(i, 'category', e.target.value)}
                >
                  <option value="remark">Remark</option>
                  <option value="pending">Pending</option>
                  <option value="failure">Failure</option>
                </select>
                <Badge variant="outline" className={catColors[r.category] || ''}>
                  {r.category || 'remark'}
                </Badge>
              </div>
              <Textarea
                value={r.text || ''}
                onChange={(e) => updateRemark(i, 'text', e.target.value)}
                rows={2}
                placeholder="Remark text..."
              />
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => removeRemark(i)}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
