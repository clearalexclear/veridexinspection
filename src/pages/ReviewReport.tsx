import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/inspectra-icon.png';
import { ArrowLeft, Loader2, FileCheck, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import GeneralInfoSection from '@/components/review/GeneralInfoSection';
import DecisionSummarySection from '@/components/review/DecisionSummarySection';
import AqlResultsSection from '@/components/review/AqlResultsSection';
import RemarksSection from '@/components/review/RemarksSection';
import QuantityBreakdownSection from '@/components/review/QuantityBreakdownSection';
import TestsSection from '@/components/review/TestsSection';
import DefectsReviewSection from '@/components/review/DefectsReviewSection';
import ActionPlanReviewSection from '@/components/review/ActionPlanSection';

export default function ReviewReport() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, roleLoading } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { parsedData?: any; fileName?: string; filePath?: string } | null;

  const [data, setData] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

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

  const updateField = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!user || !data) return;
    setGenerating(true);

    try {
      const { data: inspection, error } = await supabase
        .from('inspections')
        .insert({
          user_id: user.id,
          product_name: data.productName || 'Untitled Product',
          factory_location: data.factoryName || 'Unknown Factory',
          quantity: parseInt(data.orderQuantity) || 0,
          inspection_date: data.inspectionDate || new Date().toISOString().split('T')[0],
          status: 'completed',
          decision: data.decision || null,
          overall_result: data.overallResult || null,
          quality_score: parseInt(data.qualityScore) || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({ title: 'Report generated!', description: 'The Inspectra report has been created and is now visible to the client.' });
      navigate(`/report/${inspection.id}`);
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

  // Count low-confidence fields
  const fc = data.fieldConfidence || {};
  const lowConfCount = Object.values(fc).filter((v) => v === 'low').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Inspectra" className="w-7 h-7" />
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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Extraction Review</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and correct the data extracted from <span className="font-medium text-foreground">{state?.fileName}</span>
          </p>
          {lowConfCount > 0 && (
            <div className="mt-3 p-3 rounded-lg border border-danger/20 bg-danger/5 flex items-center gap-2">
              <span className="text-danger text-sm font-medium">⚠️ {lowConfCount} field{lowConfCount > 1 ? 's' : ''} flagged as low confidence — please verify</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <DecisionSummarySection data={data} onUpdate={updateField} />
          <GeneralInfoSection data={data} onUpdate={updateField} />
          <AqlResultsSection data={data} onUpdate={updateField} />
          <DefectsReviewSection data={data} onUpdate={updateField} />
          <RemarksSection data={data} onUpdate={updateField} />
          <QuantityBreakdownSection data={data} onUpdate={updateField} />
          <TestsSection data={data} onUpdate={updateField} />
          <ActionPlanReviewSection data={data} onUpdate={updateField} />
        </div>

        {/* Sticky approval footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground hidden sm:block">
              Final report will be generated and visible to the client after approval.
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
                  Approve & Generate Inspectra Report
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
