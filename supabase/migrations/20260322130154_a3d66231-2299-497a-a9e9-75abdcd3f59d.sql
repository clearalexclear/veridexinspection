
-- Add report_data JSONB column to store full structured report
ALTER TABLE public.inspections ADD COLUMN IF NOT EXISTS report_data jsonb;

-- Allow admins to view all inspections (for admin panel & report assignment)
CREATE POLICY "Admins can view all inspections"
ON public.inspections
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update any inspection (to assign reports to clients)
CREATE POLICY "Admins can update all inspections"
ON public.inspections
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to insert inspections for any user
CREATE POLICY "Admins can insert inspections"
ON public.inspections
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
