"use client";

import React, { Suspense } from "react";
import { useLettersData } from "@/hooks/useLettersData";
import {
  SearchBar,
  LoadingStates,
  EmptyState,
  LetterGrid,
  InfiniteScroll,
} from "@/components/lostLetters";
import LetterCountClient from "@/components/LetterCountClient";

const LostLettersContent = () => {
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
    handleRefresh,
  } = useLettersData();

  return (
    <div className="container mt-20 mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif tracking-wide text-center sm:text-left">
          Lost Letters
        </h1>
        <LetterCountClient />
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onRefresh={handleRefresh}
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

const LostLettersPage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mt-20 mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
              Lost Letters
            </h1>
            <LetterCountClient />
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      }
    >
      <LostLettersContent />
    </Suspense>
  );
};

export default LostLettersPage;
