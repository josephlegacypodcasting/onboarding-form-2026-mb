-- Remove overly permissive public policies that allow anyone to read/list and upload files
DROP POLICY IF EXISTS "Anyone can read form uploads" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload files" ON storage.objects;

-- Restrict access to the service role only (edge functions). No public/anon read, list, or write.
CREATE POLICY "Service role manages form uploads"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'form-uploads')
WITH CHECK (bucket_id = 'form-uploads');