"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { animate, spring } from "motion";

// Define the Letter type based on the prisma schema
type Letter = {
  id: string;
  name: string;
  message: string;
  ip: string;
  createdAt: Date;
};

export interface LetterCardProps {
  letter: Letter;
}

export default function LetterCard({ letter }: LetterCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Format date
  const formattedDate = new Date(letter.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Truncate content
  const [expanded, setExpanded] = useState(false);
  const maxLength = 220;
  const isLong = letter.message.length > maxLength;
  const displayContent =
    expanded || !isLong
      ? letter.message
      : letter.message.slice(0, maxLength) + "...";

  useEffect(() => {
    const el = cardRef.current;
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
      animate(
        el,
        { opacity: 1, y: 0 },
        { type: spring, stiffness: 200, damping: 20 }
      );
    }
  }, []);

  return (
    <Link href={`/lostLetters/${letter.id}`}>
      <div ref={cardRef} className="w-full">
        <Card
          className="bg-white/70 backdrop-blur-sm border-opacity-50"
          onMouseEnter={() => {
            const el = cardRef.current;
            if (el)
              animate(
                el,
                { scale: 1.02 },
                { type: spring, stiffness: 150, damping: 18 }
              );
          }}
          onMouseLeave={() => {
            const el = cardRef.current;
            if (el)
              animate(
                el,
                { scale: 1 },
                { type: spring, stiffness: 150, damping: 18 }
              );
          }}
        >
          <CardHeader className="flex flex-row items-center gap-4 pb-3">
            <Image
              src="/icons/icon1.jpg"
              alt="avatar"
              width={40}
              height={40}
              className="rounded-full border bg-white shadow-sm"
            />
            <div className="flex-1">
              <CardTitle className="text-lg">To: {letter.name}</CardTitle>
              <CardDescription className="text-sm opacity-80">
                {formattedDate}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <div className="bg-gray-50/70 rounded-md p-4 mb-2">
              <pre className="whitespace-pre-wrap font-base text-foreground text-base bg-transparent p-0 m-0 border-0 shadow-none leading-relaxed">
                {displayContent}
              </pre>
            </div>
            {isLong && (
              <Button
                variant="neutral"
                size="sm"
                className="mt-3"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Show less" : "Read more"}
              </Button>
            )}
          </CardContent>
          <CardFooter className="justify-end text-xs text-muted-foreground py-3 border-t border-gray-100">
            #{letter.id.substring(0, 8)}
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
}
