import UserDetailsForm from "@/components/UserDetailsForm";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

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
