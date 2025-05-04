import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uebqxjjxvfwptwnklwvz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlYnF4amp4dmZ3cHR3bmtsd3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MDI0OTgsImV4cCI6MjA2MDk3ODQ5OH0.VjY9tGZiJ90sGkTNwIyedErpH-BwAZBABNmjru-j9Ec';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);