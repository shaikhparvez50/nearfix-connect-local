
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
}

export interface UserLocationType {
  latitude: number;
  longitude: number;
  address?: string;
}
