-- Create job_responses table
CREATE TABLE IF NOT EXISTS public.job_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.job_responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.job_responses
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.job_responses
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on provider_id" ON public.job_responses
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.service_providers WHERE id = provider_id));

CREATE POLICY "Enable delete for users based on provider_id" ON public.job_responses
    FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.service_providers WHERE id = provider_id));

-- Create trigger for updated_at
CREATE TRIGGER update_job_responses_updated_at
    BEFORE UPDATE ON public.job_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 