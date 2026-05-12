import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ttqPage } from '@/lib/tiktok';

export default function TikTokRouteTracker() {
  const location = useLocation();
  useEffect(() => {
    ttqPage();
  }, [location.pathname, location.search]);
  return null;
}
