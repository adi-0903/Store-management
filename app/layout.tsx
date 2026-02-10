import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/AuthContext'
import { ProductProvider } from '@/lib/ProductContext'
import { ThemeProvider } from '@/lib/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Slooze Commodities Management',
  description: 'Front-end challenge for commodities management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProductProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
