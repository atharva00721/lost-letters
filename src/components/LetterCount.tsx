import Image from "next/image";
import { getLetterCount } from "@/actions/letter";

interface LetterCountProps {
  className?: string;
}

export default async function LetterCount({
  className = "",
}: LetterCountProps) {
  const result = await getLetterCount();
  const count = result.success ? result.count : 0;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full bg-[#f8eaef] 
        border-[#e6a9b5] border-2 text-sm font-medium w-fit ${className}`}
    >
      <Image
        src="/icon.png"
        alt="Letter icon"
        width={16}
        height={16}
        className="w-4 h-4"
      />
      <span>{count.toLocaleString()} letters shared</span>
    </div>
  );
}
