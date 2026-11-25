import type { Metadata } from "next";
import LeadershipGroupPage from "@/components/LeadershipGroupPage";

export const metadata: Metadata = {
  title: "Board of Directors | IFFCO Kisan SEZ",
  description: "Meet the Board of Directors of IFFCO Kisan SEZ Limited.",
};

export default function BoardOfDirectorsPage() {
  return <LeadershipGroupPage group="board" title="Board of Directors" subtitle="The Board of Directors of IFFCO Kisan SEZ Limited." />;
}
