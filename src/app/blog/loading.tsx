import PageBackground from "@/components/PageBackground";
import BackButton from "@/components/BackButton";

export default function Loading() {
  return (
    <PageBackground className="min-h-screen v-theme-light">
      <BackButton />

      <div className="pt-20 pb-24 px-4 md:px-8 max-w-5xl mx-auto">
        <h1 className="v-title mb-6">Blog</h1>

        <div className="v-panel p-6">
          <p className="v-ui-11 v-muted">LOADING</p>
        </div>
      </div>
    </PageBackground>
  );
}
