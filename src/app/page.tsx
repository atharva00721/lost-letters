import NavBar from "@/components/NavBar";
import RecentLetters from "@/components/RecentLetters";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-6">
          <Image
            src="/logo.png"
            alt="Lost Letters Logo"
            width={80}
            height={80}
            priority
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">
            Lost Letters
          </h1>
          <p className="max-w-xl text-lg sm:text-xl text-foreground/80 font-medium">
            Share your thoughts, dreams, and stories with the world. Read
            heartfelt letters from others, or write your own to inspire,
            comfort, or connect.
          </p>
          <Link href="/writeLetter">
            <Button size="lg" className="text-xl px-8 py-6 shadow-xl">
              Write a Letter
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/80 rounded-xl shadow-md p-8 flex flex-col items-center text-center border-2 border-main/10">
          <Image
            src="/icons/icon1.jpg"
            alt="Write"
            width={48}
            height={48}
            className="mb-4 rounded-full"
          />
          <h3 className="text-xl font-bold mb-2 text-main">
            Write Anonymously
          </h3>
          <p className="text-foreground/70">
            Express yourself freely. Your identity is safe—share your story,
            advice, or encouragement with the world.
          </p>
        </div>
        <div className="bg-white/80 rounded-xl shadow-md p-8 flex flex-col items-center text-center border-2 border-main/10">
          <Image
            src="/globe.svg"
            alt="Read"
            width={48}
            height={48}
            className="mb-4"
          />
          <h3 className="text-xl font-bold mb-2 text-main">Read & Connect</h3>
          <p className="text-foreground/70">
            Browse a collection of letters from people everywhere. Find comfort,
            inspiration, or a new perspective.
          </p>
        </div>
        <div className="bg-white/80 rounded-xl shadow-md p-8 flex flex-col items-center text-center border-2 border-main/10">
          <Image
            src="/file.svg"
            alt="Save"
            width={48}
            height={48}
            className="mb-4"
          />
          <h3 className="text-xl font-bold mb-2 text-main">Save & Share</h3>
          <p className="text-foreground/70">
            Bookmark your favorite letters or share them with friends. Spread
            positivity and connection.
          </p>
        </div>
      </section>

      {/* Recent Letters Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-main">
          Recent Letters
        </h2>
        <RecentLetters limit={6} />
        <div className="flex justify-center mt-8">
          <Link href="/lostLetters">
            <Button variant="neutral" size="lg" className="px-8 py-4 text-lg">
              View All Letters
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-foreground/60 text-sm border-t border-main/10 bg-background/80 mt-auto">
        &copy; {new Date().getFullYear()} Lost Letters. Made with{" "}
        <span className="text-main">♥</span>.
      </footer>
    </div>
  );
}
