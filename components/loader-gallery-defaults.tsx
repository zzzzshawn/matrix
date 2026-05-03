import Image from "next/image";
import type { HeroNavLink, LoaderGalleryHeroContent } from "@/components/loader-gallery.types";

const HERO_SHADCN_INSTALL_COMMAND = "npx shadcn@latest add @dotmatrix/dotm-square-3";

const DEFAULT_HERO_NAV_LINKS: readonly HeroNavLink[] = [
  { label: "Introduction", href: "/getting-started/introduction" },
  { label: "Usage", href: "/getting-started/usage" },
  { label: "Manual setup", href: "/getting-started/manual" }
];

const DEFAULT_HERO_TITLE = (
  <span className="block">
    Dot{" "}
    <span
      className="hidden sm:inline-block -mx-0.5 sm:-ml-1 sm:-mr-3 rotate-5 p-0.5 sm:p-1 bg-[#dfdfdf] rounded-md sm:rounded-[22px] size-[0.95em] translate-y-1 sm:translate-y-3"
      aria-hidden="true"
    >
      <Image
        src="/icon.svg"
        alt=""
        width={200}
        height={200}
        className="size-full select-none"
        draggable={false}
        priority
      />
    </span>{" "}
    matrix loaders for every app.
  </span>
);

const DEFAULT_HERO_DESCRIPTION =
  "55+ free and open-source loaders, built with React, TypeScript, Tailwind CSS, and shadcn. Install one, copy the code, and make it yours.";

export const LOADER_GALLERY_DEFAULT_DETAIL_PREVIEW_SCALE = 3;
export const LOADER_GALLERY_DEFAULT_DETAIL_DOT_BOOST = 11;

export const LOADER_GALLERY_DEFAULT_HERO_CONTENT: LoaderGalleryHeroContent = {
  title: DEFAULT_HERO_TITLE,
  description: DEFAULT_HERO_DESCRIPTION,
  navLinks: DEFAULT_HERO_NAV_LINKS,
  installCommand: HERO_SHADCN_INSTALL_COMMAND
};
