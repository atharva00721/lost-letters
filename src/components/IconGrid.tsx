import Image from "next/image";

interface IconGridProps {
  count?: number;
  size?: number;
  className?: string;
}
1
export default function IconGrid({
  count = 6,
  size = 80,
  className = "",
}: IconGridProps) {
  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 ${className}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-main/5 hover:bg-main/10 transition-colors duration-300 group"
        >
          <Image
            src="/icon.png"
            alt="Lost Letters icon"
            width={size}
            height={size}
            className="rounded-xl group-hover:scale-110 transition-transform duration-300 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
          />
        </div>
      ))}
    </div>
  );
}
