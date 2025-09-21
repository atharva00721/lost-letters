import Image from "next/image";

export default function BackgroundIconGrid() {
  return (
    <div className="absolute inset-0 opacity-40 pointer-events-none">
      <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-3 p-4 h-full">
        {Array.from({ length: 200 }, (_, index) => (
          <div key={index} className="flex items-center justify-center">
            <Image
              src="/icon.png"
              alt=""
              width={24}
              height={24}
              className={`w-12 h-12 sm:w-8 sm:h-8 md:w-10 md:h-10 transition-transform duration-300 ${
                index % 2 === 0 ? "rotate-45" : "-rotate-45"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
