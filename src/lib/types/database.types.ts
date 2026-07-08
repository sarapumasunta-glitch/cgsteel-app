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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          company_name: string | null
          contact_name: string
          created_at: string
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          ruc: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          contact_name: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          ruc?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_name?: string | null
          contact_name?: string
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          ruc?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_files: {
        Row: {
          created_at: string
          description: string | null
          file_kind: Database["public"]["Enums"]["file_kind"]
          file_name: string
          file_url: string
          id: string
          order_id: string
          status_history_id: string | null
          uploaded_by: string | null
          visible_to_client: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_kind?: Database["public"]["Enums"]["file_kind"]
          file_name: string
          file_url: string
          id?: string
          order_id: string
          status_history_id?: string | null
          uploaded_by?: string | null
          visible_to_client?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          file_kind?: Database["public"]["Enums"]["file_kind"]
          file_name?: string
          file_url?: string
          id?: string
          order_id?: string
          status_history_id?: string | null
          uploaded_by?: string | null
          visible_to_client?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "order_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_files_status_history_id_fkey"
            columns: ["status_history_id"]
            isOneToOne: false
            referencedRelation: "order_status_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          order_id: string
          progress_percent: number | null
          status: Database["public"]["Enums"]["order_status"]
          visible_to_client: boolean
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id: string
          progress_percent?: number | null
          status: Database["public"]["Enums"]["order_status"]
          visible_to_client?: boolean
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id?: string
          progress_percent?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          visible_to_client?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_delivery_date: string | null
          channel: Database["public"]["Enums"]["order_channel"]
          client_id: string
          created_at: string
          created_by: string | null
          description: string
          entry_date: string
          estimated_cost: number
          estimated_delivery_date: string | null
          estimated_value: number
          expected_profit: number | null
          id: string
          notes: string | null
          order_number: string
          quote_id: string | null
          responsible: string | null
          status: Database["public"]["Enums"]["order_status"]
          tracking_token: string
          updated_at: string
        }
        Insert: {
          actual_delivery_date?: string | null
          channel: Database["public"]["Enums"]["order_channel"]
          client_id: string
          created_at?: string
          created_by?: string | null
          description: string
          entry_date?: string
          estimated_cost?: number
          estimated_delivery_date?: string | null
          estimated_value?: number
          expected_profit?: number | null
          id?: string
          notes?: string | null
          order_number: string
          quote_id?: string | null
          responsible?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          tracking_token?: string
          updated_at?: string
        }
        Update: {
          actual_delivery_date?: string | null
          channel?: Database["public"]["Enums"]["order_channel"]
          client_id?: string
          created_at?: string
          created_by?: string | null
          description?: string
          entry_date?: string
          estimated_cost?: number
          estimated_delivery_date?: string | null
          estimated_value?: number
          expected_profit?: number | null
          id?: string
          notes?: string | null
          order_number?: string
          quote_id?: string | null
          responsible?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          tracking_token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          name: string
          price_range: string | null
          sort_order: number
          technical_details: string | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name: string
          price_range?: string | null
          sort_order?: number
          technical_details?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name?: string
          price_range?: string | null
          sort_order?: number
          technical_details?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          id: string
          material: string
          notes: string | null
          order_id: string | null
          purchase_date: string
          supplier_name: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          id?: string
          material: string
          notes?: string | null
          order_id?: string | null
          purchase_date?: string
          supplier_name: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          material?: string
          notes?: string | null
          order_id?: string | null
          purchase_date?: string
          supplier_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          description: string
          id: string
          quantity: number
          quote_id: string
          sort_order: number
          subtotal: number | null
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          quantity?: number
          quote_id: string
          sort_order?: number
          subtotal?: number | null
          unit_price?: number
        }
        Update: {
          description?: string
          id?: string
          quantity?: number
          quote_id?: string
          sort_order?: number
          subtotal?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          company_name: string | null
          converted_client_id: string | null
          created_at: string
          description: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          status: string
        }
        Insert: {
          company_name?: string | null
          converted_client_id?: string | null
          created_at?: string
          description: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          status?: string
        }
        Update: {
          company_name?: string | null
          converted_client_id?: string | null
          created_at?: string
          description?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_converted_client_id_fkey"
            columns: ["converted_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          pdf_url: string | null
          quote_number: string
          status: Database["public"]["Enums"]["quote_status"]
          subtotal: number
          tax: number
          total: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          pdf_url?: string | null
          quote_number: string
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          pdf_url?: string | null
          quote_number?: string
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          order_id: string | null
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          transaction_date?: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_order_by_tracking: { Args: { p_token: string }; Returns: Json }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      file_kind:
        | "cotizacion"
        | "plano"
        | "foto_antes"
        | "foto_avance"
        | "foto_despues"
        | "orden_compra"
        | "factura"
        | "comprobante"
        | "certificado"
        | "otro"
      order_channel:
        | "pagina_web"
        | "whatsapp"
        | "llamada"
        | "referido"
        | "cliente_frecuente"
        | "correo"
        | "visita_comercial"
      order_status:
        | "pendiente"
        | "diseno"
        | "cotizado"
        | "aprobado"
        | "en_fabricacion"
        | "pintura"
        | "control_calidad"
        | "listo_entrega"
        | "entregado"
        | "cancelado"
      product_category: "arquitectura" | "publicidad" | "decoracion" | "eventos"
      quote_status:
        | "borrador"
        | "enviada"
        | "aprobada"
        | "rechazada"
        | "vencida"
      transaction_type: "ingreso" | "egreso"
      user_role:
        | "admin"
        | "ventas"
        | "produccion"
        | "contabilidad"
        | "supervisor"
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
    Enums: {
      file_kind: [
        "cotizacion",
        "plano",
        "foto_antes",
        "foto_avance",
        "foto_despues",
        "orden_compra",
        "factura",
        "comprobante",
        "certificado",
        "otro",
      ],
      order_channel: [
        "pagina_web",
        "whatsapp",
        "llamada",
        "referido",
        "cliente_frecuente",
        "correo",
        "visita_comercial",
      ],
      order_status: [
        "pendiente",
        "diseno",
        "cotizado",
        "aprobado",
        "en_fabricacion",
        "pintura",
        "control_calidad",
        "listo_entrega",
        "entregado",
        "cancelado",
      ],
      product_category: ["arquitectura", "publicidad", "decoracion", "eventos"],
      quote_status: ["borrador", "enviada", "aprobada", "rechazada", "vencida"],
      transaction_type: ["ingreso", "egreso"],
      user_role: [
        "admin",
        "ventas",
        "produccion",
        "contabilidad",
        "supervisor",
      ],
    },
  },
} as const
