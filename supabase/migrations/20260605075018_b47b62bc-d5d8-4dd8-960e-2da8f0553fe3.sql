
CREATE OR REPLACE FUNCTION public.claim_guest_inspections()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.inspections (
    user_id, product_name, factory_location, quantity, inspection_date,
    contact_name, contact_email, contact_phone, notes, status, created_at, updated_at
  )
  SELECT
    NEW.id, g.product_name, g.factory_location, g.quantity, g.inspection_date,
    g.contact_name, g.contact_email, g.contact_phone, g.notes,
    CASE WHEN g.status IN ('scheduled','in_progress','completed') THEN g.status ELSE 'scheduled' END,
    g.created_at, g.updated_at
  FROM public.guest_inspection_requests g
  WHERE lower(g.contact_email) = lower(NEW.email);

  DELETE FROM public.guest_inspection_requests g
  WHERE lower(g.contact_email) = lower(NEW.email);

  RETURN NEW;
END;
$$;
