export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      auth_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          location: string | null
          login_method: string
          session_end: string | null
          session_start: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          location?: string | null
          login_method: string
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          location?: string | null
          login_method?: string
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          file_attachments: Json | null
          id: string
          message: string
          name: string
          read_at: string | null
          replied_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          file_attachments?: Json | null
          id?: string
          message: string
          name: string
          read_at?: string | null
          replied_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          file_attachments?: Json | null
          id?: string
          message?: string
          name?: string
          read_at?: string | null
          replied_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          maximum_discount_cents: number | null
          minimum_order_cents: number | null
          starts_at: string | null
          updated_at: string
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          maximum_discount_cents?: number | null
          minimum_order_cents?: number | null
          starts_at?: string | null
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          maximum_discount_cents?: number | null
          minimum_order_cents?: number | null
          starts_at?: string | null
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: []
      }
      inventory_logs: {
        Row: {
          change_type: string
          created_at: string
          created_by: string | null
          id: string
          new_quantity: number
          notes: string | null
          previous_quantity: number
          product_id: string | null
          quantity_change: number
          reference_id: string | null
          variant_id: string | null
        }
        Insert: {
          change_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          new_quantity: number
          notes?: string | null
          previous_quantity: number
          product_id?: string | null
          quantity_change: number
          reference_id?: string | null
          variant_id?: string | null
        }
        Update: {
          change_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          new_quantity?: number
          notes?: string | null
          previous_quantity?: number
          product_id?: string | null
          quantity_change?: number
          reference_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_logs_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          sku: string | null
          total_price_cents: number
          unit_price_cents: number
          variant_id: string | null
          variant_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          sku?: string | null
          total_price_cents: number
          unit_price_cents: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          sku?: string | null
          total_price_cents?: number
          unit_price_cents?: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country: string | null
          billing_first_name: string | null
          billing_last_name: string | null
          billing_postal_code: string | null
          billing_state: string | null
          created_at: string
          customer_notes: string | null
          delivered_at: string | null
          discount_cents: number | null
          discount_code: string | null
          discount_code_id: string | null
          email: string
          fulfillment_status: string | null
          id: string
          order_number: string
          payment_gateway: string | null
          payment_method: string | null
          payment_status: string
          shipped_at: string | null
          shipping_address_line1: string | null
          shipping_address_line2: string | null
          shipping_cents: number | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_first_name: string | null
          shipping_last_name: string | null
          shipping_phone: string | null
          shipping_postal_code: string | null
          shipping_state: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subtotal_cents: number
          tax_cents: number | null
          total_amount_cents: number | null
          total_cents: number
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_first_name?: string | null
          billing_last_name?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          created_at?: string
          customer_notes?: string | null
          delivered_at?: string | null
          discount_cents?: number | null
          discount_code?: string | null
          discount_code_id?: string | null
          email: string
          fulfillment_status?: string | null
          id?: string
          order_number: string
          payment_gateway?: string | null
          payment_method?: string | null
          payment_status?: string
          shipped_at?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_cents?: number | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal_cents: number
          tax_cents?: number | null
          total_amount_cents?: number | null
          total_cents: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_first_name?: string | null
          billing_last_name?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          created_at?: string
          customer_notes?: string | null
          delivered_at?: string | null
          discount_cents?: number | null
          discount_code?: string | null
          discount_code_id?: string | null
          email?: string
          fulfillment_status?: string | null
          id?: string
          order_number?: string
          payment_gateway?: string | null
          payment_method?: string | null
          payment_status?: string
          shipped_at?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_cents?: number | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal_cents?: number
          tax_cents?: number | null
          total_amount_cents?: number | null
          total_cents?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_discount_code_id_fkey"
            columns: ["discount_code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      payment_retry_logs: {
        Row: {
          attempted_at: string
          created_at: string
          error_message: string | null
          id: string
          new_session_id: string | null
          order_id: string | null
          reason: string | null
          retry_count: number
          retry_url: string | null
          success: boolean | null
        }
        Insert: {
          attempted_at?: string
          created_at?: string
          error_message?: string | null
          id?: string
          new_session_id?: string | null
          order_id?: string | null
          reason?: string | null
          retry_count: number
          retry_url?: string | null
          success?: boolean | null
        }
        Update: {
          attempted_at?: string
          created_at?: string
          error_message?: string | null
          id?: string
          new_session_id?: string | null
          order_id?: string | null
          reason?: string | null
          retry_count?: number
          retry_url?: string | null
          success?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_retry_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          resource: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          resource: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          resource?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          audio_url: string | null
          category: string
          client: string
          cover_image_url: string | null
          created_at: string
          description: string
          external_links: Json | null
          featured: boolean | null
          id: string
          recorded_date: string | null
          title: string
          updated_at: string
          user_id: string | null
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          category: string
          client: string
          cover_image_url?: string | null
          created_at?: string
          description: string
          external_links?: Json | null
          featured?: boolean | null
          id?: string
          recorded_date?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          category?: string
          client?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string
          external_links?: Json | null
          featured?: boolean | null
          id?: string
          recorded_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          created_at: string
          helpful_count: number | null
          id: string
          is_approved: boolean | null
          is_verified_purchase: boolean | null
          product_id: string
          rating: number
          review_text: string | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          product_id: string
          rating: number
          review_text?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          product_id?: string
          rating?: number
          review_text?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          inventory_quantity: number | null
          is_active: boolean | null
          name: string
          option1_name: string | null
          option1_value: string | null
          option2_name: string | null
          option2_value: string | null
          option3_name: string | null
          option3_value: string | null
          price_cents: number | null
          product_id: string
          sku: string | null
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_quantity?: number | null
          is_active?: boolean | null
          name: string
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          option3_name?: string | null
          option3_value?: string | null
          price_cents?: number | null
          product_id: string
          sku?: string | null
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inventory_quantity?: number | null
          is_active?: boolean | null
          name?: string
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          option3_name?: string | null
          option3_value?: string | null
          price_cents?: number | null
          product_id?: string
          sku?: string | null
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allow_backorders: boolean | null
          category_id: string | null
          compare_at_price_cents: number | null
          created_at: string
          description: string | null
          id: string
          inventory_quantity: number | null
          is_active: boolean | null
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          price_cents: number
          requires_shipping: boolean | null
          short_description: string | null
          sku: string | null
          slug: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          track_inventory: boolean | null
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          allow_backorders?: boolean | null
          category_id?: string | null
          compare_at_price_cents?: number | null
          created_at?: string
          description?: string | null
          id?: string
          inventory_quantity?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price_cents: number
          requires_shipping?: boolean | null
          short_description?: string | null
          sku?: string | null
          slug: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          track_inventory?: boolean | null
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          allow_backorders?: boolean | null
          category_id?: string | null
          compare_at_price_cents?: number | null
          created_at?: string
          description?: string | null
          id?: string
          inventory_quantity?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price_cents?: number
          requires_shipping?: boolean | null
          short_description?: string | null
          sku?: string | null
          slug?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          track_inventory?: boolean | null
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      project_categories: {
        Row: {
          color_theme: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color_theme?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color_theme?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_cart: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          session_id: string | null
          updated_at: string
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_cart_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          allow_user_registration: boolean
          brand_colors: Json | null
          contact_email: string
          created_at: string
          email_notifications: boolean
          featured_items_limit: number
          id: number
          logo_url: string | null
          maintenance_mode: boolean
          portfolio_auto_approve: boolean
          site_description: string
          site_name: string
          social_links: Json
          updated_at: string
        }
        Insert: {
          allow_user_registration?: boolean
          brand_colors?: Json | null
          contact_email?: string
          created_at?: string
          email_notifications?: boolean
          featured_items_limit?: number
          id: number
          logo_url?: string | null
          maintenance_mode?: boolean
          portfolio_auto_approve?: boolean
          site_description?: string
          site_name?: string
          social_links?: Json
          updated_at?: string
        }
        Update: {
          allow_user_registration?: boolean
          brand_colors?: Json | null
          contact_email?: string
          created_at?: string
          email_notifications?: boolean
          featured_items_limit?: number
          id?: number
          logo_url?: string | null
          maintenance_mode?: boolean
          portfolio_auto_approve?: boolean
          site_description?: string
          site_name?: string
          social_links?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          company: string | null
          country: string
          created_at: string
          first_name: string
          id: string
          is_default: boolean | null
          last_name: string
          phone: string | null
          postal_code: string
          state: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          company?: string | null
          country?: string
          created_at?: string
          first_name: string
          id?: string
          is_default?: boolean | null
          last_name: string
          phone?: string | null
          postal_code: string
          state: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          company?: string | null
          country?: string
          created_at?: string
          first_name?: string
          id?: string
          is_default?: boolean | null
          last_name?: string
          phone?: string | null
          postal_code?: string
          state?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          currency: string | null
          dashboard_widgets: Json | null
          email_notifications: boolean | null
          id: string
          language: string | null
          marketing_emails: boolean | null
          order_updates: boolean | null
          product_recommendations: boolean | null
          push_notifications: boolean | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          dashboard_widgets?: Json | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          order_updates?: boolean | null
          product_recommendations?: boolean | null
          push_notifications?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          dashboard_widgets?: Json | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          order_updates?: boolean | null
          product_recommendations?: boolean | null
          push_notifications?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          email_verification_expires_at: string | null
          email_verification_token: string | null
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          phone: string | null
          preferences: Json | null
          privacy_settings: Json | null
          profile_completed_at: string | null
          role: string | null
          social_links: Json | null
          timezone: string | null
          updated_at: string
          user_id: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email_verification_expires_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          phone?: string | null
          preferences?: Json | null
          privacy_settings?: Json | null
          profile_completed_at?: string | null
          role?: string | null
          social_links?: Json | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email_verification_expires_at?: string | null
          email_verification_token?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          phone?: string | null
          preferences?: Json | null
          privacy_settings?: Json | null
          profile_completed_at?: string | null
          role?: string | null
          social_links?: Json | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_password_reset_token: {
        Args: { user_email: string }
        Returns: {
          token: string
          user_id: string
          expires_at: string
        }[]
      }
      delete_product_with_orders: {
        Args: { product_id_param: string }
        Returns: boolean
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_secure_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_dashboard_stats: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_details?: Json
        }
        Returns: string
      }
      log_user_activity: {
        Args: {
          p_action: string
          p_resource_type?: string
          p_resource_id?: string
          p_details?: Json
        }
        Returns: string
      }
      track_login_session: {
        Args: {
          p_user_id: string
          p_login_method: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_device_info?: Json
        }
        Returns: string
      }
      user_has_permission: {
        Args: { user_id: string; permission_name: string }
        Returns: boolean
      }
      validate_discount_code: {
        Args: { code_text: string; order_total_cents: number }
        Returns: {
          is_valid: boolean
          discount_id: string
          discount_amount_cents: number
          error_message: string
        }[]
      }
      verify_password_reset_token: {
        Args: { reset_token: string }
        Returns: {
          user_id: string
          is_valid: boolean
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
