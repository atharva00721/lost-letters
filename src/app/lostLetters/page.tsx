"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPaginatedLetters } from "@/actions/letter";
import LetterCard from "@/components/LetterCard";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Letter } from "@/types/letter";

const LostLettersPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const initialPageFromUrl = Number.parseInt(searchParams.get("page") ?? "1");
  const initialPage =
    Number.isFinite(initialPageFromUrl) && initialPageFromUrl > 0
      ? initialPageFromUrl
      : 1;

  const [letters, setLetters] = useState<Letter[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pageSize = 10;

  const requestIdRef = useRef(0);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Persistent cache using sessionStorage
  const getCacheKey = (searchTerm: string) =>
    `lostLetters_${searchTerm || "default"}`;

  const getCachedData = (searchTerm: string) => {
    try {
      const cached = sessionStorage.getItem(getCacheKey(searchTerm));
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const setCachedData = (
    searchTerm: string,
    data: {
      letters: Letter[];
      page: number;
      hasNextPage: boolean;
    }
  ) => {
    try {
      sessionStorage.setItem(getCacheKey(searchTerm), JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  };

  const clearCache = (searchTerm: string) => {
    try {
      sessionStorage.removeItem(getCacheKey(searchTerm));
    } catch {
      // Ignore storage errors
    }
  };

  // Debounce the search term
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 350);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  // Helper to build and set URL params
  const updateUrl = (nextPage: number, nextQuery: string, replace = false) => {
    const params = new URLSearchParams();
    if (nextQuery) params.set("q", nextQuery);
    if (nextPage > 1) params.set("page", String(nextPage));
    const url = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    if (replace) router.replace(url);
    else router.push(url);
  };

  // Fetch a page of data
  const fetchPage = useCallback(
    async (
      pageToFetch: number,
      term: string,
      { append }: { append: boolean }
    ) => {
      const currentRequestId = ++requestIdRef.current;
      if (!append) {
        setIsSearching(Boolean(term) && pageToFetch === 1);
        setIsInitialLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      try {
        let attempts = 2;
        let result: any = null;

        while (attempts > 0) {
          result = await getPaginatedLetters(
            pageToFetch,
            pageSize,
            term || undefined
          );
          if (result?.success) break;
          attempts--;
          if (attempts === 0) break;
          await new Promise((r) => setTimeout(r, 800));
        }

        // Ignore late responses
        if (currentRequestId !== requestIdRef.current) return;

        if (result?.success && result?.data) {
          if (append) {
            setLetters((prev) => {
              const existingIds = new Set(prev.map((l) => l.id));
              const newLetters = [
                ...prev,
                ...result.data.filter((l: Letter) => !existingIds.has(l.id)),
              ];
              // Update cache
              setCachedData(term, {
                letters: newLetters,
                page: pageToFetch,
                hasNextPage: Boolean(result.pagination?.hasNextPage),
              });
              return newLetters;
            });
          } else {
            setLetters(result.data);
            // Update cache
            setCachedData(term, {
              letters: result.data,
              page: pageToFetch,
              hasNextPage: Boolean(result.pagination?.hasNextPage),
            });
          }
          setHasNextPage(Boolean(result.pagination?.hasNextPage));
        } else {
          if (!append) {
            setLetters([]);
            // Clear cache on error
            clearCache(term);
          }
          setHasNextPage(false);
          console.error("Failed to load letters:", result?.error);
        }
      } catch (error) {
        if (!append) {
          setLetters([]);
          // Clear cache on error
          clearCache(term);
        }
        setHasNextPage(false);
        console.error("Error fetching letters:", error);
      } finally {
        if (!append) {
          setIsInitialLoading(false);
          setIsSearching(false);
        } else {
          setIsFetchingMore(false);
        }
      }
    },
    []
  );

  // Handle search term changes (debounced) and initial load
  useEffect(() => {
    // Check if we have cached data for this search term
    const cached = getCachedData(debouncedSearchTerm);

    if (cached && cached.letters.length > 0) {
      // Restore from cache
      setLetters(cached.letters);
      setPage(cached.page);
      setHasNextPage(cached.hasNextPage);
      setIsInitialLoading(false);
    } else {
      // Fetch new data
      startTransition(() => {
        // Reset to page 1 when search changes
        setPage(1);
        updateUrl(1, debouncedSearchTerm, true);
        fetchPage(1, debouncedSearchTerm, { append: false });
      });
    }
  }, [debouncedSearchTerm]);

  // Load more when page increases (infinite scroll / manual load)
  useEffect(() => {
    if (page === 1) return; // initial handled by mount effect
    startTransition(() => {
      // Don't update URL for infinite scroll - keep it at page 1
      fetchPage(page, debouncedSearchTerm, { append: true });
    });
  }, [page, debouncedSearchTerm]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isFetchingMore) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingMore]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Immediate search commit on Enter
      setDebouncedSearchTerm(searchTerm.trim());
    }
  };

  return (
    <div className="container mt-20 mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
        Lost Letters
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10">
        <div className="relative flex-grow">
          <label htmlFor="search-input" className="sr-only">
            Search letters by name or message
          </label>
          <Input
            id="search-input"
            placeholder="Search by name or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={() => {
                setSearchTerm("");
                // Clearing triggers debounced effect
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground rounded-full flex items-center justify-center"
              aria-label="Clear search"
              type="button"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div id="search-help" className="sr-only">
          Search through letters by the recipient's name or message content
        </div>
        <Button
          onClick={() =>
            startTransition(() => setDebouncedSearchTerm(searchTerm.trim()))
          }
          className="px-6 h-11 font-medium transition-all"
          disabled={isPending}
          type="button"
        >
          {isPending ? "Searching..." : "Search"}
        </Button>
        {(isSearching ||
          (isInitialLoading && letters.length === 0) ||
          isPending) && (
          <div
            aria-live="polite"
            className="flex items-center text-sm text-muted-foreground px-1"
          >
            {isPending ? "Loading..." : "Searching…"}
          </div>
        )}
      </div>

      {isInitialLoading && letters.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="bg-white/70 backdrop-blur-sm border rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-4/6" />
                </div>
                <div className="mt-4 h-px bg-gray-100" />
                <div className="mt-3 h-3 bg-gray-200 rounded w-1/4 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : letters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-xl font-medium mb-2">No letters found</h3>
          <p className="text-muted-foreground max-w-md">
            {searchTerm
              ? `No letters match "${searchTerm}". Try a different search term or clear the search.`
              : "There are no letters available at the moment. Be the first to write one!"}
          </p>
          {searchTerm && (
            <Button
              variant="reverse"
              onClick={() => {
                setSearchTerm("");
                // Clearing triggers debounced effect
              }}
              className="mt-6"
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {letters.map((letter) => (
            <LetterCard key={letter.id} letter={letter} />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel and fallback */}
      <div ref={loadMoreRef} className="h-1" />
      {hasNextPage && (
        <div className="flex justify-center mt-10 sm:mt-12">
          <Button
            variant="neutral"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isFetchingMore}
            className="px-6 h-10"
          >
            {isFetchingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LostLettersPage;
