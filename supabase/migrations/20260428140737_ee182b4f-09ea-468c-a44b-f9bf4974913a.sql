
CREATE TABLE public.guest_inspection_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  factory_location TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  inspection_date DATE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_inspection_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can submit a guest request
CREATE POLICY "Anyone can submit guest inspection request"
ON public.guest_inspection_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view guest requests
CREATE POLICY "Admins can view guest inspection requests"
ON public.guest_inspection_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update guest requests
CREATE POLICY "Admins can update guest inspection requests"
ON public.guest_inspection_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_guest_inspection_requests_updated_at
BEFORE UPDATE ON public.guest_inspection_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
