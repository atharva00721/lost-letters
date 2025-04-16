"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getPaginatedLetters, searchLetters } from "@/actions/letter";
import LetterCard from "@/components/LetterCard";

// Define the Letter type based on the prisma schema
type Letter = {
  id: string;
  name: string;
  message: string;
  ip: string;
  createdAt: Date;
};

type Props = {};

const LostLettersPage = (props: Props) => {
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
    const result = await getPaginatedLetters(page, pageSize);

    if (result.success && result.data) {
      setLetters(result.data);
      setTotalPages(result.pagination?.totalPages || 1);
    } else {
      setLetters([]);
    }
    setLoading(false);
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
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
      <h1 className="text-4xl font-bold mb-8 text-center sm:text-left">
        Lost Letters
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <Input
          placeholder="Search by receiver's name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-grow"
        />
        <div className="flex gap-2">
          <Button onClick={handleSearch} className="px-6">
            Search
          </Button>
          {searchTerm && (
            <Button
              variant="neutral"
              onClick={() => {
                setSearchTerm("");
                loadLetters();
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-lg text-gray-500">
          <div className="animate-pulse">Loading letters...</div>
        </div>
      ) : letters.length === 0 ? (
        <div className="text-center py-16 text-lg text-gray-500">
          {searchTerm
            ? `No letters found matching "${searchTerm}"`
            : "No letters found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {letters.map((letter) => (
            <LetterCard key={letter.id} letter={letter} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-12 mb-4">
          <Button
            variant="neutral"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-5"
          >
            Previous
          </Button>
          <span className="py-2 px-4 bg-gray-100 rounded-md flex items-center">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="neutral"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-5"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default LostLettersPage;
