"use client";

import { MOCK_LETTER } from "@/constants/letter";
import Masonry from "react-masonry-css";
import LetterCard from "./LetterCard";

const MOCK_LETTERS = MOCK_LETTER;

export default function MasonryLetterGrid() {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-6"
        columnClassName="pl-6 bg-clip-padding"
      >
        {MOCK_LETTERS.map((letter) => (
          <div key={letter.id} className="mb-6">
            <LetterCard
              letter={{
                id: String(letter.id),
                name: letter.title,
                message: letter.content,
                ip: "127.0.0.1",
                createdAt: new Date(letter.date),
              }}
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
