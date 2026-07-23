import Image from "next/image";

export default function Loading() {
  return (
    <main className="min-h-screen w-full bg-white text-black flex flex-col px-6 md:px-16 py-10 md:py-14">
      <div className="flex justify-center">
        <Image
          src="/images/logo-black.png"
          alt="Vicious"
          width={200}
          height={71}
          className="h-auto w-[130px] md:w-[170px]"
          priority
        />
      </div>

      <div className="flex flex-1 items-center justify-center py-32">
        <span className="v-ui-11 uppercase tracking-widest text-black/40">Loading</span>
      </div>
    </main>
  );
}
