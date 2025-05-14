export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          created_at: string
          description: string
          email: string | null
          id: string
          location: string
          Phone_Number: number | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number | null
          category: string
          created_at?: string
          description: string
          email?: string | null
          id?: string
          location: string
          Phone_Number?: number | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number | null
          category?: string
          created_at?: string
          description?: string
          email?: string | null
          id?: string
          location?: string
          Phone_Number?: number | null
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
          is_verified: boolean
          services: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name: string
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean
          services: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string
          created_at?: string
          description?: string | null
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean
          services?: string[]
          updated_at?: string
          user_id?: string
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
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      find_nearest_providers: {
        Args: { user_lat: number; user_lon: number; limit_count?: number }
        Returns: {
          provider_id: string
          user_id: string
          business_name: string
          service_types: string[]
          description: string
          hourly_rate: number
          distance: number
          latitude: number
          longitude: number
          address: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
