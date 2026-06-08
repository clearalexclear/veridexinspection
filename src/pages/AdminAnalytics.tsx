import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Visit = {
  id: string;
  session_id: string;
  user_id: string | null;
  path: string;
  referrer: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
};

function rank(items: (string | null)[], topN = 10) {
  const counts = new Map<string, number>();
  for (const i of items) {
    const k = i && i.trim() ? i : "(unknown)";
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN);
}

function dayKey(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}

export default function AdminAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, roleLoading } = useRole();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    const since = new Date(Date.now() - days * 86400000).toISOString();
    supabase
      .from("page_visits")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000)
      .then(({ data }) => {
        setVisits((data as Visit[]) ?? []);
        setLoading(false);
      });
  }, [isAdmin, days]);

  const stats = useMemo(() => {
    const sessions = new Set(visits.map((v) => v.session_id));
    const byDay = new Map<string, { visits: number; sessions: Set<string> }>();
    for (const v of visits) {
      const k = dayKey(v.created_at);
      const e = byDay.get(k) ?? { visits: 0, sessions: new Set() };
      e.visits += 1;
      e.sessions.add(v.session_id);
      byDay.set(k, e);
    }
    const series = [...byDay.entries()]
      .sort()
      .map(([d, e]) => ({ day: d, visits: e.visits, sessions: e.sessions.size }));
    return {
      totalVisits: visits.length,
      uniqueSessions: sessions.size,
      loggedIn: visits.filter((v) => v.user_id).length,
      countries: new Set(visits.map((v) => v.country).filter(Boolean)).size,
      series,
      topPages: rank(visits.map((v) => v.path)),
      topReferrers: rank(visits.map((v) => v.referrer || "(direct)")),
      topCountries: rank(visits.map((v) => v.country)),
      topDevices: rank(visits.map((v) => v.device)),
      topBrowsers: rank(visits.map((v) => v.browser)),
    };
  }, [visits]);

  if (authLoading || roleLoading) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const maxBar = Math.max(1, ...stats.series.map((s) => s.visits));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visitor Analytics</h1>
          <p className="text-muted-foreground">Live traffic from your site — last {days} days</p>
        </div>
        <div className="flex gap-2">
          {[1, 7, 30, 90].map((d) => (
            <Button key={d} size="sm" variant={days === d ? "default" : "outline"} onClick={() => setDays(d)}>
              {d}d
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Total visits", stats.totalVisits],
          ["Unique sessions", stats.uniqueSessions],
          ["Logged-in views", stats.loggedIn],
          ["Countries", stats.countries],
        ].map(([label, value]) => (
          <Card key={label as string}>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{label}</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-bold">{loading ? "…" : value}</div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Traffic by day</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {stats.series.map((s) => (
              <div key={s.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-muted-foreground">{s.visits}</div>
                <div className="w-full bg-primary rounded-t" style={{ height: `${(s.visits / maxBar) * 100}%`, minHeight: 2 }} />
                <div className="text-xs text-muted-foreground rotate-0">{s.day.slice(5)}</div>
              </div>
            ))}
            {stats.series.length === 0 && <div className="text-muted-foreground">No data yet</div>}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pages">
        <TabsList>
          <TabsTrigger value="pages">Top pages</TabsTrigger>
          <TabsTrigger value="referrers">Referrers</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="recent">Recent visits</TabsTrigger>
        </TabsList>

        {([
          ["pages", stats.topPages],
          ["referrers", stats.topReferrers],
          ["countries", stats.topCountries],
          ["devices", stats.topDevices],
        ] as const).map(([key, rows]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead>Value</TableHead><TableHead className="text-right">Visits</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {rows.map(([k, v]) => (
                      <TableRow key={k}><TableCell className="font-mono text-sm break-all">{k}</TableCell><TableCell className="text-right">{v}</TableCell></TableRow>
                    ))}
                    {rows.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-8">No data</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        <TabsContent value="recent">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>When</TableHead><TableHead>Path</TableHead><TableHead>Country</TableHead>
                  <TableHead>Device</TableHead><TableHead>Browser</TableHead><TableHead>Referrer</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {visits.slice(0, 100).map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="text-xs whitespace-nowrap">{new Date(v.created_at).toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-xs max-w-[200px] truncate">{v.path}</TableCell>
                      <TableCell className="text-xs">{v.country || "—"}</TableCell>
                      <TableCell className="text-xs">{v.device || "—"}</TableCell>
                      <TableCell className="text-xs">{v.browser || "—"}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{v.referrer || "(direct)"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
