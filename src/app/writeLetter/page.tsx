import UserDetailsForm from "@/components/UserDetailsForm";
import { headers } from "next/headers";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Write a Letter",
  description:
    "Share your thoughts, feelings, and stories anonymously. Write a heartfelt letter to someone special or to the world. Your words matter.",
  openGraph: {
    title: "Write a Letter - Lost Letters",
    description:
      "Share your thoughts, feelings, and stories anonymously. Write a heartfelt letter to someone special or to the world.",
    images: [
      {
        url: "/LostLetters.png",
        width: 1200,
        height: 630,
        alt: "Write a Letter - Lost Letters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Write a Letter - Lost Letters",
    description:
      "Share your thoughts, feelings, and stories anonymously. Write a heartfelt letter to someone special or to the world.",
    images: ["/LostLetters.png"],
  },
  other: {
    "whatsapp:image": "/LostLetters.png",
    "whatsapp:title": "Write a Letter - Lost Letters",
    "whatsapp:description":
      "Share your thoughts, feelings, and stories anonymously. Write a heartfelt letter to someone special or to the world.",
    "discord:image": "/LostLetters.png",
    "discord:title": "Write a Letter - Lost Letters",
    "discord:description":
      "Share your thoughts, feelings, and stories anonymously. Write a heartfelt letter to someone special or to the world.",
    "reddit:image": "/LostLetters.png",
    "reddit:title": "Write a Letter - Lost Letters",
    "reddit:description":
      "Share your thoughts, feelings, and stories anonymously. Write a heartfelt letter to someone special or to the world.",
  },
};

export default async function WriteLetterPage() {
  // Get the user's IP address from request headers
  const headersList = await headers();

  // Try different headers to get the real IP address
  // This handles various proxy and cloud provider setups
  const userIp =
    headersList.get("x-real-ip") ||
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("cf-connecting-ip") ||
    "127.0.0.1"; // Fallback to localhost if no IP can be determined

  return (
    <div className="container mt-20 mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-4xl">
      <UserDetailsForm userIp={userIp} />
    </div>
  );
}
