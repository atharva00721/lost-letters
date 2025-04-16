import { getLetterById } from "@/actions/letter";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Params {
  id: string;
}

export default async function LetterDetailPage({ params }: { params: Params }) {
  const { id } = params;
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
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl">
      <Button variant="reverse" className="mb-6" asChild>
        <Link href="/lostLetters">← Back to Letters</Link>
      </Button>
      <Card className="bg-white/70 backdrop-blur-sm border-opacity-50">
        <CardHeader>
          <CardTitle>To: {letter.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </CardHeader>
        <CardContent className="pt-2 pb-4">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {letter.message}
          </pre>
        </CardContent>
        <CardFooter className="justify-end text-xs text-muted-foreground">
          #{letter.id.substring(0, 8)}
        </CardFooter>
      </Card>
    </div>
  );
}
