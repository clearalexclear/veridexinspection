import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ttqTrack, ttqTrackOnce } from '@/lib/tiktok';

import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function BookInspection() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [factoryLocation, setFactoryLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Thanks — we received your inspection request. We'll contact you shortly.");
  const [error, setError] = useState('');

  const resetForm = () => {
    setProductName('');
    setFactoryLocation('');
    setQuantity('');
    setInspectionDate('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // spam bot
    setLoading(true);
    setError('');

    const bookingId = crypto.randomUUID();

    // Persist to DB in background (does not block email delivery)
    if (user) {
      supabase.from('inspections').insert({
        id: bookingId,
        user_id: user.id,
        product_name: productName.trim(),
        factory_location: factoryLocation.trim(),
        quantity: parseInt(quantity),
        inspection_date: inspectionDate,
        contact_name: contactName.trim() || null,
        contact_email: contactEmail.trim() || null,
        contact_phone: contactPhone.trim() || null,
        notes: notes.trim() || null,
      }).then(({ error: dbErr }) => { if (dbErr) console.error('DB insert failed', dbErr); });
    } else {
      supabase.from('guest_inspection_requests').insert({
        id: bookingId,
        product_name: productName.trim(),
        factory_location: factoryLocation.trim(),
        quantity: parseInt(quantity),
        inspection_date: inspectionDate,
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim() || null,
        notes: notes.trim() || null,
      }).then(({ error: dbErr }) => { if (dbErr) console.error('DB insert failed', dbErr); });
    }

    try {
      const res = await fetch('https://formsubmit.co/ajax/masseyalexandre@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'New Veridex inspection request',
          _template: 'table',
          _captcha: 'false',
          _honey: honeypot,
          'Product Name': productName.trim(),
          'Factory Location': factoryLocation.trim(),
          'Order Quantity': quantity,
          'Inspection Date': inspectionDate,
          'Your Name': contactName.trim(),
          'Email': contactEmail.trim(),
          'Phone / WhatsApp': contactPhone.trim(),
          'Additional Notes': notes.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || (data && data.success === 'false')) {
        console.error('FormSubmit failed', res.status, data);
        setError('Something went wrong. Please try again or contact us directly.');
      } else {
        ttqTrack('SubmitForm', { content_name: 'Inspection Quote Request' });
        ttqTrack('Contact', { content_name: 'Inspection Lead' });
        resetForm();
        setSuccessMessage("Thanks — we received your inspection request. We'll contact you shortly.");
        setSuccess(true);
      }
    } catch (err) {
      console.error('FormSubmit network error', err);
      setError('Something went wrong. Please try again or contact us directly.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
            <CardTitle className="text-xl">Inspection Request Received!</CardTitle>
            <CardDescription>
              {successMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {user ? (
              <Button className="w-full" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            ) : (
              <>
                <Button className="w-full" onClick={() => navigate('/')}>Back to Home</Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/auth')}>Create an account to track</Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to website
        </button>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Book an Inspection</CardTitle>
            <CardDescription>Tell us about your product and we'll arrange the inspection.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} onFocus={() => ttqTrackOnce('quote-form-started', 'ClickButton', { content_name: 'Quote Form Started' })} className="space-y-4">
              {/* honeypot: hidden from real users, bots will fill it */}
              <input
                type="text"
                name="_honey"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                aria-hidden="true"
              />
              <div className="space-y-2">
                <Label htmlFor="product">Product Name</Label>
                <Input id="product" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Stainless Steel Water Bottle 750ml" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="factory">Factory Location</Label>
                <Input id="factory" value={factoryLocation} onChange={(e) => setFactoryLocation(e.target.value)} placeholder="e.g. Guangzhou, China" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty">Order Quantity</Label>
                  <Input id="qty" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="5000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Inspection Date</Label>
                  <Input id="date" type="date" value={inspectionDate} onChange={(e) => setInspectionDate(e.target.value)} required />
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-3">Contact Details</p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Your Name</Label>
                    <Input id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. John Smith" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="john@company.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone / WhatsApp</Label>
                      <Input id="contactPhone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+1 234 567 890" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any details about the inspection scope, special requirements, etc." rows={3} />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-danger font-medium bg-danger/10 px-3 py-2 rounded-lg">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Book Inspection
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
