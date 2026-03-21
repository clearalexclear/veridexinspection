import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

type Props = {
  data: any;
  onUpdate: (field: string, value: any) => void;
};

const fields: [string, string, boolean][] = [
  ['clientName', 'Client', false],
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
  ['qtyReadyForInspection', 'Qty Ready for Inspection', true],
  ['inspectedQuantity', 'Inspected Quantity', true],
  ['supplierName', 'Supplier / Vendor', true],
  ['manufacturer', 'Manufacturer', true],
  ['inspectorName', 'Inspector Name', true],
  ['overallResult', 'Overall Result', true],
];

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
          {fields.map(([key, label, hasConfidence]) => (
            <div key={key}>
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                {hasConfidence && <ConfidenceBadge level={fc[key]} />}
              </div>
              {key === 'overallResult' ? (
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={data[key] || ''}
                  onChange={(e) => onUpdate(key, e.target.value)}
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="APPROVED WITH RESERVATIONS">APPROVED WITH RESERVATIONS</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              ) : (
                <Input
                  value={data[key] ?? ''}
                  onChange={(e) => onUpdate(key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
