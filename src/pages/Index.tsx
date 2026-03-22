import { SectionNav } from '@/components/report/SectionNav';
import { ReportHeader } from '@/components/report/ReportHeader';
import { DecisionBlock } from '@/components/report/DecisionBlock';
import { KeyIssuesBlock } from '@/components/report/KeyIssuesBlock';
import { ActionPlanSection } from '@/components/report/ActionPlanSection';
import { ExecutiveSummary } from '@/components/report/ExecutiveSummary';
import { SupplierScoreSection } from '@/components/report/SupplierScoreSection';
import { InspectionOverview } from '@/components/report/InspectionOverview';
import { AQLSection } from '@/components/report/AQLSection';
import { ConformitySection } from '@/components/report/ConformitySection';
import { DefectsSection } from '@/components/report/DefectsSection';
import { PhotosSection } from '@/components/report/PhotosSection';
import { PackagingSection } from '@/components/report/PackagingSection';
import { TestingSection } from '@/components/report/TestingSection';
import { MeasurementsSection } from '@/components/report/MeasurementsSection';
import { CartonsSection } from '@/components/report/CartonsSection';
import { TimeToFixSection } from '@/components/report/TimeToFixSection';
import { CommentsSection } from '@/components/report/CommentsSection';
import { FinalRecommendation } from '@/components/report/FinalRecommendation';
import { AmazonReadinessSection } from '@/components/report/AmazonReadinessSection';
import { ShipmentItemsSection } from '@/components/report/ShipmentItemsSection';
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
  sampleKeyIssues,
  sampleActionPlan,
  sampleSupplierScore,
  sampleTimeToFix,
  sampleAmazonReadiness,
  sampleShipmentItems,
} from '@/data/reportData';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SectionNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <AmazonReadinessSection data={sampleAmazonReadiness} />
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
