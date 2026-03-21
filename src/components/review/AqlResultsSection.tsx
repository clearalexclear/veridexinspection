import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

export default function AqlResultsSection({ data, onUpdate }: Props) {
  const aql = data.aql || {};

  const updateAql = (key: string, val: any) => {
    onUpdate('aql', { ...aql, [key]: val });
  };

  const updateAqlSub = (category: string, field: string, val: any) => {
    const sub = aql[category] || {};
    onUpdate('aql', { ...aql, [category]: { ...sub, [field]: val } });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-primary" /> AQL & Inspection Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Inspection Level</Label>
            <Input value={aql.inspectionLevel || ''} onChange={(e) => updateAql('inspectionLevel', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Sample Size Code</Label>
            <Input value={aql.sampleSizeCode || ''} onChange={(e) => updateAql('sampleSizeCode', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Sample Size</Label>
            <Input type="number" value={aql.sampleSize ?? ''} onChange={(e) => updateAql('sampleSize', parseInt(e.target.value) || 0)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">AQL Result</Label>
            <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={aql.result || 'pass'} onChange={(e) => updateAql('result', e.target.value)}>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
            </select>
          </div>
        </div>

        {/* Defect categories */}
        <div className="grid grid-cols-3 gap-4">
          {(['critical', 'major', 'minor'] as const).map((cat) => (
            <div key={cat} className="p-3 rounded-lg border border-border">
              <p className="text-xs font-medium text-foreground capitalize mb-2">{cat}</p>
              <div className="space-y-2">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Max Allowed</Label>
                  <Input type="number" value={aql[cat]?.accept ?? ''} onChange={(e) => updateAqlSub(cat, 'accept', parseInt(e.target.value) || 0)} className="mt-0.5 h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Found</Label>
                  <Input type="number" value={aql[cat]?.found ?? ''} onChange={(e) => updateAqlSub(cat, 'found', parseInt(e.target.value) || 0)} className="mt-0.5 h-8 text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section results */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ['quantityCheckResult', 'Quantity Check'],
            ['productSpecResult', 'Product Specification'],
            ['packagingResult', 'Packing & Packaging'],
            ['testMeasurementResult', 'Tests & Measurements'],
          ].map(([key, label]) => (
            <div key={key}>
              <Label className="text-xs text-muted-foreground">{label}</Label>
              <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={aql[key] || 'pass'} onChange={(e) => updateAql(key, e.target.value)}>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="pending">Pending</option>
                <option value="n/a">N/A</option>
              </select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
