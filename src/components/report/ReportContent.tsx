import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SectionNav } from './SectionNav';
import { ReportHeader } from './ReportHeader';
import { InspectionSummary } from './InspectionSummary';
import { InspectionOverview } from './InspectionOverview';
import { AQLSection } from './AQLSection';
import { ConformitySection } from './ConformitySection';
import { DefectsSection } from './DefectsSection';
import { PhotosSection } from './PhotosSection';
import { PackagingSection } from './PackagingSection';
import { TestingSection } from './TestingSection';
import { MeasurementsSection } from './MeasurementsSection';
import { CartonsSection } from './CartonsSection';
import { CommentsSection } from './CommentsSection';
import { AmazonReadinessSection } from './AmazonReadinessSection';
import type { AmazonReadinessData } from './AmazonReadinessSection';
import { SupplierProfileSection } from './SupplierProfileSection';
import type { SupplierProfileData } from './SupplierProfileSection';
import { ShipmentItemsSection } from './ShipmentItemsSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  sampleReport, sampleDefects, sampleConformity, sampleAQL,
  samplePackagingChecklist, sampleTests, sampleMeasurements, samplePhotos,
  sampleCartonData, sampleShipmentItems,
  sampleAmazonReadiness, sampleSupplierProfile,
} from '@/data/reportData';
import type { InspectionReport, DefectItem, AQLData, ConformityItem, ChecklistItem, TestItem, MeasurementRow, PhotoItem, ShipmentItem } from '@/data/reportData';

interface ReportContentProps {
  inspectionId?: string;
  showBackButton?: boolean;
  isSample?: boolean;
}

function mapReportData(raw: any, inspectionId: string): {
  report: InspectionReport;
  defects: DefectItem[];
  aql: AQLData;
  conformity: ConformityItem[];
  packagingChecklist: ChecklistItem[];
  tests: TestItem[];
  measurements: MeasurementRow[];
  photos: PhotoItem[];
  cartonData: any;
  amazonReadiness: AmazonReadinessData;
  supplierProfile: SupplierProfileData;
  shipmentItems: ShipmentItem[];
} {
  const report: InspectionReport = {
    id: inspectionId,
    date: raw.inspectionDate || '',
    factoryName: raw.factoryName || '',
    supplierName: raw.supplierName || '',
    productName: raw.productName || '',
    poNumber: raw.poNumber || '',
    orderQuantity: Number(raw.orderQuantity) || 0,
    inspectedQuantity: Number(raw.inspectedQuantity) || 0,
    destinationCountry: raw.destinationCountry || '',
    inspectorName: raw.inspectorName || '',
    inspectionType: raw.inspectionType || '',
    factoryAddress: raw.factoryAddress || '',
    supplierContact: '',
    productCategory: raw.productCategory || '',
    skuModel: raw.skuModel || '',
    quantityPacked: Number(raw.shipmentQuantity) || 0,
    quantityAvailable: Number(raw.qtyReadyForInspection) || 0,
    samplingStandard: raw.aql?.inspectionLevel || '',
    inspectionScope: '',
    inspectorComments: raw.inspectorComments || '',
  };

  const defects: DefectItem[] = (raw.defects || []).map((d: any, i: number) => ({
    id: d.id || `DEF-${String(i + 1).padStart(3, '0')}`,
    title: d.title || d.name || '',
    severity: d.severity || 'minor',
    description: d.description || '',
    quantityAffected: Number(d.quantityAffected) || 0,
    percentAffected: Number(d.percentAffected) || 0,
    affectedCartons: d.affectedCartons || '',
  }));

  const aqlRaw = raw.aql || {};
  const aql: AQLData = {
    inspectionLevel: aqlRaw.inspectionLevel || '',
    sampleSizeCode: aqlRaw.sampleSizeCode || '',
    sampleSize: Number(aqlRaw.sampleSize) || 0,
    critical: { accept: Number(aqlRaw.critical?.accept) || 0, found: Number(aqlRaw.critical?.found) || 0 },
    major: { accept: Number(aqlRaw.major?.accept) || 0, found: Number(aqlRaw.major?.found) || 0 },
    minor: { accept: Number(aqlRaw.minor?.accept) || 0, found: Number(aqlRaw.minor?.found) || 0 },
    result: aqlRaw.result || 'pass',
  };

  const conformity: ConformityItem[] = (raw.conformity || []).map((c: any) => ({
    name: c.name || '',
    status: c.status || 'pass',
    note: c.note || c.notes || '',
  }));

  const packagingChecklist: ChecklistItem[] = (raw.packagingChecklist || []).map((p: any) => ({
    name: p.name || '',
    status: p.status || 'pass',
    notes: p.notes || p.note || '',
  }));

  const tests: TestItem[] = (raw.tests || []).map((t: any) => ({
    name: t.name || '',
    unitsTested: Number(t.unitsTested) || 0,
    passed: Number(t.passed) || 0,
    failed: Number(t.failed) || 0,
    notes: t.notes || '',
    status: t.status || 'pass',
  }));

  const measurements: MeasurementRow[] = (raw.measurements || []).map((m: any) => ({
    parameter: m.parameter || '',
    spec: m.spec || '',
    actual: m.actual || '',
    tolerance: m.tolerance || '',
    status: m.status || 'pass',
  }));

  const photos: PhotoItem[] = (raw.images || raw.photos || []).map((p: any, i: number) => ({
    id: p.id || `P${String(i + 1).padStart(3, '0')}`,
    url: p.url || '',
    caption: p.caption || '',
    category: p.category || 'product',
    defectRef: p.defectRef,
  }));

  const cartonData = {
    cartonsAvailable: Number(raw.cartonsAvailable) || 0,
    quantityPerCarton: Number(raw.quantityPerCarton) || 0,
    totalPacked: Number(raw.shipmentQuantity) || Number(raw.orderQuantity) || 0,
    verificationResult: 'pass' as const,
    randomCheckNotes: '',
    shortShipmentRisk: '',
  };

  const amazonReadiness: AmazonReadinessData = raw.amazonReadiness || {
    overallStatus: 'READY',
    categories: [],
    riskSummary: '',
    actionsRequired: [],
  };

  const shipmentItems: ShipmentItem[] = (raw.shipmentItems || []).map((item: any) => ({
    itemName: item.itemName || '',
    colorVariant: item.colorVariant || '',
    orderQuantity: Number(item.orderQuantity) || 0,
    packedQuantity: Number(item.packedQuantity) || 0,
    cartonsCount: Number(item.cartonsCount) || 0,
    unitsPerCarton: Number(item.unitsPerCarton) || 0,
    totalUnits: Number(item.totalUnits) || 0,
    defects: {
      critical: (item.defects?.critical || []).map((d: any) => ({ description: d.description || '', severity: 'critical' as const, quantityAffected: Number(d.quantityAffected) || 0 })),
      major: (item.defects?.major || []).map((d: any) => ({ description: d.description || '', severity: 'major' as const, quantityAffected: Number(d.quantityAffected) || 0 })),
      minor: (item.defects?.minor || []).map((d: any) => ({ description: d.description || '', severity: 'minor' as const, quantityAffected: Number(d.quantityAffected) || 0 })),
    },
    packaging: {
      method: item.packaging?.method || '',
      cartonSize: item.packaging?.cartonSize || '',
      cartonWeight: item.packaging?.cartonWeight || '',
      issues: item.packaging?.issues || [],
    },
    tests: (item.tests || []).map((t: any) => ({ name: t.name || '', result: t.result || 'pass', comments: t.comments || '' })),
  }));

  return { report, defects, aql, conformity, packagingChecklist, tests, measurements, photos, cartonData, amazonReadiness, shipmentItems };
}

