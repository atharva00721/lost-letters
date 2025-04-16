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
    <div className="max-w-xl mx-auto px-8 py-10">
      <UserDetailsForm userIp={userIp} />
    </div>
  );
}
