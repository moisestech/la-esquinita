"use client"

import React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbNavProps {
  productName: string
  category?: string | null
}

export default function BreadcrumbNav({ productName, category }: BreadcrumbNavProps) {
  const breadcrumbs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Store", href: "/storefront" },
    ...(category ? [{ name: category, href: `/storefront?category=${category}` }] : []),
    { name: productName, href: "#", current: true }
  ]

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((breadcrumb, index) => {
        const Icon = breadcrumb.icon
        
        return (
          <React.Fragment key={breadcrumb.name}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            
            {breadcrumb.current ? (
              <span className="text-mint-rot font-medium truncate max-w-xs">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="flex items-center space-x-1 hover:text-miami-pink transition-colors duration-300"
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="truncate max-w-xs">{breadcrumb.name}</span>
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
} 