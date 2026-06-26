-- Create storage bucket for form uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('form-uploads', 'form-uploads', true);

-- Allow anyone to upload files to form-uploads bucket
CREATE POLICY "Anyone can upload files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'form-uploads');

-- Allow anyone to read files from form-uploads bucket
CREATE POLICY "Anyone can read form uploads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'form-uploads');