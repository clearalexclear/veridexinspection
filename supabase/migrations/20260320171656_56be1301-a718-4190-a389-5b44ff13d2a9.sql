
-- Storage bucket for uploaded inspection files
INSERT INTO storage.buckets (id, name, public) VALUES ('inspection-uploads', 'inspection-uploads', false);

-- RLS: authenticated users can upload to their own folder
CREATE POLICY "Users can upload inspection files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'inspection-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: users can read their own uploads
CREATE POLICY "Users can read own inspection files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'inspection-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

-- RLS: users can delete their own uploads
CREATE POLICY "Users can delete own inspection files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'inspection-uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
