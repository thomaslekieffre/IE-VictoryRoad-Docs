import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { ThemeProvider } from "@/components/theme-provider";
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
  title: "Victory Road FR",
  description: "Guides et outils pour optimiser Inazuma Eleven Victory Road.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
            <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 md:px-10">
              <Navbar />
              <main className="mt-6 flex flex-1 flex-col sm:mt-10">{children}</main>
              <Footer className="mt-10" />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
