"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  isPending: boolean;
  isSearching: boolean;
  isInitialLoading: boolean;
  lettersCount: number;
}

export function SearchBar({
  searchTerm,
  onSearchTermChange,
  onSearch,
  onClearSearch,
  isPending,
  isSearching,
  isInitialLoading,
  lettersCount,
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10">
      <div className="relative flex-grow">
        <label htmlFor="search-input" className="sr-only">
          Search letters by name or message
        </label>
        <Input
          id="search-input"
          placeholder="Search by name or message..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={handleKeyPress}
          className="pl-10 pr-4 py-2 h-11 transition-all"
          aria-describedby="search-help"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        {searchTerm && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground rounded-full flex items-center justify-center"
            aria-label="Clear search"
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <div id="search-help" className="sr-only">
        Search through letters by the recipient&apos;s name or message content
      </div>
      <Button
        onClick={onSearch}
        className="px-6 h-11 font-medium transition-all"
        disabled={isPending}
        type="button"
      >
        {isPending && isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          "Search"
        )}
      </Button>
    </div>
  );
}
