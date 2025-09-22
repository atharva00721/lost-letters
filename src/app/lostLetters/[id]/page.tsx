import { getLetterById } from "@/actions/letter";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatLetterTitle } from "@/lib/utils";

import { Metadata } from "next";

interface Params {
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getLetterById(id);

  if (!result.success || !result.data) {
    return {
      title: "Letter Not Found - Lost Letters",
      description: "The requested letter could not be found.",
    };
  }

  const letter = result.data;
  const recipient = letter.name;

  const letterPreview =
    letter.message.length > 150
      ? letter.message.substring(0, 150) + "..."
      : letter.message;

  return {
    title: `Letter to ${recipient} - Lost Letters`,
    description: `Read an anonymous letter addressed to ${recipient}. ${letterPreview} Discover heartfelt messages and connect with the community.`,
    keywords: [
      `letter to ${recipient}`,
      "anonymous letter",
      "heartfelt message",
      "personal letter",
      "emotional writing",
      "lost letters",
      "community stories",
    ],
    openGraph: {
      title: `Letter to ${recipient} - Lost Letters`,
      description: `Read an anonymous letter addressed to ${recipient}. ${letterPreview}`,
      type: "article",
      url: `https://lostletters.arvie.tech/lostLetters/${id}`,
      siteName: "Lost Letters",
      publishedTime: letter.createdAt.toISOString(),
      images: [
        {
          url: `/api/og/${id}`,
          width: 1200,
          height: 630,
          alt: `Letter to ${recipient} - Lost Letters`,
          type: "image/png",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `Letter to ${recipient} - Lost Letters`,
      description: `Read an anonymous letter addressed to ${recipient}. ${letterPreview}`,
      images: [
        {
          url: `/api/og/${id}`,
          alt: `Letter to ${recipient} - Lost Letters`,
        },
      ],
      creator: "@codepaglu",
      site: "@codepaglu",
    },
    alternates: {
      canonical: `https://lostletters.arvie.tech/lostLetters/${id}`,
    },
    other: {
      // Twitter specific meta tags
      "twitter:card": "summary_large_image",
      "twitter:title": `Letter to ${recipient} - Lost Letters`,
      "twitter:description": `Read an anonymous letter addressed to ${recipient}. ${letterPreview}`,
      "twitter:image": `/api/og/${id}`,
      "twitter:image:alt": `Letter to ${recipient} - Lost Letters`,
      "twitter:creator": "@codepaglu",
      "twitter:site": "@codepaglu",
      // WhatsApp specific
      "whatsapp:image": `/api/og/whatsapp/${id}`,
      "whatsapp:title": `Letter to ${recipient} - Lost Letters`,
      "whatsapp:description": `Read an anonymous letter addressed to ${recipient}. ${letterPreview}`,
      // Discord specific
      "discord:image": `/api/og/${id}`,
      "discord:title": `Letter to ${recipient} - Lost Letters`,
      "discord:description": `Read an anonymous letter addressed to ${recipient}. ${letterPreview}`,
      // Reddit specific
      "reddit:image": `/api/og/${id}`,
      "reddit:title": `Letter to ${recipient} - Lost Letters`,
      "reddit:description": `Read an anonymous letter addressed to ${recipient}. ${letterPreview}`,
      // Article specific
      "article:author": "Anonymous",
      "article:section": "Letters",
      "article:tag": recipient,
    },
  };
}

export default async function LetterDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const result = await getLetterById(id);
  if (!result.success || !result.data) {
    notFound();
  }
  const letter = result.data;
  const formattedDate = new Date(letter.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Letter to ${letter.name}`,
    description: `An anonymous letter addressed to ${letter.name}`,
    author: {
      "@type": "Person",
      name: "Anonymous",
    },
    publisher: {
      "@type": "Organization",
      name: "Lost Letters",
      url: "https://lostletters.arvie.tech",
      logo: {
        "@type": "ImageObject",
        url: "https://lostletters.arvie.tech/LostLetters.png",
      },
    },
    datePublished: letter.createdAt.toISOString(),
    dateModified: letter.createdAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://lostletters.arvie.tech/lostLetters/${id}`,
    },
    image: {
      "@type": "ImageObject",
      url: `https://lostletters.arvie.tech/api/og/${id}`,
      width: 1200,
      height: 630,
    },
    articleSection: "Letters",
    keywords: [
      `letter to ${letter.name}`,
      "anonymous letter",
      "heartfelt message",
      "personal letter",
      "emotional writing",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="container mt-20 mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-3xl">
        <Button size="sm" className="mb-6 group" asChild>
          <Link
            href="/lostLetters"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Letters</span>
          </Link>
        </Button>

        <Card className="bg-white/80 backdrop-blur-sm border-opacity-60 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden max-w-3xl mx-auto">
          {/* Letter paper texture overlay */}
          <div className="absolute inset-0 opacity-8 bg-gradient-to-br from-gray-100 via-transparent to-gray-200 pointer-events-none" />

          {/* Subtle border styling */}
          <div className="absolute inset-0 border-2 border-gray-300/30 rounded-lg pointer-events-none" />

          <CardHeader className="pt-12 px-12 relative">
            {/* Letter greeting - larger, italic title */}
            <div className="pb-1">
              <CardTitle className="text-3xl letter-title text-foreground leading-tight">
                {formatLetterTitle(letter.name)}
              </CardTitle>
            </div>
            {/* Date - bold, positioned like traditional letter */}
            <div className="text-left text-base letter-date text-foreground">
              {formattedDate}
            </div>
          </CardHeader>

          <CardContent className="px-12 pb-12 relative">
            {/* Letter content with proper spacing */}
            <div className="space-y-8">
              <div className="text-3xl sm:text-4xl letter-body text-foreground whitespace-pre-wrap">
                {letter.message}
              </div>

              {/* Letter signature area - right aligned */}
              <div className="pt-8">
                <div className="text-right -space-y-1">
                  <div className="text-lg letter-signature text-foreground">
                    Sincerely,
                  </div>
                  <div className="text-base font-normal text-foreground">
                    Anonymous
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
