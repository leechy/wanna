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
      items: {
        Row: {
          created_at: string | null
          deleted: boolean | null
          id: string
          is_active: boolean
          is_public: boolean
          name: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted?: boolean | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          name: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted?: boolean | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          name?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      list_items: {
        Row: {
          created_at: string | null
          deadline: string | null
          deleted: boolean | null
          id: string
          is_active: boolean
          is_completed: boolean
          is_ongoing: boolean
          item_id: string
          list_id: string
          location_id: string | null
          quantity: number | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          deleted?: boolean | null
          id?: string
          is_active?: boolean
          is_completed?: boolean
          is_ongoing?: boolean
          item_id: string
          list_id: string
          location_id?: string | null
          quantity?: number | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          deleted?: boolean | null
          id?: string
          is_active?: boolean
          is_completed?: boolean
          is_ongoing?: boolean
          item_id?: string
          list_id?: string
          location_id?: string | null
          quantity?: number | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lists: {
        Row: {
          created_at: string | null
          deadline: string | null
          deleted: boolean | null
          hide_completed: boolean
          id: string
          is_active: boolean
          name: string
          notify_on_item_state_update: boolean
          notify_on_list_items_update: boolean
          notify_on_user_at_location: boolean
          share_id: string
          type: string
          updated_at: string | null
          user_ids: string[] | null
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          deleted?: boolean | null
          hide_completed?: boolean
          id?: string
          is_active?: boolean
          name: string
          notify_on_item_state_update?: boolean
          notify_on_list_items_update?: boolean
          notify_on_user_at_location?: boolean
          share_id?: string
          type: string
          updated_at?: string | null
          user_ids?: string[] | null
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          deleted?: boolean | null
          hide_completed?: boolean
          id?: string
          is_active?: boolean
          name?: string
          notify_on_item_state_update?: boolean
          notify_on_list_items_update?: boolean
          notify_on_user_at_location?: boolean
          share_id?: string
          type?: string
          updated_at?: string | null
          user_ids?: string[] | null
        }
        Relationships: []
      }
      user_lists: {
        Row: {
          created_at: string | null
          deleted: boolean | null
          id: string
          is_active: boolean
          list_id: string
          notify_on_item_state_update: boolean
          notify_on_list_items_update: boolean
          notify_on_user_at_location: boolean
          sort_order: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted?: boolean | null
          id?: string
          is_active?: boolean
          list_id: string
          notify_on_item_state_update?: boolean
          notify_on_list_items_update?: boolean
          notify_on_user_at_location?: boolean
          sort_order?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted?: boolean | null
          id?: string
          is_active?: boolean
          list_id?: string
          notify_on_item_state_update?: boolean
          notify_on_list_items_update?: boolean
          notify_on_user_at_location?: boolean
          sort_order?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lists_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          deleted: boolean | null
          id: string
          is_active: boolean
          is_public: boolean
          names: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted?: boolean | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          names?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted?: boolean | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          names?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
