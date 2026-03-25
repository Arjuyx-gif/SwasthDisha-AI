import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { Nav } from '@/components/Nav';
import ErrorBoundary from '@/components/ErrorBoundary';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SwasthDisha AI — Intelligent Health Report Analysis",
  description: "Upload your medical report and get instant AI-powered health insights, personalized diet plans, and adaptive exercise routines in English & Hindi.",
  keywords: ["health report", "AI medical", "lab report analysis", "Hindi health", "diet plan"],
};

export const viewport: Viewport = {
  themeColor: "#070A0E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${spaceGrotesk.className} bg-[#070A0E] text-[#e4e9ef]`} suppressHydrationWarning>
        <ErrorBoundary>
          {children}
          <Nav />
        </ErrorBoundary>
      </body>
    </html>
  );
}