export default function ReportContent({ inspectionId, showBackButton, isSample }: ReportContentProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isSample && !!inspectionId);
  const [reportState, setReportState] = useState<ReturnType<typeof mapReportData> | null>(null);

  useEffect(() => {
    if (isSample || !inspectionId) return;

    const fetchReport = async () => {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('id', inspectionId)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      if (data.report_data) {
        setReportState(mapReportData(data.report_data as any, data.id));
      } else {
        setReportState(mapReportData({
          productName: data.product_name,
          factoryName: data.factory_location,
          inspectionDate: data.inspection_date,
          orderQuantity: data.quantity,
        }, data.id));
      }
      setLoading(false);
    };

    fetchReport();
  }, [inspectionId, isSample]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const useSample = isSample || !reportState;
  const report = useSample ? sampleReport : reportState!.report;
  const defects = useSample ? sampleDefects : reportState!.defects;
  const aql = useSample ? sampleAQL : reportState!.aql;
  const conformity = useSample ? sampleConformity : reportState!.conformity;
  const packagingChecklist = useSample ? samplePackagingChecklist : reportState!.packagingChecklist;
  const tests = useSample ? sampleTests : reportState!.tests;
  const measurements = useSample ? sampleMeasurements : reportState!.measurements;
  const photos = useSample ? samplePhotos : reportState!.photos;
  const cartonData = useSample ? sampleCartonData : reportState!.cartonData;
  const amazonReadiness = useSample ? sampleAmazonReadiness : reportState!.amazonReadiness;
  const shipmentItems = useSample ? sampleShipmentItems : reportState!.shipmentItems;

  return (
    <div className="min-h-screen bg-background">
      <SectionNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pt-6 mb-2">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
              </Button>
            )}
            {isSample && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to website
              </Button>
            )}
          </div>
          {isSample && (
            <Badge variant="outline" className="text-xs border-warning text-warning">
              Sample Report — Demo Data
            </Badge>
          )}
        </div>

        <ReportHeader report={report} />
        <InspectionSummary report={report} defects={defects} aql={aql} tests={tests} />
        <InspectionOverview report={report} />
        <ShipmentItemsSection items={shipmentItems} />
        <AQLSection aql={aql} />
        <ConformitySection items={conformity} />
        <DefectsSection defects={defects} />
        {photos.length > 0 && <PhotosSection photos={photos} />}
        <PackagingSection items={packagingChecklist} />
        <TestingSection tests={tests} />
        <MeasurementsSection rows={measurements} />
        <CartonsSection data={cartonData} />
        <AmazonReadinessSection data={amazonReadiness} />
        <CommentsSection comments={report.inspectorComments} />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>Confidential — Inspectra Quality Services © {new Date().getFullYear()}</p>
        <p className="mt-1">Report {report.id} — Generated {report.date}</p>
        <p className="mt-2 italic text-[10px]">This report presents structured inspection data without interpretation. Final decisions remain the responsibility of the client.</p>
      </footer>
    </div>
  );
}
