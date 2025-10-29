export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      geo_locations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          latitude: number
          longitude: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          budget: number | null
          category: string
          contact_email: string | null
          contact_phone: number | null
          created_at: string
          description: string
          duration: string | null
          email: string | null
          id: string
          images: string[] | null
          location: string
          Phone_Number: number | null
          preferred_time: string | null
          skills_required: string[] | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          category: string
          contact_email?: string | null
          contact_phone?: number | null
          created_at?: string
          description: string
          duration?: string | null
          email?: string | null
          id?: string
          images?: string[] | null
          location: string
          Phone_Number?: number | null
          preferred_time?: string | null
          skills_required?: string[] | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          category?: string
          contact_email?: string | null
          contact_phone?: number | null
          created_at?: string
          description?: string
          duration?: string | null
          email?: string | null
          id?: string
          images?: string[] | null
          location?: string
          Phone_Number?: number | null
          preferred_time?: string | null
          skills_required?: string[] | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      otp_verification: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          otp: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp?: string
          verified?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          pincode: string | null
          role: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          pincode?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          pincode?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      seller_profiles: {
        Row: {
          business_name: string
          created_at: string
          description: string | null
          hourly_rate: number | null
          id: string
          id_proof: string | null
          is_verified: boolean
          profile_image: string | null
          services: string[]
          updated_at: string
          user_id: string
          work_samples: string[] | null
        }
        Insert: {
          business_name: string
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          id_proof?: string | null
          is_verified?: boolean
          profile_image?: string | null
          services: string[]
          updated_at?: string
          user_id: string
          work_samples?: string[] | null
        }
        Update: {
          business_name?: string
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          id_proof?: string | null
          is_verified?: boolean
          profile_image?: string | null
          services?: string[]
          updated_at?: string
          user_id?: string
          work_samples?: string[] | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          availability_schedule: Json | null
          business_name: string | null
          created_at: string
          description: string | null
          hourly_rate: number | null
          id: string
          is_available: boolean
          service_types: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          availability_schedule?: Json | null
          business_name?: string | null
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean
          service_types: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          availability_schedule?: Json | null
          business_name?: string | null
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean
          service_types?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          pincode: string | null
          role: string
          updated_at: string
          user_role: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          pincode?: string | null
          role?: string
          updated_at?: string
          user_role?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          pincode?: string | null
          role?: string
          updated_at?: string
          user_role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      find_nearest_providers: {
        Args: { limit_count?: number; user_lat: number; user_lon: number }
        Returns: {
          address: string
          business_name: string
          description: string
          distance: number
          hourly_rate: number
          latitude: number
          longitude: number
          provider_id: string
          service_types: string[]
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
