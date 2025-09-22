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
  metadataBase: new URL("https://lostletters.arvie.tech"),
  title: {
    default: "Lost Letters - Share Your Stories",
    template: "%s | Lost Letters",
  },
  description:
    "Lost Letters is a platform to share, discover, and save heartfelt letters from around the world. Write anonymous letters, read inspiring messages, and connect through the power of words.",
  keywords: [
    "lost letters",
    "letters",
    "journal",
    "stories",
    "share letters",
    "anonymous letters",
    "heartfelt messages",
    "emotional writing",
    "personal stories",
    "letter writing",
    "digital letters",
    "community stories",
    "inspirational messages",
    "anonymous sharing",
  ],
  authors: [
    { name: "Atharva Raj Singh Thakur", url: "https://www.arvie.tech" },
  ],
  creator: "Atharva Raj Singh Thakur",
  publisher: "Lost Letters",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/favicon_io/favicon.ico",
    apple: [
      {
        url: "/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      { rel: "manifest", url: "/manifest.json" },
      {
        rel: "mask-icon",
        url: "/favicon_io/safari-pinned-tab.svg",
        color: "#10b981",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lostletters.arvie.tech",
    siteName: "Lost Letters",
    title: "Lost Letters - Share Your Stories",
    description:
      "Share, discover, and save heartfelt letters from around the world. Write anonymous letters and connect through the power of words.",
    images: [
      {
        url: "/LostLetters.png",
        width: 1200,
        height: 630,
        alt: "Lost Letters - Share Your Stories",
        type: "image/png",
      },
      {
        url: "/LostLetters.png",
        width: 640,
        height: 640,
        alt: "Lost Letters Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@codepaglu",
    creator: "@codepaglu",
    title: "Lost Letters - Share Your Stories",
    description:
      "Share, discover, and save heartfelt letters from around the world. Write anonymous letters and connect through the power of words.",
    images: ["/LostLetters.png"],
  },
  alternates: {
    canonical: "https://lostletters.arvie.tech",
  },
  category: "lifestyle",
  classification: "Social Platform",
  other: {
    "theme-color": "#10b981",
    "msapplication-TileColor": "#10b981",
    "msapplication-config": "/favicon_io/browserconfig.xml",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Lost Letters",
    "application-name": "Lost Letters",
    "mobile-web-app-capable": "yes",
    "msapplication-tooltip": "Share and discover heartfelt letters",
    "msapplication-starturl": "/",
    "msapplication-tap-highlight": "no",
    // Discord specific
    "discord:image": "/LostLetters.png",
    "discord:title": "Lost Letters - Share Your Stories",
    "discord:description":
      "Share, discover, and save heartfelt letters from around the world.",
    // Reddit specific
    "reddit:image": "/LostLetters.png",
    "reddit:title": "Lost Letters - Share Your Stories",
    "reddit:description":
      "Share, discover, and save heartfelt letters from around the world.",
    // WhatsApp specific
    "whatsapp:image": "/LostLetters.png",
    "whatsapp:title": "Lost Letters - Share Your Stories",
    "whatsapp:description":
      "Share, discover, and save heartfelt letters from around the world.",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lost Letters",
    description:
      "Lost Letters is a platform to share, discover, and save heartfelt letters from around the world. Write anonymous letters, read inspiring messages, and connect through the power of words.",
    url: "https://lostletters.arvie.tech",
    author: {
      "@type": "Person",
      name: "Atharva Raj Singh Thakur",
      url: "https://www.arvie.tech",
    },
    publisher: {
      "@type": "Organization",
      name: "Lost Letters",
      url: "https://lostletters.arvie.tech",
    },
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://lostletters.arvie.tech/lostLetters?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    sameAs: ["https://twitter.com/codepaglu"],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
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
