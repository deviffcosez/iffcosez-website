import CtaBand from "@/components/CtaBand";
import LeadershipProfiles from "@/components/LeadershipProfiles";
import PageHero from "@/components/PageHero";
import XSocialCorner from "@/components/XSocialCorner";
import type { LeaderProfileContent } from "@/lib/leaderProfiles";
import type { LeadershipGroup } from "@/lib/leadership";

type LeadershipGroupPageProps = {
  group: LeadershipGroup;
  title: string;
  subtitle: string;
  /** Optional X (Twitter) Social Corner, shown after the profiles. */
  social?: LeaderProfileContent["social"];
};

// One leadership group (chairman / board / management) on its own page. The
// profiles keep their "Read more" expansion from LeadershipProfiles.
export default function LeadershipGroupPage({ group, title, subtitle, social }: LeadershipGroupPageProps) {
  return (
    <>
      <PageHero title={title} subtitle={subtitle} />
      <LeadershipProfiles group={group} hideTitle />
      {social && <XSocialCorner social={social} />}
      <CtaBand />
    </>
  );
}
