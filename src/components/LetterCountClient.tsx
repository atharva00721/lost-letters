"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getLetterCount } from "@/actions/letter";

interface LetterCountClientProps {
  className?: string;
}

// Cache to store the count and timestamp
let countCache: { count: number; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

export default function LetterCountClient({
  className = "",
}: LetterCountClientProps) {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchCount = async () => {
      // Check if we have a valid cached count
      if (countCache && Date.now() - countCache.timestamp < CACHE_DURATION) {
        setCount(countCache.count);
        setIsLoading(false);
        return;
      }

      // Prevent multiple simultaneous fetches
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const result = await getLetterCount();
        const newCount = result.success ? result.count : 0;

        // Update cache
        countCache = { count: newCount, timestamp: Date.now() };
        setCount(newCount);
      } catch (error) {
        console.error("Failed to fetch letter count:", error);
        setCount(0);
      } finally {
        setIsLoading(false);
        hasFetched.current = false;
      }
    };

    fetchCount();
  }, []);

  if (isLoading) {
    return (
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-full bg-main text-sm font-medium w-fit ${className}`}
      >
        <Image
          src="/icon.png"
          alt="Letter icon"
          width={16}
          height={16}
          className="w-4 h-4"
        />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full bg-[#f8eaef] 
        border-[#e6a9b5] border-2 text-sm font-medium w-fit ${className}`}
    >
      <Image
        src="/icon.png"
        alt="Letter icon"
        width={16}
        height={16}
        className="w-6 h-6"
      />
      <span>{count?.toLocaleString() || 0} letters shared</span>
    </div>
  );
}
