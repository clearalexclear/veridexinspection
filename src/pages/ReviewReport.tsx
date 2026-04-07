import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { ArrowLeft, Loader2, FileCheck, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import GeneralInfoSection from '@/components/review/GeneralInfoSection';
import DecisionSummarySection from '@/components/review/DecisionSummarySection';
import AqlResultsSection from '@/components/review/AqlResultsSection';
import RemarksSection from '@/components/review/RemarksSection';
import QuantityBreakdownSection from '@/components/review/QuantityBreakdownSection';
import TestsSection from '@/components/review/TestsSection';
import DefectsReviewSection from '@/components/review/DefectsReviewSection';
import ImageReviewSection from '@/components/review/ImageReviewSection';

type InspectionOption = { id: string; product_name: string; user_id: string; status: string };

export default function ReviewReport() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, roleLoading } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { parsedData?: any; fileName?: string; filePath?: string } | null;

  const [data, setData] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [inspections, setInspections] = useState<InspectionOption[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<string>('new');

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
    if (!authLoading && !roleLoading && user && !isAdmin) navigate('/dashboard');
  }, [user, authLoading, roleLoading, isAdmin, navigate]);

  useEffect(() => {
    if (!state?.parsedData) {
      navigate('/upload');
      return;
    }
    setData(state.parsedData);
  }, [state, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const fetch = async () => {
      const { data: ins } = await supabase
        .from('inspections')
        .select('id, product_name, user_id, status')
        .order('created_at', { ascending: false });
      setInspections(ins || []);
    };
    fetch();
  }, [user, isAdmin]);

  const updateField = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const buildReportData = () => {
    return {
      productName: data.productName || '',
      supplierName: data.supplierName || '',
      manufacturer: data.manufacturer || '',
      factoryName: data.factoryName || '',
      factoryAddress: data.factoryAddress || '',
      inspectionDate: data.inspectionDate || '',
      poNumber: data.poNumber || '',
      orderQuantity: Number(data.orderQuantity) || 0,
      shipmentQuantity: Number(data.shipmentQuantity) || 0,
      packedQuantity: Number(data.packedQuantity) || 0,
      qtyReadyForInspection: Number(data.qtyReadyForInspection) || 0,
      inspectedQuantity: Number(data.inspectedQuantity) || 0,
      destinationCountry: data.destinationCountry || '',
      inspectorName: data.inspectorName || '',
      inspectionType: data.inspectionType || '',
      productCategory: data.productCategory || '',
      skuModel: data.skuModel || '',
      clientName: data.clientName || '',
      inspectorComments: data.inspectorComments || '',
      defects: data.defects || [],
      remarks: data.remarks || [],
      quantityBreakdown: data.quantityBreakdown || [],
      aql: data.aql || {},
      tests: data.tests || [],
      measurements: data.measurements || [],
      conformity: data.conformity || [],
      packagingChecklist: data.packagingChecklist || [],
      images: data.images || [],
    };
  };

  const handleGenerate = async () => {
    if (!user || !data) return;
    setGenerating(true);

    try {
      const reportData = buildReportData();

      if (selectedInspection !== 'new') {
        const { error } = await supabase
          .from('inspections')
          .update({
            status: 'completed',
            report_data: reportData as any,
          })
          .eq('id', selectedInspection);

        if (error) throw error;

        toast({ title: 'Report generated!', description: 'The report has been attached to the existing inspection.' });
        navigate(`/report/${selectedInspection}`);
      } else {
        const { data: inspection, error } = await supabase
          .from('inspections')
          .insert({
            user_id: user.id,
            product_name: data.productName || 'Untitled Product',
            factory_location: data.factoryName || 'Unknown Factory',
            quantity: parseInt(data.orderQuantity) || 0,
            inspection_date: data.inspectionDate || new Date().toISOString().split('T')[0],
            status: 'completed',
            report_data: reportData as any,
          })
          .select()
          .single();

        if (error) throw error;

        toast({ title: 'Report generated!', description: 'The inspection report has been created.' });
        navigate(`/report/${inspection.id}`);
      }
    } catch (err: any) {
      console.error('Generate error:', err);
      toast({
        title: 'Generation failed',
        description: err.message || 'Could not create the report.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  if (authLoading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const fc = data.fieldConfidence || {};
  const lowConfCount = Object.values(fc).filter((v) => v === 'low').length;

  // Count empty required fields
  const requiredFields = ['productName', 'supplierName', 'inspectionDate', 'inspectorName', 'orderQuantity', 'inspectedQuantity'];
  const emptyCount = requiredFields.filter((f) => !data[f] || data[f] === 0).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-foreground text-sm">Inspectra</span>
            <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
              <Shield className="w-3 h-3 mr-1" /> Admin Review
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/upload')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Extraction Review</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and correct the data extracted from <span className="font-medium text-foreground">{state?.fileName}</span>
          </p>
          {(lowConfCount > 0 || emptyCount > 0) && (
            <div className="mt-3 space-y-2">
              {lowConfCount > 0 && (
                <div className="p-3 rounded-lg border border-danger/20 bg-danger/5 flex items-center gap-2">
                  <span className="text-danger text-sm font-medium">⚠️ {lowConfCount} field{lowConfCount > 1 ? 's' : ''} flagged as low confidence — please verify</span>
                </div>
              )}
              {emptyCount > 0 && (
                <div className="p-3 rounded-lg border border-warning/20 bg-warning/5 flex items-center gap-2">
                  <span className="text-warning text-sm font-medium">📝 {emptyCount} required field{emptyCount > 1 ? 's' : ''} empty — needs review before generating</span>
                </div>
              )}
            </div>
          )}
        </div>

        {inspections.length > 0 && (
          <div className="mb-6 p-4 rounded-lg border border-border bg-muted/30">
            <Label className="text-xs text-muted-foreground mb-2 block">Assign to Inspection</Label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={selectedInspection}
              onChange={(e) => setSelectedInspection(e.target.value)}
            >
              <option value="new">➕ Create new inspection</option>
              {inspections.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.product_name} — {ins.status} ({ins.id.slice(0, 8)})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-6">
          <DecisionSummarySection data={data} onUpdate={updateField} />
          <GeneralInfoSection data={data} onUpdate={updateField} />
          <AqlResultsSection data={data} onUpdate={updateField} />
          <DefectsReviewSection data={data} onUpdate={updateField} />
          <RemarksSection data={data} onUpdate={updateField} />
          <QuantityBreakdownSection data={data} onUpdate={updateField} />
          <TestsSection data={data} onUpdate={updateField} />
          <ImageReviewSection data={data} onUpdate={updateField} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground hidden sm:block">
              Report will be generated and visible to the client.
            </p>
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Report…
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 mr-2" />
                  Approve & Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
