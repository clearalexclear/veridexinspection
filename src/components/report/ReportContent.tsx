import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SectionNav } from './SectionNav';
import { ReportHeader } from './ReportHeader';
import { DecisionBlock } from './DecisionBlock';
import { KeyIssuesBlock } from './KeyIssuesBlock';
import { ActionPlanSection } from './ActionPlanSection';
import { ExecutiveSummary } from './ExecutiveSummary';
import { SupplierScoreSection } from './SupplierScoreSection';
import { InspectionOverview } from './InspectionOverview';
import { AQLSection } from './AQLSection';
import { ConformitySection } from './ConformitySection';
import { DefectsSection } from './DefectsSection';
import { PhotosSection } from './PhotosSection';
import { PackagingSection } from './PackagingSection';
import { TestingSection } from './TestingSection';
import { MeasurementsSection } from './MeasurementsSection';
import { CartonsSection } from './CartonsSection';
import { TimeToFixSection } from './TimeToFixSection';
import { CommentsSection } from './CommentsSection';
import { FinalRecommendation } from './FinalRecommendation';
import { AmazonReadinessSection } from './AmazonReadinessSection';
import type { AmazonReadinessData } from './AmazonReadinessSection';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  sampleReport, sampleDefects, sampleConformity, sampleAQL,
  samplePackagingChecklist, sampleTests, sampleMeasurements, samplePhotos,
  sampleCartonData, sampleKeyIssues, sampleActionPlan, sampleSupplierScore, sampleTimeToFix,
  sampleAmazonReadiness,
} from '@/data/reportData';
import type { InspectionReport, DefectItem, KeyIssue, ActionPlanItem, AQLData, ConformityItem, ChecklistItem, TestItem, MeasurementRow, PhotoItem, SupplierScore, TimeToFixItem } from '@/data/reportData';

interface ReportContentProps {
  inspectionId?: string;
  showBackButton?: boolean;
  isSample?: boolean;
}

