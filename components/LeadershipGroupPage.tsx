import CtaBand from "@/components/CtaBand";
import LeadershipProfiles from "@/components/LeadershipProfiles";
import PageHero from "@/components/PageHero";
import type { LeadershipGroup } from "@/lib/leadership";

type LeadershipGroupPageProps = {
  group: LeadershipGroup;
  title: string;
  subtitle: string;
};

// One leadership group (chairman / board / management) on its own page. The
// profiles keep their "Read more" expansion from LeadershipProfiles.
export default function LeadershipGroupPage({ group, title, subtitle }: LeadershipGroupPageProps) {
  return (
    <>
      <PageHero title={title} subtitle={subtitle} />
      <LeadershipProfiles group={group} hideTitle />
      <CtaBand />
    </>
  );
}
