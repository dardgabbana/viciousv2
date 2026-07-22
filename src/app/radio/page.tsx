"use client";

import BackButton from "@/components/BackButton";
import PageTitle from "@/components/PageTitle";
import PageFooter from "@/components/PageFooter";
import PageBackground from "@/components/PageBackground";
import GlowText from "@/components/GlowText";

export default function Radio() {
  return (
    <PageBackground className="flex flex-col items-center justify-center">
      <BackButton />
      <PageTitle className="mb-6">Radio</PageTitle>
      <GlowText size="md">COMING SOON</GlowText>
      <PageFooter />
    </PageBackground>
  );
}
