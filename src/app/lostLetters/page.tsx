import React, { Suspense } from "react";
import { Metadata } from "next";
import LostLettersClient from "./LostLettersClient";

export const metadata: Metadata = {
  title: "Browse Letters",
  description:
    "Discover heartfelt letters from around the world. Read anonymous messages, find inspiration, and connect with stories that touch your heart.",
  openGraph: {
    title: "Browse Letters - Lost Letters",
    description:
      "Discover heartfelt letters from around the world. Read anonymous messages and find inspiration.",
    images: [
      {
        url: "/LostLetters.png",
        width: 1200,
        height: 630,
        alt: "Browse Letters - Lost Letters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Letters - Lost Letters",
    description:
      "Discover heartfelt letters from around the world. Read anonymous messages and find inspiration.",
    images: ["/LostLetters.png"],
  },
  other: {
    "whatsapp:image": "/LostLetters.png",
    "whatsapp:title": "Browse Letters - Lost Letters",
    "whatsapp:description":
      "Discover heartfelt letters from around the world. Read anonymous messages and find inspiration.",
    "discord:image": "/LostLetters.png",
    "discord:title": "Browse Letters - Lost Letters",
    "discord:description":
      "Discover heartfelt letters from around the world. Read anonymous messages and find inspiration.",
    "reddit:image": "/LostLetters.png",
    "reddit:title": "Browse Letters - Lost Letters",
    "reddit:description":
      "Discover heartfelt letters from around the world. Read anonymous messages and find inspiration.",
  },
};

const LostLettersPage = () => {
  return <LostLettersClient />;
};

export default LostLettersPage;
