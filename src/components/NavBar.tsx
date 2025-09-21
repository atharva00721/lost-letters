"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Navigation links configuration
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/lostLetters", label: "Lost Letters" },
    { href: "/writeLetter", label: "Create Letter" },
  ];

  // Close menu when navigating or when screen size changes to desktop
  React.useEffect(() => {
    if (isDesktop && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isDesktop, isMenuOpen]);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest("nav") && !target.closest("button")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  // Close menu when navigating
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo and site name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden ">
            <Image
              src="/icon.png"
              alt="Lost Letters Logo"
              width={60}
              height={60}
              className=""
            />
          </div>
          <span className="font-serif tracking-wide text-base sm:text-2xl text-foreground/80 group-hover:text-foreground transition-colors">
            Lost Letters
          </span>
        </Link>

        {/* Desktop Navigation (pill links) */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2
                ${
                  pathname === link.href
                    ? "bg-main text-main-foreground border-border shadow-shadow"
                    : "bg-secondary-background text-foreground/80 hover:text-foreground border-border hover:shadow-shadow"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <Button
          variant="reverse"
          size="icon"
          className="md:hidden rounded-full hover:bg-main/10"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 text-main" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl transform transition-all duration-300 ease-in-out 
          ${
            isMenuOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        style={{ top: "61px" }}
        aria-hidden={!isMenuOpen}
      >
        <nav className="flex flex-col p-6 h-full space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className={`px-4 py-4 bg-secondary-background border-2 font-semibold rounded-2xl text-lg transition-all duration-200
                ${
                  pathname === link.href
                    ? "bg-main/10 text-foreground shadow-sm"
                    : "text-foreground/80 hover:text-foreground hover:bg-main/10"
                }`}
            >
              <div className="flex items-center">
                <span>{link.label}</span>
                {pathname === link.href && (
                  <span className="ml-auto opacity-70">•</span>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
          style={{ top: "61px" }}
        />
      )}
    </header>
  );
}
