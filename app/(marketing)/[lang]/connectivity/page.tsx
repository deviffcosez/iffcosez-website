import type { Metadata } from "next";
import ConnectivityLocation from "@/components/ConnectivityLocation";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Connectivity | IFFCO Kisan SEZ",
  description:
    "Road, rail, port and airport connectivity of IFFCO Kisan SEZ, with distances to key cities and the land area of the Industrial Park.",
};

export default function Connectivity() {
  return (
    <>
      <PageHero
        title="Connectivity"
        subtitle="Multimodal access by road, rail, port and air to key industrial centres and markets."
      />
      <section className="section section--alt infrastructure-overview">
        <div className="container">
          <ConnectivityLocation />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
