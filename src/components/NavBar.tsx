"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function NavigationMenuDemo() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Close menu when navigating on mobile
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Toggle button - always visible */}
      <Button
        variant="reverse"
        size="icon"
        className="fixed right-4 top-4 z-50"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Navigation menu - hidden by default */}
      <NavigationMenu
        className={`fixed right-0 top-0 z-40 flex h-screen flex-col bg-background p-6 shadow-xl border-l border-primary/20 transition-all duration-300 ease-in-out pt-16
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
          w-[280px]`}
      >
        <NavigationMenuList className="flex flex-col space-y-4 w-full">
          <NavigationMenuItem className="w-full">
            <Link
              href="/"
              onClick={handleNavClick}
              className={`${navigationMenuTriggerStyle()} flex w-full justify-center`}
            >
              <div className={`w-full px-4 py-2 rounded-md`}>Home</div>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Link
              href="/lostLetters"
              onClick={handleNavClick}
              className={`${navigationMenuTriggerStyle()} flex w-full justify-center`}
            >
              <div className={`w-full px-4 py-2 rounded-md`}>Lost Letters</div>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="w-full">
            <Link
              href="/writeLetter"
              onClick={handleNavClick}
              className={`${navigationMenuTriggerStyle()} flex w-full justify-center`}
            >
              <div className={`w-full px-4 py-2 rounded-md`}>Create Letter</div>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
