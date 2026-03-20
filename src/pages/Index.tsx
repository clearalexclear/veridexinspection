import { SectionNav } from '@/components/report/SectionNav';
import { ReportHeader } from '@/components/report/ReportHeader';
import { ExecutiveSummary } from '@/components/report/ExecutiveSummary';
import { InspectionOverview } from '@/components/report/InspectionOverview';
import { AQLSection } from '@/components/report/AQLSection';
import { ConformitySection } from '@/components/report/ConformitySection';
import { DefectsSection } from '@/components/report/DefectsSection';
import { PhotosSection } from '@/components/report/PhotosSection';
import { PackagingSection } from '@/components/report/PackagingSection';
import { TestingSection } from '@/components/report/TestingSection';
import { MeasurementsSection } from '@/components/report/MeasurementsSection';
import { CartonsSection } from '@/components/report/CartonsSection';
import { CommentsSection } from '@/components/report/CommentsSection';
import { FinalRecommendation } from '@/components/report/FinalRecommendation';
import {
  sampleReport,
  sampleDefects,
  sampleConformity,
  sampleAQL,
  samplePackagingChecklist,
  sampleTests,
  sampleMeasurements,
  samplePhotos,
  sampleCartonData,
} from '@/data/reportData';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SectionNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReportHeader report={sampleReport} />
        <ExecutiveSummary report={sampleReport} defects={sampleDefects} />
        <InspectionOverview report={sampleReport} />
        <AQLSection aql={sampleAQL} />
        <ConformitySection items={sampleConformity} />
        <DefectsSection defects={sampleDefects} />
        <PhotosSection photos={samplePhotos} />
        <PackagingSection items={samplePackagingChecklist} />
        <TestingSection tests={sampleTests} />
        <MeasurementsSection rows={sampleMeasurements} />
        <CartonsSection data={sampleCartonData} />
        <CommentsSection comments={sampleReport.inspectorComments} />
        <FinalRecommendation report={sampleReport} />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>Confidential — Inspectra Quality Services © {new Date().getFullYear()}</p>
        <p className="mt-1">Report {sampleReport.id} — Generated {sampleReport.date}</p>
      </footer>
    </div>
  );
};

export default Index;
