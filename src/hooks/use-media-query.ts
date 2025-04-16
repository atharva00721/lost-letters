"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook for responsive design - checks if a media query matches
 * @param query The media query to check (e.g., "(min-width: 768px)")
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with null and update after mounting to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // Create media query list
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Define listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    media.addEventListener("change", listener);

    // Cleanup
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  // Return false during SSR to avoid hydration mismatch
  return mounted ? matches : false;
}
