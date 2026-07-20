import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <Image
        src="/images/logo-white.png"
        alt="Vicious"
        width={300}
        height={113}
        className="animate-pulse"
        priority
      />
    </div>
  );
}
