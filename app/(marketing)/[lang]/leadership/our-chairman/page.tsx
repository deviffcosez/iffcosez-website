import type { Metadata } from "next";
import LeadershipGroupPage from "@/components/LeadershipGroupPage";

export const metadata: Metadata = {
  title: "Our Chairman | IFFCO Kisan SEZ",
  description: "Meet the Chairman of IFFCO Kisan SEZ Limited.",
};

export default function OurChairmanPage() {
  return <LeadershipGroupPage group="chairman" title="Our Chairman" subtitle="The Chairman guiding IFFCO Kisan SEZ Limited." />;
}
