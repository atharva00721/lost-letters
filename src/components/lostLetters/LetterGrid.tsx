import LetterCard from "@/components/LetterCard";
import { Letter } from "@/types/letter";

interface LetterGridProps {
  letters: Letter[];
}

export function LetterGrid({ letters }: LetterGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {letters.map((letter) => (
        <LetterCard key={letter.id} letter={letter} />
      ))}
    </div>
  );
}
