"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Real-time subscription for emergency updates
export const subscribeToEmergencies = (callback: (payload: any) => void) => {
  return supabase
    .channel("emergency_requests")
    .on("postgres_changes", { event: "*", schema: "public", table: "emergency_requests" }, callback)
    .subscribe()
}

// Real-time subscription for ambulance locations
export const subscribeToAmbulances = (callback: (payload: any) => void) => {
  return supabase
    .channel("ambulances")
    .on("postgres_changes", { event: "*", schema: "public", table: "ambulances" }, callback)
    .subscribe()
}
