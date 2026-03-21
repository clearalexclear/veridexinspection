import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import logo from '@/assets/inspectra-logo.png';
import {
  ArrowLeft, Loader2, FileCheck, AlertTriangle, Package, MapPin,
  Calendar, User, CheckCircle, XCircle, Flame, Wrench, TrendingUp,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

  const updateDefect = (index: number, field: string, value: any) => {
    setData((prev: any) => {
      const defects = [...(prev.defects || [])];
      defects[index] = { ...defects[index], [field]: value };
      return { ...prev, defects };
    });
  };

  const updateActionPlan = (index: number, field: string, value: any) => {
    setData((prev: any) => {
      const plan = [...(prev.actionPlan || [])];
      plan[index] = { ...plan[index], [field]: value };
      return { ...prev, actionPlan: plan };
    });
  };

  const handleGenerate = async () => {
    if (!user || !data) return;
    setGenerating(true);

    try {
      // Create inspection record
      const { data: inspection, error } = await supabase
        .from('inspections')
        .insert({
          user_id: user.id,
          product_name: data.productName || 'Untitled Product',
          factory_location: data.factoryName || 'Unknown Factory',
          quantity: data.orderQuantity || 0,
          inspection_date: data.inspectionDate || new Date().toISOString().split('T')[0],
          status: 'completed',
          decision: data.decision || null,
          overall_result: data.overallResult || null,
          quality_score: data.qualityScore || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({ title: 'Report generated!', description: 'Your Inspectra report has been created and linked to your dashboard.' });
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

  const decisionColors: Record<string, string> = {
    'ship': 'bg-success/10 text-success border-success/20',
    'ship-with-corrections': 'bg-warning/10 text-warning border-warning/20',
    'do-not-ship': 'bg-danger/10 text-danger border-danger/20',
  };

  const decisionLabels: Record<string, string> = {
    'ship': '✅ Approved — Ship',
    'ship-with-corrections': '⚠️ Ship with Corrections',
    'do-not-ship': '❌ Do Not Ship',
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Inspectra" className="w-7 h-7" />
            <span className="font-semibold text-foreground text-sm">Inspectra</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/upload')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Review Extracted Data</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Verify and edit the data extracted from <span className="font-medium text-foreground">{state?.fileName}</span>
            </p>
          </div>
          <Badge variant="outline" className={`text-xs px-3 py-1 ${decisionColors[data.decision] || ''}`}>
            {decisionLabels[data.decision] || data.decision}
          </Badge>
        </div>

        {/* Decision & Score summary */}
        <Card className="mb-6 border-primary/10">
          <CardContent className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Quality Score</Label>
                <Input
                  type="number"
                  min={0} max={100}
                  value={data.qualityScore || ''}
                  onChange={(e) => updateField('qualityScore', parseInt(e.target.value) || 0)}
                  className="mt-1 font-bold text-lg h-11"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Confidence</Label>
                <Input
                  type="number"
                  min={0} max={100}
                  value={data.confidenceScore || ''}
                  onChange={(e) => updateField('confidenceScore', parseInt(e.target.value) || 0)}
                  className="mt-1 h-11"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Risk Level</Label>
                <select
                  className="mt-1 w-full h-11 rounded-md border border-input bg-background px-3 text-sm"
                  value={data.riskLevel || 'medium'}
                  onChange={(e) => updateField('riskLevel', e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Decision</Label>
                <select
                  className="mt-1 w-full h-11 rounded-md border border-input bg-background px-3 text-sm"
                  value={data.decision || 'ship-with-corrections'}
                  onChange={(e) => updateField('decision', e.target.value)}
                >
                  <option value="ship">Approved — Ship</option>
                  <option value="ship-with-corrections">Ship with Corrections</option>
                  <option value="do-not-ship">Do Not Ship</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Info */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['productName', 'Product Name'],
                ['supplierName', 'Supplier'],
                ['factoryName', 'Factory'],
                ['inspectionDate', 'Inspection Date'],
                ['poNumber', 'PO Number'],
                ['orderQuantity', 'Order Quantity'],
                ['inspectedQuantity', 'Inspected Quantity'],
                ['destinationCountry', 'Destination'],
                ['inspectorName', 'Inspector'],
                ['inspectionType', 'Inspection Type'],
                ['productCategory', 'Product Category'],
                ['skuModel', 'SKU / Model'],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <Label className="text-xs text-muted-foreground">{label}</Label>
                  <Input
                    value={data[key] || ''}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendation & Summary */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Summary & Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Quick Summary</Label>
              <Textarea
                value={data.quickSummary || ''}
                onChange={(e) => updateField('quickSummary', e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Recommendation</Label>
              <Textarea
                value={data.recommendation || ''}
                onChange={(e) => updateField('recommendation', e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Business Impact</Label>
              <Textarea
                value={data.businessImpact || ''}
                onChange={(e) => updateField('businessImpact', e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Inspector Comments</Label>
              <Textarea
                value={data.inspectorComments || ''}
                onChange={(e) => updateField('inspectorComments', e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Defects */}
        {data.defects?.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="w-4 h-4 text-danger" /> Defects ({data.defects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.defects.map((defect: any, i: number) => (
                <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        defect.severity === 'critical' ? 'bg-danger text-danger-foreground' :
                        defect.severity === 'major' ? 'bg-warning text-warning-foreground' :
                        'bg-muted text-muted-foreground'
                      }
                    >
                      {defect.severity}
                    </Badge>
                    <Input
                      value={defect.title || ''}
                      onChange={(e) => updateDefect(i, 'title', e.target.value)}
                      className="font-medium"
                      placeholder="Defect title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Qty Affected</Label>
                      <Input
                        type="number"
                        value={defect.quantityAffected || ''}
                        onChange={(e) => updateDefect(i, 'quantityAffected', parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">% Affected</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={defect.percentAffected || ''}
                        onChange={(e) => updateDefect(i, 'percentAffected', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <Textarea
                      value={defect.description || ''}
                      onChange={(e) => updateDefect(i, 'description', e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Recommended Action</Label>
                    <Input
                      value={defect.recommendedAction || ''}
                      onChange={(e) => updateDefect(i, 'recommendedAction', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Action Plan */}
        {data.actionPlan?.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary" /> Action Plan ({data.actionPlan.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.actionPlan.map((item: any, i: number) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-lg border border-border">
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">Action</Label>
                    <Input
                      value={item.action || ''}
                      onChange={(e) => updateActionPlan(i, 'action', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Est. Days</Label>
                    <Input
                      value={item.estimatedDays || ''}
                      onChange={(e) => updateActionPlan(i, 'estimatedDays', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Priority</Label>
                    <select
                      className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={item.priority || 'medium'}
                      onChange={(e) => updateActionPlan(i, 'priority', e.target.value)}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Generate CTA */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border -mx-4 px-4 sm:-mx-6 sm:px-6 py-4">
          <Button
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Inspectra Report…
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4 mr-2" />
                Generate Inspectra Report
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
