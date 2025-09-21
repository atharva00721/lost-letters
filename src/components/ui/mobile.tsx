import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LetterCount from "@/components/LetterCount";
// import BackgroundIconGrid from "@/components/BackgroundIconGrid";

export default function LandingPage() {
  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* <BackgroundIconGrid /> */}

      {/* Hero Section */}
      <section className="relative flex pt-30 h-screen flex-col justify-between px-6 py-8 overflow-hidden z-10">
        {/* Top Section - Heading */}
        <div className="flex flex-col items-start justify-start">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif tracking-wide text-left">
            Lost Letters
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-foreground/70 font-medium leading-relaxed text-left max-w-lg">
            Share a little love, one letter at a time. Write anonymously or
            discover sweet notes from others.
          </p>
        </div>

        {/* Middle Section - Cat Image */}
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/cat.png"
            alt="Lost Letters logo"
            width={300}
            height={300}
            priority
            className="rounded-2xl"
          />
        </div>

        {/* Bottom Section - Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-start items-start w-full">
          <div className="flex flex-row gap-3 justify-start items-start w-fit">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full w-fit bg-main/10 text-sm font-medium">
              <span>(˶ᵔ ᵕ ᵔ˶) ♡</span>
            </div>
            <LetterCount />
          </div>
          <div className="flex flex-row gap-3 mb-6 justify-start items-start w-fit">
            <Link href="/writeLetter" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-fit sm:w-auto px-8 py-3 text-lg rounded-full"
              >
                Write a Letter
              </Button>
            </Link>
            <Link href="/lostLetters" className="w-full sm:w-auto">
              <Button
                variant="neutral"
                size="lg"
                className="w-fit sm:w-auto px-8 py-3 text-lg rounded-full"
              >
                Read Letters
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
