import ElfsightWidget from "@/components/ElfsightWidget";
import XPosts from "@/components/XPosts";
import type { LeaderProfileContent } from "@/lib/leaderProfiles";
import { formatXCount, getXProfileStats } from "@/lib/xProfile";

const X_ICON = "M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.9 2h6.4l4.4 5.9L18.9 2Zm-1.1 18.1h1.7L7.3 3.8H5.5l12.3 16.3Z";

/* eslint-disable @next/next/no-img-element */

// "Social Corner": an X (formerly Twitter) profile card with live Posts /
// Following / Followers counts (lib/xProfile.ts) and X's official post embeds.
// Shared by the leader profile pages and the /leadership/our-chairman/ page.
// Setting social.elfsightWidgetId swaps in a self-updating Elfsight feed
// instead (that widget also needs its host allowed in the CSP in vercel.json).
export default async function XSocialCorner({ social }: { social: LeaderProfileContent["social"] }) {
  const stats = social.elfsightWidgetId ? null : await getXProfileStats(social.handle);
  return (
    <section className="leader-social">
      <div className="container">
        <h2 className="leader-social__title">Social Corner</h2>
        {social.elfsightWidgetId ? (
          <ElfsightWidget id={social.elfsightWidgetId} />
        ) : (
          <div className="x-profile">
            <img className="x-profile__banner" src={social.banner} alt="" loading="lazy" />
            <div className="x-profile__head">
              <img className="x-profile__avatar" src={social.avatar} alt="" loading="lazy" />
              <div className="x-profile__who">
                <strong>
                  {social.displayName}
                  <svg className="x-profile__verified" viewBox="0 0 22 22" aria-label="Verified account" role="img">
                    <path d="M20.4 11c0-1.3-.8-2.5-1.9-3 .4-1.2.2-2.6-.7-3.5-.9-.9-2.3-1.2-3.5-.7-.5-1.2-1.7-2-3-2s-2.5.8-3 1.9c-1.2-.4-2.6-.2-3.5.7-.9.9-1.2 2.3-.7 3.5-1.2.5-2 1.7-2 3s.8 2.5 1.9 3c-.4 1.2-.2 2.6.7 3.5.9.9 2.3 1.2 3.5.8.5 1.1 1.7 1.9 3 1.9s2.5-.8 3-1.9c1.2.4 2.6.1 3.5-.8.9-.9 1.2-2.3.8-3.5 1.1-.5 1.9-1.7 1.9-3Z" />
                    <path d="m9.6 14.9-3.4-3.4 1.3-1.3 2.1 2.1 4.8-5.3 1.4 1.3z" fill="#fff" />
                  </svg>
                </strong>
                <span>@{social.handle}</span>
              </div>
              <a className="x-profile__follow" href={`https://x.com/intent/follow?screen_name=${social.handle}`} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={X_ICON} /></svg>
                Follow
              </a>
            </div>
            {stats && (
              <dl className="x-profile__stats">
                <div><dt>Posts</dt><dd>{formatXCount(stats.posts)}</dd></div>
                <div><dt>Following</dt><dd>{formatXCount(stats.following)}</dd></div>
                <div><dt>Followers</dt><dd>{formatXCount(stats.followers)}</dd></div>
              </dl>
            )}
            <XPosts handle={social.handle} postIds={social.postIds} />
          </div>
        )}
      </div>
    </section>
  );
}
