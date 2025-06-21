"use server"

import { revalidatePath } from "next/cache"

// In a real app, these would interact with a database
// For this MVP, we'll simulate the functionality

// Type definitions
type EmergencyRequest = {
  id: string
  name: string
  phone: string
  emergencyType: string
  description?: string
  location: { lat: number; lng: number }
  status: "pending" | "dispatched" | "completed"
  createdAt: string
}

type User = {
  id: string
  name: string
  email: string
  userType: "individual" | "ambulance" | "hospital"
}

// Mock database
const emergencyRequests: EmergencyRequest[] = []
const users: User[] = []

export async function createEmergencyRequest(data: any) {
  // In a real app, this would save to a database
  const newRequest: EmergencyRequest = {
    id: `EM-${Math.floor(100000 + Math.random() * 900000)}`,
    name: data.name,
    phone: data.phone,
    emergencyType: data.emergencyType,
    description: data.description,
    location: data.location,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  // Simulate adding to database
  emergencyRequests.push(newRequest)

  // In a real app, we would also trigger notifications here
  // For example, sending SMS to ambulance providers

  revalidatePath("/nexus/dashboard")
  return { success: true, id: newRequest.id }
}

export async function getEmergencyRequests() {
  // In a real app, this would fetch from a database
  // For now, return the mock data
  return emergencyRequests
}

export async function updateEmergencyStatus(id: string, status: "pending" | "dispatched" | "completed") {
  // Find and update the request
  const index = emergencyRequests.findIndex((req) => req.id === id)
  if (index !== -1) {
    emergencyRequests[index].status = status
    revalidatePath("/nexus/dashboard")
    return { success: true }
  }
  return { success: false, error: "Request not found" }
}

export async function registerUser(data: any) {
  // Check if user already exists
  if (users.some((user) => user.email === data.email)) {
    throw new Error("User already exists")
  }

  // In a real app, we would hash the password
  const newUser: User = {
    id: `USER-${Math.floor(100000 + Math.random() * 900000)}`,
    name: data.name,
    email: data.email,
    userType: data.userType,
  }

  users.push(newUser)
  return { success: true, id: newUser.id }
}

export async function loginUser(data: { email: string; password: string }) {
  // In a real app, this would verify credentials against a database
  // For this MVP, we'll simulate successful login
  const user = users.find((u) => u.email === data.email)
  if (!user) {
    // In a real app, we wouldn't reveal if the email exists or not
    throw new Error("Invalid credentials")
  }

  // In a real app, we would verify the password here

  return { success: true, user: { id: user.id, name: user.name, email: user.email, userType: user.userType } }
}
