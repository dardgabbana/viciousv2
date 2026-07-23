import Link from "next/link";
import PageBackground from "@/components/PageBackground";

export default function Loading() {
  return (
    <PageBackground className="min-h-screen v-theme-light">
      <div className="pt-20 pb-24 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/blog" className="v-chip">
            BACK
          </Link>
        </div>

        <p className="v-ui-11 v-muted">LOADING</p>
      </div>
    </PageBackground>
  );
}
