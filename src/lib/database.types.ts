export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" };
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string;
          duration_min: number;
          id: string;
          room_id: string;
          spot_id: string;
          starts_at: string;
          status: Database["public"]["Enums"]["booking_status"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          duration_min: number;
          id?: string;
          room_id: string;
          spot_id: string;
          starts_at: string;
          status?: Database["public"]["Enums"]["booking_status"];
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_color: string;
          created_at: string;
          display_name: string;
          id: string;
          major: string | null;
          year: string | null;
        };
        Insert: {
          avatar_color?: string;
          created_at?: string;
          display_name: string;
          id: string;
          major?: string | null;
          year?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      reports: {
        Row: {
          created_at: string;
          id: string;
          spot_id: string;
          status: Database["public"]["Enums"]["report_status"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          spot_id: string;
          status: Database["public"]["Enums"]["report_status"];
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
        Relationships: [];
      };
      rooms: {
        Row: {
          capacity: number;
          created_at: string;
          floor: string;
          id: string;
          name: string;
          spot_id: string;
        };
        Insert: {
          capacity: number;
          created_at?: string;
          floor: string;
          id: string;
          name: string;
          spot_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["rooms"]["Insert"]>;
        Relationships: [];
      };
      saved_spots: {
        Row: { created_at: string; spot_id: string; user_id: string };
        Insert: { created_at?: string; spot_id: string; user_id: string };
        Update: Partial<Database["public"]["Tables"]["saved_spots"]["Insert"]>;
        Relationships: [];
      };
      spots: {
        Row: {
          amenities: Json;
          created_at: string;
          description: string;
          has_group_rooms: boolean;
          hours: string;
          id: string;
          initial: string;
          name: string;
          open_now: boolean;
          pos: Json;
          type: string;
          walk_min: number;
        };
        Insert: {
          amenities?: Json;
          created_at?: string;
          description: string;
          has_group_rooms?: boolean;
          hours: string;
          id: string;
          initial: string;
          name: string;
          open_now?: boolean;
          pos?: Json;
          type: string;
          walk_min: number;
        };
        Update: Partial<Database["public"]["Tables"]["spots"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      has_booking_conflict: {
        Args: { p_duration_min: number; p_room_id: string; p_starts_at: string };
        Returns: boolean;
      };
    };
    Enums: {
      booking_status: "upcoming" | "past" | "cancelled";
      report_status: "open" | "fill" | "full";
    };
    CompositeTypes: { [_ in never]: never };
  };
};
