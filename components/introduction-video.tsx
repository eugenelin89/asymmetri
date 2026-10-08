"use client";

import { useRef, useState } from "react";
import { mediaDisclosure, type Introduction } from "@/content/site";

/** The iframe is absent until a deliberate click; permission is never persisted. */
export function IntroductionVideo({ video }: { video: Introduction }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const player = useRef<HTMLIFrameElement>(null);
  const loadButton = useRef<HTMLButtonElement>(null);

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
          {loaded && !failed ? (
            <iframe
              ref={player}
              src={`https://www.youtube-nocookie.com/embed/${video.videoId}`}
              title={`${video.product} introduction video on YouTube`}
              allow="encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => player.current?.focus()}
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="video-poster">
              <div className="video-poster__copy">
                <span>{video.product}</span>
                <p>{video.posterLine}</p>
              </div>
              {!failed && (
                <button
                  ref={loadButton}
                  className="video-load"
                  type="button"
                  aria-label={`Load ${video.product} introduction video`}
                  onClick={() => setLoaded(true)}
                >
                  <span aria-hidden="true">▶</span> Load video
                </button>
              )}
              {failed && (
                <p className="video-failed" role="status">
                  The player could not load. Use Watch on YouTube below.
                </p>
              )}
            </div>
          )}
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
        {loaded && !failed && (
          <div className="video-fallback">
            <p>
              If the player is blocked or unavailable, use Watch on YouTube.
            </p>
            <button
              type="button"
              onClick={() => {
                setLoaded(false);
                setFailed(false);
                requestAnimationFrame(() => loadButton.current?.focus());
              }}
            >
              Close player
            </button>
          </div>
        )}
        <noscript>
          <p className="video-fallback">
            Use Watch on YouTube to view this introduction without JavaScript.
          </p>
        </noscript>
      </div>
    </section>
  );
}
