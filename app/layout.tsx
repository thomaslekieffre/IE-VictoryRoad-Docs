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
  description: "Guides, stats et outils pour optimiser ton équipe sur Inazuma Eleven Victory Road. Builds de joueurs, routes de farm, docs techniques et ressources communautaires en français.",
  metadataBase: new URL("https://www.ie-victory-road.fr"),
  openGraph: {
    title: "Victory Road FR",
    description: "Guides, stats et outils pour optimiser ton équipe sur Inazuma Eleven Victory Road. Builds de joueurs, routes de farm, docs techniques et ressources communautaires en français.",
    url: "https://www.ie-victory-road.fr",
    siteName: "Victory Road FR",
    images: [
      {
        url: "https://media.discordapp.net/attachments/1440734138012536882/1443228200829456404/Inazuma-Eleven-Victory-Road-of-Heroes_2022_07-21-22_013.jpg?ex=69284e80&is=6926fd00&hm=0a65074f5da5063a6ae62236eee9be5cd9367133490d1e462f22e0d8e5017601&=&format=webp&width=1589&height=800",
        width: 1589,
        height: 800,
        alt: "Inazuma Eleven Victory Road",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Victory Road FR",
    description: "Guides, stats et outils pour optimiser ton équipe sur Inazuma Eleven Victory Road. Builds de joueurs, routes de farm, docs techniques et ressources communautaires en français.",
    images: [
      "https://media.discordapp.net/attachments/1440734138012536882/1443228200829456404/Inazuma-Eleven-Victory-Road-of-Heroes_2022_07-21-22_013.jpg?ex=69284e80&is=6926fd00&hm=0a65074f5da5063a6ae62236eee9be5cd9367133490d1e462f22e0d8e5017601&=&format=webp&width=1589&height=800",
    ],
  },
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
