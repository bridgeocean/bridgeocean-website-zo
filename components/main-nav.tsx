"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ExternalLink } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"

const navigation = [
  { name: "Nexus Platform", href: "/nexus", external: false },
  { name: "Corporate Dashboard", href: "https://app.bridgeocean.xyz", external: true },
  { name: "Charter", href: "/charter", external: false },
  { name: "About", href: "/about", external: false },
  { name: "Contact", href: "/contact", external: false },
]

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="border-b bg-black text-white">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/bridgeocean-logo.jpg"
            alt="Bridgeocean"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-bold text-lg text-white">Bridgeocean</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={cn("hidden md:flex items-center space-x-1 lg:space-x-2 mx-6", className)} {...props}>
          {navigation.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
              >
                {item.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium px-3 py-2 rounded-md transition-colors",
                  pathname === item.href
                    ? "text-white bg-zinc-800"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800",
                )}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>

        <div className="ml-auto flex items-center space-x-2">
          {/* Nexus CTA */}
          <Button
            size="sm"
            className="hidden md:flex bg-red-600 hover:bg-red-700 text-white text-xs"
            onClick={() => window.open("https://nexus.anytaskchill.com", "_blank")}
          >
            Access Nexus
          </Button>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-zinc-800">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black text-white border-zinc-800">
              <div className="flex flex-col space-y-2 mt-6">
                <Link href="/" className="flex items-center space-x-2 mb-6">
                  <Image
                    src="/images/bridgeocean-logo.jpg"
                    alt="Bridgeocean"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-bold text-xl text-white">Bridgeocean</span>
                </Link>
                {navigation.map((item) =>
                  item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-lg font-medium py-2 text-zinc-400 hover:text-white transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-lg font-medium py-2 transition-colors",
                        pathname === item.href ? "text-white" : "text-zinc-400 hover:text-white",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
                <div className="pt-4 border-t border-zinc-800">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => { window.open("https://nexus.anytaskchill.com", "_blank"); setOpen(false); }}
                  >
                    Access Nexus Platform
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
