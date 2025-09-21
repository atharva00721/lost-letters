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

  return {
    title: `Letter to ${recipient} - Lost Letters`,
    description: `Read an anonymous letter addressed to ${recipient}. Discover heartfelt messages and connect with the community.`,
    openGraph: {
      title: `Letter to ${recipient} - Lost Letters`,
      description: `Read an anonymous letter addressed to ${recipient}.`,
      type: "article",
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

  return (
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
  );
}
