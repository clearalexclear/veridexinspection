import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src={logo} alt="Inspectra" className="w-10 h-10 mx-auto mb-2" />
            <CardTitle className="text-xl">Sign in to book</CardTitle>
            <CardDescription>You need an account to book an inspection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => navigate('/auth')}>Sign In / Sign Up</Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to website
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    const { error: err } = await supabase.from('inspections').insert({
      user_id: user.id,
      product_name: productName.trim(),
      factory_location: factoryLocation.trim(),
      quantity: parseInt(quantity),
      inspection_date: inspectionDate,
      contact_name: contactName.trim() || null,
      contact_email: contactEmail.trim() || null,
      contact_phone: contactPhone.trim() || null,
      notes: notes.trim() || null,
    });

    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
            <CardTitle className="text-xl">Inspection Booked!</CardTitle>
            <CardDescription>Your inspection has been scheduled. You can track it in your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
