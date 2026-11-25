import type { Metadata } from "next";
import LeadershipGroupPage from "@/components/LeadershipGroupPage";

export const metadata: Metadata = {
  title: "Management Team | IFFCO Kisan SEZ",
  description: "Meet the management team of IFFCO Kisan SEZ Limited.",
};

export default function ManagementTeamPage() {
  return <LeadershipGroupPage group="management" title="Management Team" subtitle="The management team of IFFCO Kisan SEZ Limited." />;
}
