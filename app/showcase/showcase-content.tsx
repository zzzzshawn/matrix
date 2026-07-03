import Link from "next/link";

import { ShowcaseVideoCard } from "@/components/showcase-video-card";
import { showcaseVideos } from "@/lib/showcase-videos";

const heroNavLinkClassName =
  "text-fg-dim inline-block outline-offset-2 transition-[color,transform] duration-200 ease-out hover:text-link-hover focus-visible:text-link-hover motion-reduce:transition-colors";

export function ShowcaseContent() {
  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="mt-10 sm:mt-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_auto] lg:items-end">
          <div className="space-y-4">
            <div className="flex justify-between w-full gap-4 sm:gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="theme-text-strong text-balance text-3xl tracking-tight sm:text-7xl">
                  Showcase
                </h1>
                <p className="max-w-[65ch] text-pretty text-sm leading-relaxed tracking-tight sm:text-2xl">
                  Dot Matrix loaders in the wild — demos, integrations, and motion studies from the community.
                </p>
              </div>
              <nav
                aria-label="Site"
                className="flex w-max shrink-0 flex-col items-end gap-1 sm:gap-2 pt-1.5 text-xs sm:text-2xl sm:pt-4"
              >
                <Link href="/getting-started/introduction" className={heroNavLinkClassName}>
                  Introduction
                </Link>
                <Link href="/getting-started/usage" className={heroNavLinkClassName}>
                  Usage
                </Link>
                <Link href="/getting-started/manual" className={heroNavLinkClassName}>
                  Manual setup
                </Link>
                <Link href="/playground" className={heroNavLinkClassName}>
                  Playground
                </Link>
                <Link href="/showcase" className={heroNavLinkClassName} aria-current="page">
                  Showcase
                </Link>
              </nav>
            </div>

          </div>
        </div>
      </section>

      <section className="mt-10 sm:mt-14">
        {showcaseVideos.length === 0 ? (
          <div className="theme-page-shell rounded-xl px-6 py-16 text-center sm:px-10">
            <p className="theme-text-muted text-xs uppercase tracking-[0.2em]">Coming soon</p>
            <p className="theme-text-strong mt-3 text-xl tracking-tight sm:text-2xl">
              Videos will appear here shortly.
            </p>
            <p className="theme-text mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed">
              Check back soon, or browse the{" "}
              <Link
                href="/"
                className="theme-link underline decoration-fg-dim underline-offset-2"
              >
                loader gallery
              </Link>{" "}
              in the meantime.
            </p>
          </div>
        ) : (
          <ul className="columns-1 gap-4 sm:columns-2 lg:gap-4">
            {showcaseVideos.map((video) => (
              <li key={video.id} className="mb-6 break-inside-avoid lg:mb-2">
                <ShowcaseVideoCard video={video} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
