import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BRANA KIDS | Children's Store - Let Your Kid Smile",
  description: "Discover the best children's products at BRANA KIDS. From toys to clothing, we bring joy and smiles to your little ones. Quality products for happy kids.",
  keywords: "children store, kids toys, baby products, children clothing, kids accessories, BRANA KIDS, children Kenya",
  generator: 'v0.dev',
  metadataBase: new URL('https://branakids.co.ke'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://branakids.co.ke/',
    title: "BRANA KIDS | Children's Store - Let Your Kid Smile",
    description: "Discover the best children's products at BRANA KIDS. From toys to clothing, we bring joy and smiles to your little ones.",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'BRANA KIDS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "BRANA KIDS | Children's Store - Let Your Kid Smile",
    description: "Discover the best children's products at BRANA KIDS. From toys to clothing, we bring joy and smiles to your little ones.",
    images: ['/logo.png'],
  },
  verification: {
    google: 'YOUR_GOOGLE_SITE_VERIFICATION_CODE',
  },
  other: {
    'theme-color': '#22C55E',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const whatsappPhone = process.env.WHATSAPP_PHONE || "+254758212888";
  
  const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BRANA KIDS",
      "url": "https://branakids.co.ke",
      "logo": "https://branakids.co.ke/logo.png",
      "description": "Children's store bringing joy and smiles to your little ones",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": whatsappPhone,
        "contactType": "customer service",
        "areaServed": "KE",
        "availableLanguage": ["en"]
      },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
