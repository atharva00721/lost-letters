"use client";

import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import LetterCard from "./LetterCard";
import { Button } from "@/components/ui/button";
import { getPaginatedLetters } from "@/actions/letter";

type Letter = {
  id: string;
  name: string;
  message: string;
  ip: string;
  createdAt: Date;
};

export default function RecentLetters({ limit = 8 }) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    800: 2,
    500: 1,
  };

  useEffect(() => {
    const loadRecentLetters = async () => {
      setLoading(true);
      try {
        // Get first page with the limit as page size
        const result = await getPaginatedLetters(1, limit);

        if (result.success && result.data) {
          setLetters(result.data);
        } else {
          console.error("Failed to load recent letters:", result?.error);
          setLetters([]);
        }
      } catch (error) {
        console.error("Error loading recent letters:", error);
        setLetters([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentLetters();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-xl font-medium mb-2">No letters yet</h3>
        <p className="text-muted-foreground max-w-md">
          Be the first to write a letter and share your thoughts with the world!
        </p>
        <Button
          onClick={() => (window.location.href = "/writeLetter")}
          className="mt-6"
        >
          Write a Letter
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-6"
        columnClassName="pl-6 bg-clip-padding"
      >
        {letters.map((letter) => (
          <div key={letter.id} className="mb-6">
            <LetterCard letter={letter} />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
