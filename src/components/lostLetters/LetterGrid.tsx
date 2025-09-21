import { Letter } from "@/types/letter";
import Link from "next/link";

interface LetterGridProps {
  letters: Letter[];
}

export function LetterGrid({ letters }: LetterGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      {letters.map((letter) => (
        <Link key={letter.id} href={`/lostLetters/${letter.id}`}>
          <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200">
            {/* Envelope SVG */}
            <div className="relative">
              <svg
                width={320}
                height={197}
                viewBox="0 0 547 336"
                fill="none"
                className="drop-shadow-lg"
              >
                {/* Main envelope rectangle */}
                <rect
                  x="3.5"
                  y="3.5"
                  width="539.196"
                  height="328.859"
                  rx="56.5"
                  fill="#F8EAEF"
                  stroke="#E6A9B5"
                  strokeWidth="7"
                />

                {/* Bottom curved line */}
                <path
                  d="M15 314L264.156 134.069C271.206 128.978 280.739 129.026 287.738 134.189L531.5 314"
                  stroke="#E6A9B5"
                  strokeWidth="7"
                />

                {/* Center fill area */}
                <path
                  d="M195 119H351L350 181.06L197.5 182L195 119Z"
                  fill="#F8EAEF"
                />

                {/* Top curved line */}
                <path
                  d="M13 23L226.029 203.603C252.853 226.343 292.179 226.381 319.045 203.691L533 23"
                  stroke="#E6A9B5"
                  strokeWidth="7"
                />

                {/* Letter recipient text */}
                <text
                  x="273"
                  y="120"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#b85a72"
                  fontSize="22"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="500"
                  letterSpacing="1px"
                >
                  {letter.name}
                </text>
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
