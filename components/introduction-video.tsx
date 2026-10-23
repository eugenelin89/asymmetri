import { mediaDisclosure, type Introduction } from "@/content/site";

/** Render the native player directly; playback remains visitor-controlled. */
export function IntroductionVideo({ video }: { video: Introduction }) {
  return (
    <section
      className={`section introduction-video introduction-video--${video.tone}`}
      id="introduction-video"
      aria-labelledby="introduction-title"
    >
      <div className="shell">
        <div className="video-heading">
          <div>
            <p className="eyebrow">Watch a walkthrough</p>
            <h2 id="introduction-title">{video.headline}</h2>
          </div>
          {"description" in video && <p>{video.description}</p>}
        </div>
        <div className="video-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.videoId}`}
            title={`${video.product} introduction video on YouTube`}
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="video-details">
          <div>
            <p>{mediaDisclosure.notice}</p>
            <a href={mediaDisclosure.privacy.href}>
              {mediaDisclosure.privacy.label}
            </a>
            <span aria-hidden="true"> · </span>
            <a href={mediaDisclosure.website.href}>
              {mediaDisclosure.website.label}
            </a>
          </div>
          <a className="text-link" href={video.source}>
            Watch on YouTube <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="video-fallback">
          If the player is blocked or unavailable, use Watch on YouTube.
        </p>
      </div>
    </section>
  );
}
