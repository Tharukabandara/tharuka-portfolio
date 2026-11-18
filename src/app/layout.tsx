import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AmbientBackground } from "@/components/animations/ambient-background";
import { ScrollProgress } from "@/components/animations/scroll-progress";
import { site } from "@/data/site";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Tharuka Bandara",
    "Full-Stack Software Engineer",
    "Software Engineer Sri Lanka",
    "Java Spring Boot Developer",
    "ASP.NET Core Developer",
    "React Next.js Developer",
    "MERN Stack Engineer",
  ],
  authors: [{ name: site.name, url: site.github }],
  openGraph: {
    title: `${site.name} | ${site.role}`,
    description: site.description,
    url: site.url,
    siteName: `${site.name} Portfolio`,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.role}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ScrollProgress />
        <div id="top" className="site-shell relative">
          <AmbientBackground />
          <div className="relative z-10">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