function mapReportData(raw: any, inspectionId: string): {
  report: InspectionReport;
  defects: DefectItem[];
  keyIssues: KeyIssue[];
  actionPlan: ActionPlanItem[];
  aql: AQLData;
  conformity: ConformityItem[];
  packagingChecklist: ChecklistItem[];
  tests: TestItem[];
  measurements: MeasurementRow[];
  photos: PhotoItem[];
  supplierScore: SupplierScore;
  timeToFix: TimeToFixItem[];
  cartonData: any;
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
    overallResult: raw.overallResult || 'APPROVED WITH RESERVATIONS',
    qualityScore: Number(raw.qualityScore) || 0,
    riskLevel: raw.riskLevel || 'medium',
    decision: raw.decision || 'ship-with-corrections',
    inspectionType: raw.inspectionType || '',
    factoryAddress: raw.factoryAddress || '',
    supplierContact: '',
    productCategory: raw.productCategory || '',
    skuModel: raw.skuModel || '',
    quantityPacked: Number(raw.shipmentQuantity) || 0,
    quantityAvailable: Number(raw.qtyReadyForInspection) || 0,
    samplingStandard: raw.aql?.inspectionLevel || '',
    inspectionScope: '',
    recommendation: raw.recommendation || '',
    topReasons: raw.topReasons || [],
    nextStep: raw.nextStep || '',
    inspectorComments: raw.inspectorComments || '',
    confidenceScore: Number(raw.confidenceScore) || 0,
    businessImpact: raw.businessImpact || '',
    quickSummary: raw.quickSummary || '',
  };

  const defects: DefectItem[] = (raw.defects || []).map((d: any, i: number) => ({
    id: d.id || `DEF-${String(i + 1).padStart(3, '0')}`,
    title: d.title || d.name || '',
    severity: d.severity || 'minor',
    description: d.description || '',
    quantityAffected: Number(d.quantityAffected) || 0,
    percentAffected: Number(d.percentAffected) || 0,
    recommendedAction: d.recommendedAction || '',
    affectedCartons: d.affectedCartons || '',
    impactDescription: d.impactDescription || '',
    businessImpact: d.businessImpact || { customerExperience: 'low', compliance: 'low', returnRefund: 'low' },
  }));

  const keyIssues: KeyIssue[] = (raw.keyIssues || []).map((k: any) => ({
    title: k.title || '',
    severity: k.severity || 'minor',
    percentAffected: Number(k.percentAffected) || 0,
    impactDescription: k.impactDescription || '',
  }));

  const actionPlan: ActionPlanItem[] = (raw.actionPlan || []).map((a: any) => ({
    issue: a.issue || '',
    action: a.action || '',
    estimatedDays: a.estimatedDays || '',
    priority: a.priority || 'medium',
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

  const ssRaw = raw.supplierScore || {};
  const supplierScore: SupplierScore = {
    overall: Number(ssRaw.overall) || 0,
    qualityConsistency: Number(ssRaw.qualityConsistency) || 0,
    packagingAccuracy: Number(ssRaw.packagingAccuracy) || 0,
    defectRate: Number(ssRaw.defectRate) || 0,
    professionalism: Number(ssRaw.professionalism) || 0,
    insight: ssRaw.insight || '',
  };

  const timeToFix: TimeToFixItem[] = (raw.timeToFix || []).map((t: any) => ({
    task: t.task || '',
    estimatedDays: t.estimatedDays || '',
  }));

  const cartonData = {
    cartonsAvailable: Number(raw.cartonsAvailable) || 0,
    quantityPerCarton: Number(raw.quantityPerCarton) || 0,
    totalPacked: Number(raw.shipmentQuantity) || Number(raw.orderQuantity) || 0,
    verificationResult: 'pass' as const,
    randomCheckNotes: '',
    shortShipmentRisk: '',
  };

  return { report, defects, keyIssues, actionPlan, aql, conformity, packagingChecklist, tests, measurements, photos, supplierScore, timeToFix, cartonData };
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
        // Fallback: build minimal report from inspection columns
        setReportState(mapReportData({
          productName: data.product_name,
          factoryName: data.factory_location,
          inspectionDate: data.inspection_date,
          orderQuantity: data.quantity,
          overallResult: data.overall_result,
          qualityScore: data.quality_score,
          decision: data.decision,
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

  // Use real data or sample data
  const useSample = isSample || !reportState;
  const report = useSample ? sampleReport : reportState!.report;
  const defects = useSample ? sampleDefects : reportState!.defects;
  const keyIssues = useSample ? sampleKeyIssues : reportState!.keyIssues;
  const actionPlan = useSample ? sampleActionPlan : reportState!.actionPlan;
  const aql = useSample ? sampleAQL : reportState!.aql;
  const conformity = useSample ? sampleConformity : reportState!.conformity;
  const packagingChecklist = useSample ? samplePackagingChecklist : reportState!.packagingChecklist;
  const tests = useSample ? sampleTests : reportState!.tests;
  const measurements = useSample ? sampleMeasurements : reportState!.measurements;
  const photos = useSample ? samplePhotos : reportState!.photos;
  const supplierScore = useSample ? sampleSupplierScore : reportState!.supplierScore;
  const timeToFix = useSample ? sampleTimeToFix : reportState!.timeToFix;
  const cartonData = useSample ? sampleCartonData : reportState!.cartonData;

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
        <DecisionBlock report={report} />
        <KeyIssuesBlock issues={keyIssues} />
        <ActionPlanSection items={actionPlan} />
        <ExecutiveSummary report={report} defects={defects} aql={aql} />
        <SupplierScoreSection score={supplierScore} />
        <InspectionOverview report={report} />
        <AQLSection aql={aql} />
        <ConformitySection items={conformity} />
        <DefectsSection defects={defects} />
        {photos.length > 0 && <PhotosSection photos={photos} />}
        <PackagingSection items={packagingChecklist} />
        <TestingSection tests={tests} />
        <MeasurementsSection rows={measurements} />
        <CartonsSection data={cartonData} />
        {timeToFix.length > 0 && <TimeToFixSection items={timeToFix} />}
        <CommentsSection comments={report.inspectorComments} />
        <FinalRecommendation report={report} />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>Confidential — Inspectra Quality Services © {new Date().getFullYear()}</p>
        <p className="mt-1">Report {report.id} — Generated {report.date}</p>
      </footer>
    </div>
  );
}
