import { leadershipPageProfiles } from "@/lib/leadership";

function initials(name: string) {
  return name
    .replace(/^(Mr\.|Mrs\.|Ms\.|Smt\.|Dr\.)\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export default function LeadershipProfiles() {
  return (
    <>
      <section className="leadership-board" aria-labelledby="leadership-board-title">
        <div className="container">
          <h2 id="leadership-board-title">Board of Directors</h2>
          <div className="leadership-board__list">
            {leadershipPageProfiles.map((profile, index) => (
              (() => {
                const hasMoreContent = (profile.bio?.length ?? 0) > 280 || Boolean(profile.sections?.length);
                const sections = profile.sections?.map((section) => (
                  <section className="leadership-profile__section" key={section.title}>
                    <h4>{section.title}</h4>
                    {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.items && (
                      <ul>
                        {section.items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    )}
                  </section>
                ));

                return (
                  <article
                    className={`leadership-profile${index % 2 ? " leadership-profile--reverse" : ""}`}
                    key={profile.name}
                  >
                    <div className="leadership-profile__portrait">
                      {profile.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.image}
                          alt={profile.name}
                          loading="lazy"
                          style={profile.imagePosition ? { objectPosition: profile.imagePosition } : undefined}
                        />
                      ) : (
                        <span aria-hidden="true">{initials(profile.name)}</span>
                      )}
                    </div>
                    <div className="leadership-profile__content">
                      {hasMoreContent ? (
                        <details className="leadership-profile__details">
                          <summary>
                            <span className="leadership-profile__heading">
                              <span className="leadership-profile__name">{profile.name}</span>
                              <span className="leadership-profile__role">{profile.role}</span>
                            </span>
                            {profile.bio && <span className="leadership-profile__preview">{profile.bio}</span>}
                            <span className="leadership-profile__toggle" aria-hidden="true" />
                          </summary>
                          {profile.sections?.length ? (
                            <div className="leadership-profile__expanded">{sections}</div>
                          ) : (
                            <span className="leadership-profile__expanded" aria-hidden="true" />
                          )}
                        </details>
                      ) : (
                        <>
                          <h3>{profile.name}</h3>
                          <p className="leadership-profile__role">{profile.role}</p>
                          {profile.bio && <p className="leadership-profile__bio">{profile.bio}</p>}
                          {sections}
                        </>
                      )}
                    </div>
                  </article>
                );
              })()
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
