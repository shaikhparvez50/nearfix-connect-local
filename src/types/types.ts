
// Common type definitions for the application

export interface JobPostingType {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  created_at: string;
  status: string;
  user_id?: string;
  skills_required?: string[];
  images?: string[];
  contact_email?: string;
  contact_phone?: string;
  duration?: string;
  preferred_time?: string;
}

export interface ProviderType {
  provider_id: string;
  user_id: string;
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
  profile_image?: string;
  work_samples?: string[];
  phone?: string;
  email?: string;
}

export interface UserLocationType {
  latitude: number;
  longitude: number;
  address?: string;
}

// Common service categories
export const SERVICE_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Fabrication',
  'Cleaning',
  'Gardening',
  'Home Repair',
  'Moving',
  'Appliance Repair',
  'Flooring',
  'Roofing',
  'Security',
  'Air Conditioning',
  'Other'
];

// Database job posting type to match Supabase schema
export interface DbJobPosting {
  id: string;
  user_id: string;
  budget: number | null;
  created_at: string;
  updated_at: string;
  Phone_Number?: number | null;
  contact_phone?: number | null; 
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  email?: string | null;
  contact_email?: string | null;
  duration?: string | null;
  preferred_time?: string | null;
  skills_required?: string[];
  images?: string[];
}
