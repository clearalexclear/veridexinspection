import { useNavigate } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  sampleReport, sampleDefects, sampleConformity, sampleAQL,
  samplePackagingChecklist, sampleTests, sampleMeasurements, samplePhotos,
  sampleCartonData, sampleKeyIssues, sampleActionPlan, sampleSupplierScore, sampleTimeToFix,
} from '@/data/reportData';

interface ReportContentProps {
  inspectionId?: string;
  showBackButton?: boolean;
  isSample?: boolean;
}

export default function ReportContent({ inspectionId, showBackButton, isSample }: ReportContentProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SectionNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
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

        <ReportHeader report={sampleReport} />
        <DecisionBlock report={sampleReport} />
        <KeyIssuesBlock issues={sampleKeyIssues} />
        <ActionPlanSection items={sampleActionPlan} />
        <ExecutiveSummary report={sampleReport} defects={sampleDefects} aql={sampleAQL} />
        <SupplierScoreSection score={sampleSupplierScore} />
        <InspectionOverview report={sampleReport} />
        <AQLSection aql={sampleAQL} />
        <ConformitySection items={sampleConformity} />
        <DefectsSection defects={sampleDefects} />
        <PhotosSection photos={samplePhotos} />
        <PackagingSection items={samplePackagingChecklist} />
        <TestingSection tests={sampleTests} />
        <MeasurementsSection rows={sampleMeasurements} />
        <CartonsSection data={sampleCartonData} />
        <TimeToFixSection items={sampleTimeToFix} />
        <CommentsSection comments={sampleReport.inspectorComments} />
        <FinalRecommendation report={sampleReport} />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>Confidential — Inspectra Quality Services © {new Date().getFullYear()}</p>
        <p className="mt-1">Report {sampleReport.id} — Generated {sampleReport.date}</p>
      </footer>
    </div>
  );
}
