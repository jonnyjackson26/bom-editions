import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Book of Mormon Editions',
  description: 'Read and compare different editions of the Book of Mormon from 1830 to 2013',
  keywords: 'Book of Mormon, editions, 1830, religious texts, scripture comparison',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="cIwMDOFCFHTNmcB9IjjRDzOPF7sIqKvtfvoPdmCGw4A" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
