import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SK.Shafi Masthan Koushik | Developer & Tech Enthusiast",
  description: "CSE Student & Developer specializing in efficient, scalable software solutions. Passionate about creating impactful technology with modern web technologies.",
  keywords: ["Developer", "CSE Student", "Web Development", "React", "Next.js", "TypeScript", "Full Stack", "Software Engineer"],
  authors: [{ name: "SK.Shafi Masthan Koushik" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "SK.Shafi Masthan Koushik | Developer Portfolio",
    description: "CSE Student & Developer specializing in efficient, scalable software solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SK.Shafi Masthan Koushik | Developer Portfolio",
    description: "CSE Student & Developer specializing in efficient, scalable software solutions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <SpeedInsights />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
