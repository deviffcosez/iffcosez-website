import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import RegionalDevelopmentSection from "@/components/RegionalDevelopmentSection";

export const metadata: Metadata = {
  title: "Eco Systems | IFFCO Kisan SEZ",
  description:
    "The social and regional ecosystem around IFFCO Kisan SEZ in Nellore: health, education, culture and recreation supporting industries, professionals and their families.",
};

export default function EcoSystems() {
  return (
    <>
      <PageHero
        title="Eco Systems"
        subtitle="The social and regional ecosystem around IKSEZ: health, education, culture and recreation."
      />
      <RegionalDevelopmentSection />
      <CtaBand />
    </>
  );
}
