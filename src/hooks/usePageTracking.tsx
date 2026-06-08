import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const SESSION_KEY = "vx_session_id";

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function parseUA(ua: string) {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  const device = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";

  let browser = "Unknown";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = "Safari";

  let os = "Unknown";
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iOS/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";

  return { device, browser, os };
}

let geoCache: { country?: string; city?: string } | null = null;
async function fetchGeo() {
  if (geoCache) return geoCache;
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return (geoCache = {});
    const data = await res.json();
    geoCache = { country: data.country_name, city: data.city };
  } catch {
    geoCache = {};
  }
  return geoCache;
}

export function PageTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const track = async () => {
      try {
        const ua = navigator.userAgent;
        const { device, browser, os } = parseUA(ua);
        const params = new URLSearchParams(location.search);
        const geo = await fetchGeo();

        await supabase.from("page_visits").insert({
          session_id: getSessionId(),
          user_id: user?.id ?? null,
          path: location.pathname + location.search,
          referrer: document.referrer || null,
          user_agent: ua,
          device,
          browser,
          os,
          country: geo.country ?? null,
          city: geo.city ?? null,
          language: navigator.language,
          screen: `${window.screen.width}x${window.screen.height}`,
          utm_source: params.get("utm_source"),
          utm_medium: params.get("utm_medium"),
          utm_campaign: params.get("utm_campaign"),
        });
      } catch (e) {
        // Silently fail — tracking must never break the app
      }
    };
    track();
  }, [location.pathname, location.search, user?.id]);

  return null;
}
