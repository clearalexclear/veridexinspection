import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

export default function DecisionSummarySection({ data, onUpdate }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary" /> Inspector Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">Inspector Comments</Label>
          <Textarea value={data.inspectorComments || ''} onChange={(e) => onUpdate('inspectorComments', e.target.value)} className="mt-1" rows={4} />
        </div>
      </CardContent>
    </Card>
  );
}
