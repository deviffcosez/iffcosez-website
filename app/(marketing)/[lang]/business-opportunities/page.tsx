import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import PanelShowcase from "@/components/PanelShowcase";

export const metadata: Metadata = {
  title: "Business Opportunities | IFFCO Kisan SEZ",
  description:
    "Business opportunities at IFFCO Kisan SEZ: a strategic location in Nellore, world-class infrastructure, an agro and food processing hub, and plug-and-play industrial development for MSME and large-scale industries.",
};

export default function BusinessOpportunities() {
  return (
    <>
      <PageHero
        title="Business Opportunities"
        subtitle="Set up and grow at a strategic industrial destination backed by IFFCO's cooperative legacy."
      />
      <PanelShowcase />
      <CtaBand showOpportunities={false} />
    </>
  );
}
