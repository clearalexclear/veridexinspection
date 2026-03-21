import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Plus, X } from 'lucide-react';

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

export default function QuantityBreakdownSection({ data, onUpdate }: Props) {
  const rows: any[] = data.quantityBreakdown || [];

  const updateRow = (i: number, field: string, val: any) => {
    const updated = [...rows];
    updated[i] = { ...updated[i], [field]: val };
    onUpdate('quantityBreakdown', updated);
  };

  const addRow = () => {
    onUpdate('quantityBreakdown', [...rows, { variant: '', ordered: 0, packed: 0, inspected: 0 }]);
  };

  const removeRow = (i: number) => {
    onUpdate('quantityBreakdown', rows.filter((_, idx) => idx !== i));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Quantity Breakdown ({rows.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={addRow}>
            <Plus className="w-3 h-3 mr-1" /> Add Row
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No quantity breakdown extracted.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Variant / SKU</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Ordered</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Packed</th>
                  <th className="text-left py-2 text-xs font-medium text-muted-foreground">Inspected</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-1.5 pr-2">
                      <Input value={row.variant || ''} onChange={(e) => updateRow(i, 'variant', e.target.value)} className="h-8 text-sm" />
                    </td>
                    <td className="py-1.5 pr-2">
                      <Input type="number" value={row.ordered ?? ''} onChange={(e) => updateRow(i, 'ordered', parseInt(e.target.value) || 0)} className="h-8 text-sm w-24" />
                    </td>
                    <td className="py-1.5 pr-2">
                      <Input type="number" value={row.packed ?? ''} onChange={(e) => updateRow(i, 'packed', parseInt(e.target.value) || 0)} className="h-8 text-sm w-24" />
                    </td>
                    <td className="py-1.5 pr-2">
                      <Input type="number" value={row.inspected ?? ''} onChange={(e) => updateRow(i, 'inspected', parseInt(e.target.value) || 0)} className="h-8 text-sm w-24" />
                    </td>
                    <td className="py-1.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeRow(i)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
