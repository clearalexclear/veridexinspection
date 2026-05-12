import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [state, setState] = useState<'loading' | 'valid' | 'already' | 'invalid' | 'submitting' | 'done' | 'error'>('loading');

  useEffect(() => {
    if (!token) { setState('invalid'); return; }
    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
      headers: { apikey: ANON_KEY },
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) return setState('invalid');
        if (data.valid === false && data.reason === 'already_unsubscribed') return setState('already');
        if (data.valid) return setState('valid');
        setState('invalid');
      })
      .catch(() => setState('invalid'));
  }, [token]);

  const confirm = async () => {
    setState('submitting');
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
        body: JSON.stringify({ token }),
      });
      const data = await r.json();
      if (data.success || data.reason === 'already_unsubscribed') setState('done');
      else setState('error');
    } catch { setState('error'); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Email Preferences</CardTitle>
          <CardDescription>Manage your email subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          {state === 'loading' && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
          {state === 'valid' && (
            <>
              <p className="text-sm text-muted-foreground">Click below to unsubscribe from emails.</p>
              <Button className="w-full" onClick={confirm}>Confirm Unsubscribe</Button>
            </>
          )}
          {state === 'submitting' && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
          {state === 'done' && (
            <>
              <CheckCircle className="w-10 h-10 text-success mx-auto" />
              <p className="text-sm">You've been unsubscribed.</p>
            </>
          )}
          {state === 'already' && (
            <>
              <CheckCircle className="w-10 h-10 text-success mx-auto" />
              <p className="text-sm">You're already unsubscribed.</p>
            </>
          )}
          {(state === 'invalid' || state === 'error') && (
            <>
              <XCircle className="w-10 h-10 text-danger mx-auto" />
              <p className="text-sm">This unsubscribe link is invalid or expired.</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
