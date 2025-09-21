import { getLetterById } from "@/actions/letter";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-3xl">
      <Button size="sm" className="mb-6 group" asChild>
        <Link
          href="/lostLetters"
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Letters</span>
        </Link>
      </Button>

      <Card className="bg-white/70 backdrop-blur-sm border-opacity-50 shadow-sm hover:shadow transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Image
              src="/icons/icon1.jpg"
              alt="avatar"
              width={48}
              height={48}
              className="rounded-full border bg-white shadow-sm"
            />
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-2xl font-bold">
                  To: {letter.name}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-6">
          <div className="border-t border-border/40 mb-4 mt-1" />
          <pre className="whitespace-pre-wrap leading-relaxed font-sans text-base sm:text-lg">
            {letter.message}
          </pre>
        </CardContent>

        <CardFooter className="justify-end border-t border-border/40 pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span>Letter ID:</span>
            <code className="bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono text-xs">
              {letter.id.substring(0, 8)}
            </code>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
