import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";

import "../styles/globals.css";
import NavigationMenuDemo from "@/components/NavBar";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

/* ---------- metadata ---------- */
export const metadata: Metadata = {
  title: "Lost Letters - Share Your Stories",
  description:
    "Lost Letters is a platform to share, discover, and save heartfelt letters from around the world.",
  keywords: ["lost letters", "letters", "journal", "stories", "share letters"],
  authors: [
    { name: "Atharva Raj Singh Thakur", url: "https://www.arvie.tech" },
  ],
  icons: {
    icon: "/favicon_io/favicon.ico",
    shortcut: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
    other: [{ rel: "manifest", url: "/favicon_io/site.webmanifest" }],
  },
  openGraph: {
    title: "Lost Letters",
    description: "Share and read heartfelt letters on Lost Letters.",
    url: "https://lostletters.arvie.tech",
    siteName: "Lost Letters",
    images: [
      {
        url: "/LostLetters.png",
        width: 640,
        height: 640,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lost Letters",
    description: "Join Lost Letters to share and discover meaningful messages.",
    creator: "@codepaglu",
    images: ["/LostLetters.png"],
  },
};

/* ---------- viewport ---------- */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1.5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} antialiased`}
      >
        <NavigationMenuDemo />
        {/* Added top padding to account for fixed navbar */}
        <main className="min-h-[calc(100vh-60px)]">{children}</main>
      </body>
    </html>
  );
}
