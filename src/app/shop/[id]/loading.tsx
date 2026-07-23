import Image from "next/image";
import PageBackground from "@/components/PageBackground";

export default function Loading() {
  return (
    <PageBackground className="min-h-screen v-theme-light" fixed>
      <header className="sticky top-0 z-40 border-b border-[var(--v-border)] bg-white">
        <div className="relative h-[108px] px-3 md:px-4 flex items-center justify-between">
          <span className="v-chip">BACK</span>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Image
              src="/images/logo-black.png"
              alt="Vicious"
              width={140}
              height={52}
              className="h-auto w-[84px] md:w-[130px]"
              priority
            />
          </div>

          <span />
        </div>
      </header>

      <section className="px-4 py-20 text-center">
        <p className="v-ui-11 v-muted">LOADING</p>
      </section>
    </PageBackground>
  );
}
