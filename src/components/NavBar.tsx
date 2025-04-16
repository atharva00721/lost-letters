"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10 transition-all duration-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and site name */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-md">
            <Image
              src="/logo.png"
              alt="Lost Letters Logo"
              width={36}
              height={36}
              className="rounded-md transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="font-bold text-lg hidden sm:inline text-primary/90 group-hover:text-primary transition-colors">
            Lost Letters
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-2">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link
                  href={link.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative
                    ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:text-foreground hover:bg-accent"
                    }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
                  )}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile menu button */}
        <Button
          variant="reverse"
          size="icon"
          className="md:hidden rounded-full hover:bg-primary/10"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 text-primary" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md transform transition-all duration-300 ease-in-out 
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
              className={`px-4 py-4 bg-background border-2 font-semibold rounded-lg text-lg transition-all duration-200
                ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent"
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
