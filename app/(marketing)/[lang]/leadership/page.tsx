import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import LeadershipProfiles from "@/components/LeadershipProfiles";

export const metadata: Metadata = {
  title: "Leadership | IFFCO Kisan SEZ",
  description:
    "Meet the Board of Directors and leadership team guiding IFFCO Kisan SEZ Limited.",
};

export default function BoardOfDirectors() {
  return (
    <>
      <PageHero
        title="Leadership"
        subtitle="The Board of Directors and leadership guiding IFFCO Kisan SEZ Limited."
      />
      <LeadershipProfiles />
      <CtaBand />
    </>
  );
}
