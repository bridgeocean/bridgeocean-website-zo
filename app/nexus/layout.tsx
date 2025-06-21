import Link from "next/link"
import { Ambulance } from "lucide-react"

export default function NexusLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-red-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Ambulance className="h-6 w-6" />
            <h1 className="text-xl font-bold">Nexus Emergency Logistics</h1>
          </div>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link href="/" className="hover:underline">
                  Bridge Ocean Home
                </Link>
              </li>
              <li>
                <Link href="/nexus/about" className="hover:underline">
                  About Nexus
                </Link>
              </li>
              <li>
                <Link href="/nexus/login" className="hover:underline">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {children}

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Nexus Emergency Logistics</h3>
              <p>A Bridge Ocean Initiative</p>
              <p>Satellite-Powered Emergency Coordination</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p>bridgeocean@cyberservices.com</p>
              <p>08135261568</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:underline">
                    Bridge Ocean Home
                  </Link>
                </li>
                <li>
                  <Link href="/nexus/about" className="hover:underline">
                    About Nexus
                  </Link>
                </li>
                <li>
                  <Link href="/nexus/partners" className="hover:underline">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; {new Date().getFullYear()} Bridge Ocean. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
