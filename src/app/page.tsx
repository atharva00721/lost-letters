"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MasonryLetterGrid from "@/components/LetterCardDemo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 py-12 md:py-20 overflow-hidden">
        {/* Grid background with subtle animation */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-main/10 via-background/70 to-background z-10" />
          <div className="h-full w-full grid grid-cols-[repeat(24,minmax(0,1fr))] grid-rows-[repeat(24,minmax(0,1fr))] animate-[bg-move_16s_linear_infinite]">
            {Array.from({ length: 24 * 24 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-border/10" />
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-5xl mx-auto px-4">
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute -inset-6" />
            <Image
              src="/logo.png"
              alt="Lost Letters Logo"
              width={180}
              height={180}
              className="relative max-w-[120px] sm:max-w-full"
              priority
            />
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold mb-3 sm:mb-4 tracking-tight leading-tight">
            Lost <span className="text-main">Letters</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-main font-semibold mb-3 tracking-wide">
            A home for thoughtful digital messages
          </p>
          <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl">
            Discover, collect, and share digital letters from around the world.
            A minimal platform for thoughtful messages and timeless stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md mx-auto">
            <Button
              onClick={() => router.push("/writeLetter")}
              size="lg"
              className="text-base sm:text-lg font-bold px-6 py-6 shadow-lg hover:shadow-xl transition-all flex-1"
            >
              <span className="mr-2">Get Started</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M4 12h16m0 0l-6-6m6 6l-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
            <Button
              onClick={() => router.push("/lostLetters")}
              variant="neutral"
              size="lg"
              className="text-base sm:text-lg font-bold px-6 py-6 flex-1"
            >
              <span>Lost Letters</span>
            </Button>
          </div>

          {/* Floating elements with more variety and animation */}
          <div className="absolute top-1/4 left-[10%] hidden md:block animate-float">
            <Image
              src="/window.svg"
              alt="Decoration"
              width={50}
              height={50}
              className="opacity-20"
            />
          </div>
          <div className="absolute bottom-1/3 right-[12%] hidden md:block animate-float-slow">
            <Image
              src="/globe.svg"
              alt="Decoration"
              width={58}
              height={58}
              className="opacity-20"
            />
          </div>
          <div className="absolute top-1/3 right-[8%] hidden md:block animate-float-reverse">
            <Image
              src="/file.svg"
              alt="Decoration"
              width={36}
              height={36}
              className="opacity-15"
            />
          </div>
          <div className="absolute bottom-1/4 left-[15%] hidden md:block animate-float-slow-reverse">
            <Image
              src="/window.svg"
              alt="Decoration"
              width={40}
              height={40}
              className="opacity-15"
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-30">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 5v14m0 0l-5-5m5 5l5-5"
              stroke="#888"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 sm:py-16 bg-background border-t border-border"
      >
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Featured Letters
          </h2>
          <MasonryLetterGrid />
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 bg-background border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="relative max-w-3xl mx-auto">
            <Card className="relative z-10 bg-white shadow-sm">
              <CardHeader className="items-center text-center space-y-2">
                <CardTitle className="text-2xl sm:text-3xl">
                  About Lost Letters
                </CardTitle>
                <CardDescription>Where words find a home</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 text-center space-y-4 text-muted-foreground">
                <p>
                  Lost Letters is a cozy corner of the internet where heartfelt
                  messages find their way to the right readers. Whether you
                  write to express, remember, or simply connect, every letter
                  carries a story.
                </p>
                <p>
                  Our mission is to create a welcoming space for empathy,
                  inspiration, and the joy of shared experiences. Dive into the
                  collection of letters or pen your own to inspire someone
                  today.
                </p>
                <p>
                  Join our community and discover the power of words—one letter
                  at a time.
                </p>
              </CardContent>
              <CardFooter className="justify-center py-6">
                <Button
                  onClick={() => router.push("/writeLetter")}
                  size="lg"
                  className="font-bold px-6 py-3 sm:px-8 sm:py-4"
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-border">
        <div className="container px-4 mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lost Letters. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
