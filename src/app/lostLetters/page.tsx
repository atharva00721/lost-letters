"use client";

import React from "react";
import { useLettersData } from "@/hooks/useLettersData";
import {
  SearchBar,
  LoadingStates,
  EmptyState,
  LetterGrid,
  InfiniteScroll,
} from "@/components/lostLetters";

const LostLettersPage = () => {
  const {
    // State
    letters,
    searchTerm,
    setSearchTerm,
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
  } = useLettersData();

  return (
    <div className="container mt-20 mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center sm:text-left">
        Lost Letters
      </h1>

      <SearchBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        isPending={isPending}
        isSearching={isSearching}
        isInitialLoading={isInitialLoading}
        lettersCount={letters.length}
      />

      <LoadingStates
        isInitialLoading={isInitialLoading}
        lettersCount={letters.length}
      />

      {!isInitialLoading && letters.length === 0 && (
        <EmptyState searchTerm={searchTerm} onClearSearch={handleClearSearch} />
      )}

      {!isInitialLoading && letters.length > 0 && (
        <>
          <LetterGrid letters={letters} />
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingMore={isFetchingMore}
            onLoadMore={handleLoadMore}
            loadMoreRef={loadMoreRef}
          />
        </>
      )}
    </div>
  );
};

export default LostLettersPage;
