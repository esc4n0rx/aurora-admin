import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aurora+ Admin Dashboard",
  description: "Painel administrativo da plataforma de streaming Aurora+",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            expand={false}
            richColors
            closeButton
          />
        </AuthProvider>
      </body>
    </html>
  )
}