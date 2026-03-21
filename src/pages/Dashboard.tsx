import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/inspectra-logo.png';
import {
  Plus, LogOut, Loader2, ClipboardCheck, Clock, CheckCircle, AlertTriangle,
  ArrowRight, Package, MapPin, Calendar, Upload,
} from 'lucide-react';

type Inspection = {
  id: string;
  product_name: string;
  factory_location: string;
  quantity: number;
  inspection_date: string;
  status: string;
  decision: string | null;
  overall_result: string | null;
  quality_score: number | null;
};

const statusConfig: Record<string, { label: string; icon: typeof Clock; classes: string }> = {
  scheduled: { label: 'Scheduled', icon: Clock, classes: 'bg-muted text-muted-foreground' },
  in_progress: { label: 'In Progress', icon: Loader2, classes: 'bg-primary/10 text-primary' },
  completed: { label: 'Completed', icon: CheckCircle, classes: 'bg-success/10 text-success' },
};

const decisionConfig: Record<string, { label: string; classes: string }> = {
  'ship': { label: '✅ Approved', classes: 'bg-success text-success-foreground' },
  'ship-with-corrections': { label: '⚠️ Fix Required', classes: 'bg-warning text-warning-foreground' },
  'do-not-ship': { label: '❌ Rejected', classes: 'bg-danger text-danger-foreground' },
};

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin } = useRole();
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchInspections = async () => {
      const { data } = await supabase
        .from('inspections')
        .select('*')
        .order('created_at', { ascending: false });
      setInspections(data || []);
      setLoading(false);
    };
    fetchInspections();
  }, [user]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Inspectra" className="w-7 h-7" />
            <span className="font-semibold text-foreground text-sm">Inspectra</span>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={() => navigate('/upload')}>
              <Upload className="w-4 h-4 mr-1" /> Upload Report
            </Button>
            <Button size="sm" onClick={() => navigate('/book')}>
              <Plus className="w-4 h-4 mr-1" /> Book Inspection
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Inspection Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage all your product inspections</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: inspections.length, icon: ClipboardCheck },
            { label: 'Scheduled', value: inspections.filter(i => i.status === 'scheduled').length, icon: Clock },
            { label: 'In Progress', value: inspections.filter(i => i.status === 'in_progress').length, icon: Loader2 },
            { label: 'Completed', value: inspections.filter(i => i.status === 'completed').length, icon: CheckCircle },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <s.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold text-foreground tabular-nums">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Inspections list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : inspections.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ClipboardCheck className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-1">No inspections yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Book your first inspection to get started.</p>
              <Button onClick={() => navigate('/book')}>
                <Plus className="w-4 h-4 mr-1" /> Book Inspection
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {inspections.map((ins) => {
              const sc = statusConfig[ins.status] || statusConfig.scheduled;
              const StatusIcon = sc.icon;
              const dc = ins.decision ? decisionConfig[ins.decision] : null;

              return (
                <Card key={ins.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground truncate">{ins.product_name}</h3>
                          <Badge className={sc.classes} variant="secondary">
                            <StatusIcon className="w-3 h-3 mr-1" /> {sc.label}
                          </Badge>
                          {dc && (
                            <Badge className={dc.classes}>{dc.label}</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ins.factory_location}</span>
                          <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {ins.quantity.toLocaleString()} units</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(ins.inspection_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {ins.quality_score !== null && (
                          <div className="text-center px-3">
                            <p className="text-xl font-bold text-foreground tabular-nums">{ins.quality_score}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</p>
                          </div>
                        )}
                        {ins.status === 'completed' && (
                          <Button size="sm" variant="outline" onClick={() => navigate(`/report/${ins.id}`)}>
                            View Report <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
