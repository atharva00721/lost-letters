"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
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
  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden select-none">
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
        <div className="relative z-20 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="relative mb-8">
            <div className="absolute -inset-6" />
            <Image
              src="/logo.png"
              alt="Lost Letters Logo"
              width={220}
              height={220}
              className="relative "
              priority
            />
          </div>
          <h1 className="text-7xl sm:text-9xl font-extrabold mb-4 tracking-tight">
            Lost <span className="text-main">Letters</span>
          </h1>
          <p className="text-2xl sm:text-3xl text-main font-semibold mb-3 tracking-wide">
            A home for thoughtful digital messages
          </p>
          <p className="text-2xl sm:text-2xl text-muted-foreground mb-10 max-w-3xl">
            Discover, collect, and share digital letters from around the world.
            A minimal platform for thoughtful messages and timeless stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 mb-16">
            <Button
              onClick={() => redirect("/writeLetter")}
              size="lg"
              className="text-2xl font-bold px-12 py-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <span>Get Started</span>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
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
              onClick={() => redirect("/lostletters")}
              variant="neutral"
              size="lg"
              className="text-2xl font-bold px-12 py-8"
            >
              <span>Learn More</span>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 4v16m0 0l-6-6m6 6l6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
          {/* Floating elements with more variety and animation */}
          <div className="absolute top-1/4 left-[8%] hidden lg:block animate-float">
            <Image
              src="/window.svg"
              alt="Decoration"
              width={56}
              height={56}
              className="opacity-20"
            />
          </div>
          <div className="absolute bottom-1/3 right-[12%] hidden lg:block animate-float-slow">
            <Image
              src="/globe.svg"
              alt="Decoration"
              width={64}
              height={64}
              className="opacity-20"
            />
          </div>
          <div className="absolute top-1/3 right-[7%] hidden lg:block animate-float-reverse">
            <Image
              src="/file.svg"
              alt="Decoration"
              width={40}
              height={40}
              className="opacity-15"
            />
          </div>
          <div className="absolute bottom-1/4 left-[18%] hidden lg:block animate-float-slow-reverse">
            <Image
              src="/window.svg"
              alt="Decoration"
              width={44}
              height={44}
              className="opacity-15"
            />
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-30">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
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
        className="py-16 bg-background border-t border-border"
      >
        <MasonryLetterGrid />
      </section>

      {/* About Section */}
      <section className="py-16 bg-background border-t border-border">
        <div className="relative max-w-3xl mx-auto">
          {/* Decorative blobs behind card */}
          {/* <div className="absolute -top-10 -left-10 w-40 h-40 bg-main/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-border/30 rounded-full blur-2xl" /> */}
          <Card className="relative z-10 bg-white">
            <CardHeader className="items-center text-center space-y-2">
              {/* <Mail className="text-main " size={48} /> */}
              <CardTitle className="text-2xl">About Lost Letters</CardTitle>
              <CardDescription>Where words find a home</CardDescription>
            </CardHeader>
            <CardContent className="px-6 text-center space-y-4 text-muted-foreground">
              <p>
                Lost Letters is a cozy corner of the internet where heartfelt
                messages find their way to the right readers. Whether you write
                to express, remember, or simply connect, every letter carries a
                story.
              </p>
              <p>
                Our mission is to create a welcoming space for empathy,
                inspiration, and the joy of shared experiences. Dive into the
                collection of letters or pen your own to inspire someone today.
              </p>
              <p>
                Join our community and discover the power of words—one letter at
                a time.
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                onClick={() => redirect("/writeLetter")}
                size="lg"
                className="font-bold px-8 py-4"
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Lost Letters. All rights reserved.
      </footer>
    </main>
  );
}
