"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"

const navigation = [
  { name: "Nexus Emergency", href: "/nexus" },
  { name: "Charter Services", href: "/charter" },
  { name: "Partner With Us", href: "/charter/partner" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/bridgeocean-logo.jpg" alt="Bridgeocean" width={40} height={40} className="rounded-full" />
          <span className="font-bold text-xl">Bridgeocean</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={cn("hidden md:flex items-center space-x-4 lg:space-x-6 mx-6", className)} {...props}>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-black dark:text-white" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center space-x-2">
          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                <Link href="/" className="flex items-center space-x-2 mb-4">
                  <Image
                    src="/images/bridgeocean-logo.jpg"
                    alt="Bridgeocean"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-bold text-xl">Bridgeocean</span>
                </Link>
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary py-2",
                      pathname === item.href ? "text-black dark:text-white" : "text-muted-foreground",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
