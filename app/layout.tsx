import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from '@/components/Nav';
import ErrorBoundary from '@/components/ErrorBoundary';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwasthDisha AI — Intelligent Health Report Analysis",
  description: "Upload your medical report and get instant AI-powered insights, personalized diet plans, and adaptive exercise routines.",
  themeColor: "#070B14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${geistSans.className} bg-[#070B14] text-slate-200`} suppressHydrationWarning>
        <ErrorBoundary>
          {children}
          <Nav />
        </ErrorBoundary>
      </body>
    </html>
  );
}
