-- Enable RLS on documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting documents
CREATE POLICY "Users can insert their own documents"
ON documents FOR INSERT
WITH CHECK (auth.role() = 'service_role' OR auth.jwt()->>'email' = user_email);

-- Create policy for selecting documents
CREATE POLICY "Users can view their own documents"
ON documents FOR SELECT
USING (auth.role() = 'service_role' OR auth.jwt()->>'email' = user_email);

-- Create policy for updating documents
CREATE POLICY "Users can update their own documents"
ON documents FOR UPDATE
USING (auth.role() = 'service_role' OR auth.jwt()->>'email' = user_email)
WITH CHECK (auth.role() = 'service_role' OR auth.jwt()->>'email' = user_email);

-- Create policy for deleting documents
CREATE POLICY "Users can delete their own documents"
ON documents FOR DELETE
USING (auth.role() = 'service_role' OR auth.jwt()->>'email' = user_email);
