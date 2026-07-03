"use client";

import { useCallback, useState } from "react";

import type { ShowcaseVideo } from "@/lib/showcase-videos";

interface ShowcaseVideoCardProps {
  video: ShowcaseVideo;
}

export function ShowcaseVideoCard({ video }: ShowcaseVideoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadedData = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <article className="inline-block w-full overflow-hidden rounded-xl bg-surface p-2">
      <div
        className="relative w-full overflow-hidden rounded-lg bg-bg"
        style={{ aspectRatio: `${video.skeletonWidth} / ${video.skeletonHeight}` }}
      >
        {!isLoaded ? (
          <div className="absolute inset-0 bg-surface-muted" aria-hidden="true" />
        ) : null}
        <video
          className="relative block h-auto w-full max-w-full"
          src={video.src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={video.poster}
          onLoadedData={handleLoadedData}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <h2 className="theme-text-strong px-3 py-1 pt-2 text-lg tracking-tight sm:text-xl">
        {video.title}
      </h2>
    </article>
  );
}
