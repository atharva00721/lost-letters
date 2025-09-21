import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getPaginatedLetters } from "@/actions/letter";
import { Letter } from "@/types/letter";

interface UseLettersDataOptions {
  pageSize?: number;
}

export function useLettersData({ pageSize = 10 }: UseLettersDataOptions = {}) {
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
    [pageSize]
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
  }, [debouncedSearchTerm, fetchPage]);

  // Load more when page increases (infinite scroll / manual load)
  useEffect(() => {
    if (page === 1) return; // initial handled by mount effect
    startTransition(() => {
      // Don't update URL for infinite scroll - keep it at page 1
      fetchPage(page, debouncedSearchTerm, { append: true });
    });
  }, [page, debouncedSearchTerm, fetchPage]);

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

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    // Always perform search when button is clicked (force fresh search)
    clearCache(trimmedTerm);
    startTransition(() => {
      setDebouncedSearchTerm(trimmedTerm);
      setPage(1);
      updateUrl(1, trimmedTerm, true);
      fetchPage(1, trimmedTerm, { append: false });
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return {
    // State
    letters,
    searchTerm,
    setSearchTerm,
    page,
    hasNextPage,
    isInitialLoading,
    isFetchingMore,
    isSearching,
    isPending,

    // Refs
    loadMoreRef,

    // Actions
    handleSearch,
    handleClearSearch,
    handleLoadMore,
  };
}
