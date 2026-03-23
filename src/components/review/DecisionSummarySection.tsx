import { Input } from '@/components/ui/input';
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
          <ClipboardList className="w-4 h-4 text-primary" /> Inspection Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Overall Result</Label>
            <select className="mt-1 w-full h-11 rounded-md border border-input bg-background px-3 text-sm" value={data.overallResult || 'APPROVED WITH RESERVATIONS'} onChange={(e) => onUpdate('overallResult', e.target.value)}>
              <option value="APPROVED">Approved</option>
              <option value="APPROVED WITH RESERVATIONS">Approved with Reservations</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Inspection Type</Label>
            <Input value={data.inspectionType || ''} onChange={(e) => onUpdate('inspectionType', e.target.value)} className="mt-1 h-11" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Product Category</Label>
            <Input value={data.productCategory || ''} onChange={(e) => onUpdate('productCategory', e.target.value)} className="mt-1 h-11" />
          </div>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Inspector Comments</Label>
          <Textarea value={data.inspectorComments || ''} onChange={(e) => onUpdate('inspectorComments', e.target.value)} className="mt-1" rows={4} />
        </div>
      </CardContent>
    </Card>
  );
}
