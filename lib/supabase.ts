import { createClient } from "@supabase/supabase-js"

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return !!(
    (
      url &&
      key &&
      url !== "https://placeholder.supabase.co" &&
      key !== "placeholder-key" &&
      url.includes("supabase.co") &&
      key.length > 20
    ) // Basic validation for key length
  )
}

// Get Supabase configuration
function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isSupabaseConfigured()) {
    // Return null config when not properly configured
    return { url: null, key: null }
  }

  return { url, key }
}

// Create Supabase client only if properly configured
function createSupabaseClient() {
  const { url, key } = getSupabaseConfig()

  if (!url || !key) {
    // Return a mock client that throws helpful errors
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: new Error("Supabase not configured") }),
        insert: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        update: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        delete: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      }),
      auth: {
        signUp: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        signIn: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        signOut: () => Promise.resolve({ error: new Error("Supabase not configured") }),
      },
    } as any
  }

  return createClient(url, key)
}

// Create Supabase admin client only if properly configured
function createSupabaseAdminClient() {
  const { url } = getSupabaseConfig()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: new Error("Supabase admin not configured") }),
        insert: () => Promise.resolve({ data: null, error: new Error("Supabase admin not configured") }),
        update: () => Promise.resolve({ data: null, error: new Error("Supabase admin not configured") }),
        delete: () => Promise.resolve({ data: null, error: new Error("Supabase admin not configured") }),
      }),
    } as any
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export const supabase = createSupabaseClient()
export const supabaseAdmin = createSupabaseAdminClient()

// Database types for authentication
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          company: string | null
          position: string | null
          role: "admin" | "user"
          status: "pending" | "approved" | "rejected"
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          company?: string | null
          position?: string | null
          role?: "admin" | "user"
          status?: "pending" | "approved" | "rejected"
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          company?: string | null
          position?: string | null
          role?: "admin" | "user"
          status?: "pending" | "approved" | "rejected"
          created_at?: string
        }
      }
      charter_bookings: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          pickup_location: string
          destination: string
          date: string
          time: string
          duration: number
          vehicle: string
          passengers: number
          special_requests: string | null
          total_price: number
          status: "pending" | "confirmed" | "completed" | "cancelled"
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          pickup_location: string
          destination: string
          date: string
          time: string
          duration: number
          vehicle: string
          passengers: number
          special_requests?: string | null
          total_price: number
          status?: "pending" | "confirmed" | "completed" | "cancelled"
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          pickup_location?: string
          destination?: string
          date?: string
          time?: string
          duration?: number
          vehicle?: string
          passengers?: number
          special_requests?: string | null
          total_price?: number
          status?: "pending" | "confirmed" | "completed" | "cancelled"
          created_at?: string
        }
      }
      fleet_vehicles: {
        Row: {
          id: string
          name: string
          category: string
          year: string
          passengers: number
          price_per_hour: number
          status: "available" | "booked" | "maintenance"
          features: string[]
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          year: string
          passengers: number
          price_per_hour: number
          status?: "available" | "booked" | "maintenance"
          features?: string[]
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          year?: string
          passengers?: number
          price_per_hour?: number
          status?: "available" | "booked" | "maintenance"
          features?: string[]
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      partner_registrations: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          company: string
          vehicle_make: string
          vehicle_model: string
          vehicle_year: string
          vehicle_color: string
          license_plate: string
          identification_type: string
          identification_number: string
          status: "pending" | "approved" | "rejected"
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          company: string
          vehicle_make: string
          vehicle_model: string
          vehicle_year: string
          vehicle_color: string
          license_plate: string
          identification_type: string
          identification_number: string
          status?: "pending" | "approved" | "rejected"
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          company?: string
          vehicle_make?: string
          vehicle_model?: string
          vehicle_year?: string
          vehicle_color?: string
          license_plate?: string
          identification_type?: string
          identification_number?: string
          status?: "pending" | "approved" | "rejected"
          created_at?: string
        }
      }
      driver_candidates: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          stage: string
          status: "active" | "inactive" | "hired" | "rejected"
          last_contact: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          stage: string
          status?: "active" | "inactive" | "hired" | "rejected"
          last_contact: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          stage?: string
          status?: "active" | "inactive" | "hired" | "rejected"
          last_contact?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
