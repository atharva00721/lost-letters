import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a letter title to ensure it starts with "Dear"
 * If the title already starts with "To" or "Dear", it leaves it as is
 * If it doesn't start with "To" or "Dear", it adds "Dear" prefix
 * @param title - The original title/name
 * @returns Formatted title with proper greeting
 */
export function formatLetterTitle(title: string): string {
  if (!title) return "Dear Anonymous,";

  const trimmedTitle = title.trim();

  // Check if it already starts with "To" or "Dear" (case insensitive)
  if (
    trimmedTitle.toLowerCase().startsWith("to ") ||
    trimmedTitle.toLowerCase().startsWith("dear ")
  ) {
    // Return as is, just ensure it has a comma
    return trimmedTitle.endsWith(",") ? trimmedTitle : `${trimmedTitle},`;
  }

  // If it doesn't start with "To" or "Dear", add "Dear" prefix
  return `Dear ${trimmedTitle},`;
}
