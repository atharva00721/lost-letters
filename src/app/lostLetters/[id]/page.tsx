import { getLetterById } from "@/actions/letter";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

      <Card className="bg-white/70 backdrop-blur-sm border-opacity-50 shadow-sm hover:shadow transition-shadow relative overflow-hidden">
        {/* Letter paper texture overlay */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-gray-200 via-transparent to-gray-300 pointer-events-none" />

        <CardHeader className="pt-8 px-8 relative">
          {/* Letter greeting */}
          <div className="pb-1">
            <CardTitle className="text-2xl font-serif text-foreground">
              {letter.name},
            </CardTitle>
          </div>
          {/* Date in top-right corner like a traditional letter */}
          <div className="text-left text-sm text-muted-foreground">
            {formattedDate}
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 relative">
          {/* Letter content with proper spacing */}
          <div className="space-y-6">
            <div className="text-base sm:text-lg leading-relaxed font-serif text-foreground whitespace-pre-wrap">
              {letter.message}
            </div>

            {/* Letter signature area */}
            <div className="pt-6">
              <div className="text-right">
                <div className="text-sm text-muted-foreground italic mb-2">
                  Sincerely,
                </div>
                <div className="text-sm text-muted-foreground">Anonymous</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
