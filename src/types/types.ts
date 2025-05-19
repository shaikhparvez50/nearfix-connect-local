
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

