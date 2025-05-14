
import { Database } from '@/integrations/supabase/types';

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

export interface Database {
  public: {
    Tables: {
      job_postings: {
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          location: string;
          budget: number;
          phone_number?: string;
          email?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 
