-- Create job_postings table
CREATE TABLE IF NOT EXISTS public.job_postings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.job_postings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.job_postings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id" ON public.job_postings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON public.job_postings
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_job_postings_updated_at
    BEFORE UPDATE ON public.job_postings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 