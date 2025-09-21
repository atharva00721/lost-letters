import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lost Letters - Discover Anonymous Messages",
  description:
    "Browse through a collection of anonymous letters and messages. Find inspiration, comfort, or a new perspective from people around the world.",
  keywords: [
    "anonymous letters",
    "messages",
    "inspiration",
    "community",
    "lost letters",
  ],
  openGraph: {
    title: "Lost Letters - Discover Anonymous Messages",
    description:
      "Browse through a collection of anonymous letters and messages from people around the world.",
    type: "website",
  },
};

export default function LostLettersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
