"use client"
import { usePathname } from "next/navigation"

const NotFound = () => {
    const pathname = usePathname()
  // Assuming your route is /dashboard/[slug], split the path to get the slug
  const segments = pathname.split('/')
  const slug = segments[segments.length - 1]
  return (
    <div>
      <h1>{slug} - Page Not Found</h1>
      <p>Yet to render this page at the moment</p>
    </div>
  )
}

export default NotFound