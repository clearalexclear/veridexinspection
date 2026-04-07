import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, AlertCircle } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

const fields: [string, string, boolean][] = [
  ['clientName', 'Client', true],
  ['productName', 'Product', true],
  ['productCategory', 'Product Category', false],
  ['skuModel', 'Item / Model No.', false],
  ['destinationCountry', 'Destination Country', false],
  ['inspectionType', 'Inspection Type', false],
  ['factoryName', 'Inspection Location', false],
  ['factoryAddress', 'Factory Address', false],
  ['inspectionDate', 'Inspection Date', true],
  ['poNumber', 'Order Number', false],
  ['orderQuantity', 'Order Quantity', true],
  ['shipmentQuantity', 'Shipment Quantity', true],
  ['packedQuantity', 'Packed Quantity', true],
  ['qtyReadyForInspection', 'Qty Ready for Inspection', true],
  ['inspectedQuantity', 'Inspected Quantity', true],
  ['supplierName', 'Supplier / Vendor', true],
  ['manufacturer', 'Manufacturer', true],
  ['inspectorName', 'Inspector Name', true],
];

function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === '' || value === 0;
}

export default function GeneralInfoSection({ data, onUpdate }: Props) {
  const fc = data.fieldConfidence || {};

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" /> General Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(([key, label, hasConfidence]) => {
            const fieldEmpty = isEmpty(data[key]);
            const isLowConf = fc[key] === 'low';
            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-xs text-muted-foreground">{label}</Label>
                  {hasConfidence && <ConfidenceBadge level={fc[key]} />}
                  {fieldEmpty && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 gap-1 bg-destructive/10 text-destructive border-destructive/20">
                      <AlertCircle className="w-3 h-3" />
                      Needs review
                    </Badge>
                  )}
                </div>
                <Input
                  value={data[key] ?? ''}
                  onChange={(e) => onUpdate(key, e.target.value)}
                  className={fieldEmpty || isLowConf ? 'border-destructive/50 bg-destructive/5' : ''}
                  placeholder={fieldEmpty ? 'Not found — please fill in' : ''}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
