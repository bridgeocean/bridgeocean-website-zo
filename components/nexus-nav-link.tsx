"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NexusNavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function NexusNavLink({ href, children, className }: NexusNavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-red-600",
        isActive ? "text-red-600 font-medium" : "text-gray-600",
        className,
      )}
    >
      {children}
    </Link>
  )
}
