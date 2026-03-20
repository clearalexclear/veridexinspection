import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import ReportContent from '@/components/report/ReportContent';
import { Loader2 } from 'lucide-react';

export default function Report() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // For now, all reports show the sample data. In production, you'd fetch by ID.
  return <ReportContent inspectionId={id} showBackButton />;
}
