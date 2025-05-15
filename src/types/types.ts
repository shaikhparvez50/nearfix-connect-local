
import { Database as SupabaseDatabase } from '@/integrations/supabase/types';

export type TablesInsert<T extends keyof SupabaseDatabase['public']['Tables']> = SupabaseDatabase['public']['Tables'][T]['Insert'];

// Define application-specific types that match our database schema
export interface Provider {
  provider_id: string;
  business_name: string;
  rating?: number;
  reviews?: number;
  service_types: string[];
  distance: number;
  address: string;
  verified?: boolean;
  available?: string;
  description?: string;
  hourly_rate?: number;
  latitude?: number;
  longitude?: number;
  user_id: string; // Required for database compatibility
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  email?: string;
  Phone_Number?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  user_id: string; // Required for database compatibility
  responses?: number;
}

export interface SellerPost {
  id: string;
  title: string;
  description: string;
  service_types: string[];
  hourly_rate: number;
  location: string;
  status: string;
  created_at: string;
  user_id: string; // Required for database compatibility
  responses: number;
}

export interface JobPostingForm {
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  Phone_Number?: string;
  email?: string;
  user_id: string; // Required for database compatibility
}
