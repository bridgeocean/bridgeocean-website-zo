import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Car, BarChart3, FileText, Brain } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your BridgeOcean operations and business content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Partner Approvals
            </CardTitle>
            <CardDescription>
              Review car owner registrations, uploaded documents, and approve new partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/approvals">
              <Button className="w-full">Manage Partner Applications</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Fleet Management
            </CardTitle>
            <CardDescription>Manage your vehicle fleet and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/fleet">
              <Button className="w-full">Manage Fleet</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics & Reports
            </CardTitle>
            <CardDescription>View business analytics, bookings, and performance reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">View Analytics</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Communications Hub
            </CardTitle>
            <CardDescription>WhatsApp messaging, email automation, and invoice generation</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/communications">
              <Button className="w-full">Communications & Invoices</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Content Generator
            </CardTitle>
            <CardDescription>
              Generate professional content for Facebook, Instagram, and social media using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin-dashboard/content-generator">
              <Button className="w-full">Create Social Content</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
