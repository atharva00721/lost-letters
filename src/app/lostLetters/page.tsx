"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPaginatedLetters, searchLetters } from "@/actions/letter";
import LetterCard from "@/components/LetterCard";
import { Search, X } from "lucide-react";

// Define the Letter type based on the prisma schema
type Letter = {
  id: string;
  name: string;
  message: string;
  ip: string;
  createdAt: Date;
};

const LostLettersPage = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    loadLetters();
  }, [page]);

  const loadLetters = async () => {
    setLoading(true);

    try {
      // Add a retry mechanism on the client side too
      let attempts = 2;
      let result;

      while (attempts > 0) {
        result = await getPaginatedLetters(page, pageSize);

        if (result.success) {
          break; // Success, exit retry loop
        } else {
          attempts--;
          if (attempts === 0) break; // Last attempt failed

          // Wait before retrying
          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      if (result?.success && result?.data) {
        setLetters(result.data);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        console.error("Failed to load letters:", result?.error);
        setLetters([]);
        // Show an error message to the user
        // The existing empty state UI will show
      }
    } catch (error) {
      console.error("Error in loadLetters:", error);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    if (searchTerm.trim() === "") {
      await loadLetters();
    } else {
      const result = await searchLetters(searchTerm);
      if (result.success && result.data) {
        setLetters(result.data);
        // Reset pagination for search results
        setPage(1);
        setTotalPages(1);
      } else {
        setLetters([]);
      }
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
        Lost Letters
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10">
        <div className="relative flex-grow">
          <Input
            placeholder="Search by receiver's name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            className="pl-10 pr-4 py-2 h-11 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                loadLetters();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground rounded-full flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          className="px-6 h-11 font-medium transition-all"
        >
          Search
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
            <div>Loading letters...</div>
          </div>
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
                loadLetters();
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 sm:gap-3 mt-10 sm:mt-12">
          <Button
            variant="neutral"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 sm:px-5 h-10"
          >
            Previous
          </Button>
          <div className="py-2 px-4 bg-gray-100 rounded-md flex items-center text-sm font-medium">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="neutral"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 sm:px-5 h-10"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default LostLettersPage;
