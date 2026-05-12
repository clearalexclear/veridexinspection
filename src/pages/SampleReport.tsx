import { useEffect } from 'react';
import ReportContent from '@/components/report/ReportContent';
import { ttqTrack } from '@/lib/tiktok';

export default function SampleReport() {
  useEffect(() => {
    ttqTrack('ViewContent', { content_name: 'Sample Report Viewed', content_type: 'report' });
  }, []);
  return <ReportContent isSample />;
}
