import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ttqPage, ttqTrack } from '@/lib/tiktok';

const ROUTE_VIEW_CONTENT: Record<string, { content_name: string; content_type: string }> = {
  '/': { content_name: 'Homepage', content_type: 'page' },
  '/sample-report': { content_name: 'Sample Report', content_type: 'report' },
  '/book': { content_name: 'Quote Section', content_type: 'section' },
};

export default function TikTokRouteTracker() {
  const location = useLocation();
  useEffect(() => {
    ttqPage();
    const meta = ROUTE_VIEW_CONTENT[location.pathname];
    if (meta) ttqTrack('ViewContent', meta);
  }, [location.pathname, location.search]);
  return null;
}
