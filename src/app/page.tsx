import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LetterCount from "@/components/LetterCount";
import MobileLandingPage from "@/components/ui/mobile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lost Letters - Share Your Stories",
  description:
    "Share a little love, one letter at a time. Write anonymously or discover sweet notes from others. Join our community of heartfelt letter writers.",
  openGraph: {
    title: "Lost Letters - Share Your Stories",
    description:
      "Share a little love, one letter at a time. Write anonymously or discover sweet notes from others.",
    images: [
      {
        url: "/LostLetters.png",
        width: 1200,
        height: 630,
        alt: "Lost Letters - Share Your Stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lost Letters - Share Your Stories",
    description:
      "Share a little love, one letter at a time. Write anonymously or discover sweet notes from others.",
    images: ["/LostLetters.png"],
  },
  other: {
    "whatsapp:image": "/LostLetters.png",
    "whatsapp:title": "Lost Letters - Share Your Stories",
    "whatsapp:description":
      "Share a little love, one letter at a time. Write anonymously or discover sweet notes from others.",
    "discord:image": "/LostLetters.png",
    "discord:title": "Lost Letters - Share Your Stories",
    "discord:description":
      "Share a little love, one letter at a time. Write anonymously or discover sweet notes from others.",
    "reddit:image": "/LostLetters.png",
    "reddit:title": "Lost Letters - Share Your Stories",
    "reddit:description":
      "Share a little love, one letter at a time. Write anonymously or discover sweet notes from others.",
  },
};

export default function LandingPage() {
  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileLandingPage />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen flex-col bg-background relative overflow-hidden">
        {/* <BackgroundIconGrid /> */}

        {/* Hero Section */}
        <section className="relative flex h-screen items-center justify-center px-6 overflow-hidden z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
            {/* Left: Text and CTAs */}
            <div
              className="text-center flex flex-col items-center justify-center
             md:text-left md:items-start md:justify-start"
            >
              <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center items-center md:justify-center w-fit">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full w-fit bg-main/10  text-sm font-medium">
                  <span>(˶ᵔ ᵕ ᵔ˶) ♡</span>
                </div>
                <LetterCount />
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-wide">
                <span className="font-serif ">Lost Letters</span>
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-foreground/70 font-medium leading-relaxed">
                Share a little love, one letter at a time. Write anonymously or
                discover sweet notes from others.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
                <Link href="/writeLetter">
                  <Button size="lg" className="px-8 py-3 text-lg rounded-full">
                    Write a Letter
                  </Button>
                </Link>
                <Link href="/lostLetters">
                  <Button
                    variant="neutral"
                    size="lg"
                    className="px-8 py-3 text-lg rounded-full"
                  >
                    Read Letters
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Logo */}
            <div className="hidden md:flex justify-center md:justify-end">
              <Image
                src="/cat.png"
                alt="Lost Letters logo"
                width={520}
                height={520}
                priority
                className="rounded-2xl -scale-x-100"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        {/* <section className="py-20 px-6 hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-main/10 flex items-center justify-center">
                <Image
                  src="/icons/icon1.jpg"
                  alt="Write"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-2xl font-medium mb-4 text-foreground">
                Write Anonymously
              </h3>
              <p className="text-foreground/60 text-lg leading-relaxed">
                Express yourself freely. Your identity is safe—share your story,
                advice, or encouragement with the world.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-main/10 flex items-center justify-center">
                <Image src="/globe.svg" alt="Read" width={32} height={32} />
              </div>
              <h3 className="text-2xl font-medium mb-4 text-foreground">
                Read & Connect
              </h3>
              <p className="text-foreground/60 text-lg leading-relaxed">
                Browse a collection of letters from people everywhere. Find
                comfort, inspiration, or a new perspective.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-main/10 flex items-center justify-center">
                <Image src="/file.svg" alt="Save" width={32} height={32} />
              </div>
              <h3 className="text-2xl font-medium mb-4 text-foreground">
                Save & Share
              </h3>
              <p className="text-foreground/60 text-lg leading-relaxed">
                Bookmark your favorite letters or share them with friends.
                Spread positivity and connection.
              </p>
            </div>
          </div>
        </div>
      </section> */}

        {/* Footer */}
        {/* <footer className="w-full py-12 text-center text-foreground/50 text-sm mt-auto border-t border-foreground/5">
          <div className="max-w-4xl mx-auto px-6">
            <p className="font-light">
              &copy; {new Date().getFullYear()} Lost Letters. Made with{" "}
              <span className="text-main">♥</span> for connection.
            </p>
          </div>
        </footer> */}
      </div>
    </>
  );
}
