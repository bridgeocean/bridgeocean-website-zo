import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowLeft } from "lucide-react"

export default function RequestConfirmation() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Emergency Request Submitted</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg">Your emergency request has been received and is being processed.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ol className="text-left list-decimal pl-5 space-y-2">
              <li>Our system is locating the nearest available ambulance</li>
              <li>You will receive a confirmation call shortly</li>
              <li>Updates will be sent to your phone number</li>
            </ol>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">
              <strong>Emergency ID:</strong> #EM-{Math.floor(100000 + Math.random() * 900000)}
            </p>
            <p className="text-sm text-yellow-700 mt-1">Please keep this ID for reference</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
