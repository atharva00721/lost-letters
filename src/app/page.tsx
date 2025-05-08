"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import RecentLetters from "@/components/RecentLetters";
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
  const heroRef = useRef<HTMLDivElement>(null);

  // Animation effects when the page loads - simpler approach avoiding TS errors
  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return;

    // Animate elements with CSS classes instead of the motion library
    const elements = heroElement.querySelectorAll('.animate-in');
    elements.forEach((element: Element, index: number) => {
      const el = element as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
    
    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const animateElements = section.querySelectorAll('.animate-on-scroll');
          animateElements.forEach((element: Element, index: number) => {
            const el = element as HTMLElement;
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, index * 100);
          });
          
          // Unobserve after animation is triggered
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.1 });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });

    // Clean up
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="flex flex-col bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-[92vh] px-4 py-8 md:py-12 overflow-hidden"
      >
        {/* Enhanced animated background with cute patterns */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-main/5 via-background/80 to-background z-10" />
          <div className="h-full w-full grid grid-cols-[repeat(24,minmax(0,1fr))] grid-rows-[repeat(24,minmax(0,1fr))] animate-[bg-move_25s_linear_infinite]">
            {Array.from({ length: 24 * 24 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-border/5" />
            ))}
          </div>
          
          {/* Cute decorative elements */}
          <div className="absolute top-20 left-[10%] w-8 h-8 bg-main/5 rounded-full animate-float"></div>
          <div className="absolute top-[15%] right-[15%] w-12 h-12 bg-main/10 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-[20%] left-[20%] w-6 h-6 bg-main/5 rounded-full animate-float-reverse"></div>
          <div className="absolute bottom-[30%] right-[25%] w-10 h-10 bg-main/10 rounded-full animate-float-slow-reverse"></div>
          
          {/* Little envelope icons floating around */}
          <div className="absolute top-[30%] left-[18%] animate-float hidden md:block">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-main/20">
              <path d="M22 8L12 13L2 8V19H22V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 5H2V19H22V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13L2 8L12 3L22 8L12 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="absolute top-[10%] right-[28%] animate-float-slow hidden md:block">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-main/15">
              <path d="M22 8L12 13L2 8V19H22V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 5H2V19H22V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13L2 8L12 3L22 8L12 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="absolute bottom-[25%] left-[28%] animate-float-reverse hidden md:block">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-main/20">
              <path d="M22 8L12 13L2 8V19H22V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 5H2V19H22V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13L2 8L12 3L22 8L12 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Hero content with improved cute animations */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-5xl mx-auto px-4">
          {/* Logo with animation and cute glow effect */}
          <div className="relative mb-6 sm:mb-8 animate-in opacity-0" style={{ transitionDelay: '0ms' }}>
            <div className="absolute -inset-6 rounded-full bg-main/10 blur-xl animate-pulse-slow"></div>
            <div className="relative p-3 bg-white/30 backdrop-blur-sm rounded-xl shadow-sm">
              <Image
                src="/logo.png"
                alt="Lost Letters Logo"
                width={180}
                height={180}
                className="relative max-w-[130px] sm:max-w-[180px] drop-shadow-md transition-all duration-700 hover:scale-105"
                priority
              />
              <div className="absolute -bottom-2 -right-2 bg-main/10 w-6 h-6 rounded-full animate-ping opacity-70"></div>
              <div className="absolute -top-2 -left-2 bg-main/10 w-4 h-4 rounded-full animate-ping opacity-40 delay-300"></div>
            </div>
          </div>
          
          {/* Headline with refined typography and cute underline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold mb-3 sm:mb-4 tracking-tight leading-tight animate-in opacity-0" style={{ transitionDelay: '100ms' }}>
            Lost <span className="text-main relative inline-block">
              Letters
              <span className="absolute -bottom-1 left-0 w-full h-[4px] bg-main/30 rounded-full"></span>
              <span className="absolute -bottom-1 left-0 w-5 h-[4px] bg-main/60 rounded-full animate-[letter-slide_3s_ease-in-out_infinite]"></span>
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-main font-semibold mb-3 tracking-wide animate-in opacity-0" style={{ transitionDelay: '200ms' }}>
            A home for thoughtful digital messages ✉️
          </p>
          
          <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl animate-in opacity-0" style={{ transitionDelay: '300ms' }}>
            Discover, collect, and share digital letters from around the world.
            A minimal platform for thoughtful messages and timeless stories.
          </p>
          
          {/* CTA buttons with enhanced styling and cute hover effects */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md mx-auto animate-in opacity-0" style={{ transitionDelay: '400ms' }}>
            <Button
              onClick={() => router.push("/writeLetter")}
              size="lg"
              className="text-base sm:text-lg font-bold px-6 py-6 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex-1 bg-main hover:bg-main/90 group relative overflow-hidden"
            >
              <span className="relative z-10 mr-2">Write a Letter</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" 
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                <path
                  d="M4 12h16m0 0l-6-6m6 6l-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute inset-0 bg-white/20 w-12 h-full translate-x-[-100%] skew-x-[-10deg] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
            </Button>
            <Button
              onClick={() => router.push("/lostLetters")}
              variant="neutral"
              size="lg"
              className="text-base sm:text-lg font-bold px-6 py-6 flex-1 hover:bg-background/80 hover:translate-y-[-2px] transition-all"
            >
              <span>Explore Letters</span>
            </Button>
          </div>

          {/* Floating envelope elements with improved visibility and animations */}
          <div className="absolute top-1/4 left-[10%] hidden md:block animate-float">
            <div className="relative">
              <Image
                src="/window.svg"
                alt="Window decoration"
                width={60}
                height={60}
                className="opacity-20 hover:opacity-40 transition-opacity duration-500"
              />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-main/30 rounded-full"></div>
            </div>
          </div>
          <div className="absolute bottom-1/3 right-[12%] hidden md:block animate-float-slow">
            <div className="relative">
              <Image
                src="/globe.svg"
                alt="Globe decoration"
                width={68}
                height={68}
                className="opacity-20 hover:opacity-40 transition-opacity duration-500"
              />
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-main/30 rounded-full"></div>
            </div>
          </div>
          <div className="absolute top-1/3 right-[8%] hidden md:block animate-float-reverse">
            <div className="relative">
              <Image
                src="/file.svg"
                alt="File decoration"
                width={46}
                height={46}
                className="opacity-15 hover:opacity-30 transition-opacity duration-500"
              />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-main/30 rounded-full"></div>
            </div>
          </div>
          <div className="absolute bottom-1/4 left-[15%] hidden md:block animate-float-slow-reverse">
            <div className="relative">
              <Image
                src="/window.svg"
                alt="Window decoration"
                width={50}
                height={50}
                className="opacity-15 hover:opacity-30 transition-opacity duration-500"
              />
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-main/30 rounded-full"></div>
            </div>
          </div>
          
          {/* Additional cute decorative elements */}
          <div className="absolute top-1/2 left-[30%] hidden lg:block animate-float-slow">
            <div className="w-8 h-8 rounded-full bg-main/10 backdrop-blur-md flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-main/15"></div>
            </div>
          </div>
          <div className="absolute bottom-1/3 left-[70%] hidden lg:block animate-float-reverse">
            <div className="w-5 h-5 rounded-full bg-main/15 backdrop-blur-md"></div>
          </div>
        </div>

        {/* Improved cute scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-30 cursor-pointer group"
             onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">Peek below</span>
            <div className="relative bg-white/50 p-2 rounded-full shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:bg-white/70">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-main/70 transition-colors group-hover:text-main">
                <path
                  d="M12 5v14m0 0l-5-5m5 5l5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (Moved up to explain concept first) */}
      <section 
        id="how-it-works"
        className="py-16 sm:py-24 bg-background/50 border-t border-border"
      >
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center mb-12 animate-on-scroll opacity-0">
            <span className="px-4 py-2 rounded-full bg-main/10 text-main text-sm font-medium mb-4">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">
              How It Works
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl">
              Sharing your thoughts with the world is easy with Lost Letters
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <Card className="border-2 border-border/40 bg-white/70 backdrop-blur-sm animate-on-scroll opacity-0">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 rounded-full bg-main/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-main font-bold text-xl">1</span>
                </div>
                <CardTitle>Write Your Letter</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Craft a heartfelt message to someone or something that matters to you. Express yourself freely.
              </CardContent>
            </Card>
            
            {/* Step 2 */}
            <Card className="border-2 border-border/40 bg-white/70 backdrop-blur-sm animate-on-scroll opacity-0">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 rounded-full bg-main/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-main font-bold text-xl">2</span>
                </div>
                <CardTitle>Share Anonymously</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Your letter becomes part of our collection, accessible to readers around the world.
              </CardContent>
            </Card>
            
            {/* Step 3 */}
            <Card className="border-2 border-border/40 bg-white/70 backdrop-blur-sm animate-on-scroll opacity-0">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 rounded-full bg-main/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-main font-bold text-xl">3</span>
                </div>
                <CardTitle>Connect Through Words</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Discover letters from others that resonate with you. Find comfort, inspiration, or joy in shared experiences.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Letters Section (Using real data) */}
      <section
        id="recent-letters"
        className="py-16 sm:py-24 bg-background border-t border-border"
      >
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center mb-12 animate-on-scroll opacity-0">
            <span className="px-4 py-2 rounded-full bg-main/10 text-main text-sm font-medium mb-4">Latest Submissions</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">
              Recent Letters
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl">
              Explore the latest letters shared by our community. Each one tells a unique story.
            </p>
          </div>
          
          <div className="animate-on-scroll opacity-0">
            <RecentLetters limit={8} />
            
            <div className="mt-10 text-center">
              <Button 
                onClick={() => router.push("/lostLetters")}
                className="px-8 py-6"
              >
                View All Letters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-24 bg-background/50 border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-main/10 to-main/5 blur-xl animate-pulse"></div>
            <Card className="relative z-10 bg-white shadow-sm border-2 border-border/40 animate-on-scroll opacity-0">
              <CardHeader className="items-center text-center space-y-2">
                <span className="w-16 h-1 bg-main/40 rounded-full mb-2"></span>
                <CardTitle className="text-2xl sm:text-3xl">
                  About Lost Letters
                </CardTitle>
                <CardDescription>Where words find a home</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-8 text-center space-y-4 text-muted-foreground">
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
                  className="font-bold px-6 py-3 sm:px-8 sm:py-4 group"
                >
                  <span className="mr-2">Get Started</span>
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-background border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center mb-12 animate-on-scroll opacity-0">
            <span className="px-4 py-2 rounded-full bg-main/10 text-main text-sm font-medium mb-4">What People Say</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">
              Community Voices
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl">
              Stories from those who found connection through Lost Letters
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Testimonial 1 */}
            <Card className="border-2 border-border/40 bg-white/70 backdrop-blur-sm animate-on-scroll opacity-0">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-main/20 flex items-center justify-center mr-3">
                    <span className="text-main font-bold">S</span>
                  </div>
                  <div>
                    <p className="font-medium">Sarah W.</p>
                    <p className="text-sm text-muted-foreground">Letter Writer</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Writing letters here has been therapeutic. I've found a place where I can express my thoughts freely and connect with others who understand."
                </p>
              </CardContent>
            </Card>
            
            {/* Testimonial 2 */}
            <Card className="border-2 border-border/40 bg-white/70 backdrop-blur-sm animate-on-scroll opacity-0">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-main/20 flex items-center justify-center mr-3">
                    <span className="text-main font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-medium">Michael T.</p>
                    <p className="text-sm text-muted-foreground">Regular Reader</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "I visit Lost Letters whenever I need inspiration or to remember the beauty of human connection. Every letter tells a unique story."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action Section */}
      <section className="py-16 sm:py-24 bg-main/5 border-t border-border">
        <div className="container px-4 mx-auto text-center max-w-3xl animate-on-scroll opacity-0">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Share Your Story?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of others who have found meaning in writing and sharing letters. Your words matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/writeLetter")}
              size="lg"
              className="text-base sm:text-lg px-8 py-6 group"
            >
              <span className="mr-2">Write a Letter</span>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" 
                className="transition-transform duration-300 group-hover:translate-x-1">
                <path
                  d="M21 12L9 4v16l12-8z"
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
              className="text-base sm:text-lg px-8 py-6"
            >
              Browse Letters
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-10 sm:py-12 border-t border-border bg-background/90">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Lost Letters Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="font-semibold text-lg">Lost Letters</span>
            </div>
            <div className="flex gap-6">
              <Button variant="neutral" size="sm" onClick={() => router.push("/")}>Home</Button>
              <Button variant="neutral" size="sm" onClick={() => router.push("/lostLetters")}>Letters</Button>
              <Button variant="neutral" size="sm" onClick={() => router.push("/writeLetter")}>Write</Button>
            </div>
          </div>
          <div className="text-center pt-4 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Lost Letters. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
