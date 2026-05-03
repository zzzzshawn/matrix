import Image from "next/image";
import Link from "next/link";

import { HeartMatrixIcon } from "@/components/package-manager-install-toolbar";

const REPO_URL = "https://github.com/zzzzshawn/matrix";
const SPONSOR_URL = "https://github.com/sponsors/zzzzshawn";
const CREATOR_URL = "https://x.com/zzzzshawn/";

const footerActionClass =
  "text-fg-dim md:text-lg tracking-wide outline-offset-2 transition-[color,transform] duration-200 ease-out hover:text-link-hover focus-visible:text-link-hover motion-reduce:transition-colors";

export function SiteFooter() {
  return (
    <footer
      role="contentinfo"
      className="max-w-[1350px] w-full h-[85dvh] md:h-[70dvh] mx-auto bg-surface mt-20 md:mt-40 mb-8 rounded-3xl relative"
    >
      <span className="absolute pointer-events-none inline-block [html[data-theme='dark']_&]:hidden -rotate-6 sm:p-3 size-[280px] md:size-[340px] max-md:bottom-28! md:top-1/2 md:-translate-y-1/2 right-1/2 translate-x-1/2 p-1.5 bg-background rounded-[76px] md:rounded-[86px]" aria-hidden="true">
        <Image
          src="/icon.svg"
          alt=""
          width={200}
          height={200}
          className="size-full select-none shadow-[0_40px_80px_-21px_rgba(0,0,0,0.5)] rounded-[74px]"
          draggable={false}
          priority
        />
      </span>
      <span className="absolute pointer-events-none hidden [html[data-theme='dark']_&]:inline-block -rotate-6 sm:p-3 size-[280px] md:size-[340px]  max-md:bottom-28! md:top-1/2 md:-translate-y-1/2 right-1/2 translate-x-1/2 p-1.5 bg-[#d0d0d0] shadow-[0_3px_4px_0px_rgba(255,255,255,1)_inset] rounded-[76px] md:rounded-[86px]" aria-hidden="true">
        <Image
          src="/icon.svg" 
          alt=""
          width={200}
          height={200}
          className="size-full select-none shadow-[0_40px_80px_-21px_rgba(0,0,0,1)] rounded-[74px]"
          draggable={false}
          priority
        />
      </span>
      <span className="inline-flex items-center gap-2.5 text-3xl  absolute bottom-4 right-8 z-10">
        <HeartMatrixIcon className="shrink-0 " size={40} />
        <a href={CREATOR_URL} target="_blank" className="">by shawn.</a>
      </span>
      <div className="flex flex-col  gap-2.5 text-xl md:text-3xl italic absolute top-8 left-8 z-10 pointer-events-auto">
        <span className=""><span className="font-semibold text-3xl md:text-5xl">@dotmatrix</span> - v1.5.0</span>
        <nav
          aria-label="Documentation"
          className="flex flex-col  gap-2 pt-10 text-lg md:text-xl not-italic font-normal tracking-normal"
        >
          <Link href="/getting-started/introduction" className={footerActionClass}>
            Introduction
          </Link>
          <Link href="/getting-started/usage" className={footerActionClass}>
            Usage
          </Link>
          <Link href="/getting-started/manual" className={footerActionClass}>
            Manual setup
          </Link>
          <a
            href={SPONSOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={footerActionClass}
          >
            Sponsor creator
          </a>
        </nav>
      </div>
      <span className="inline-flex flex-col items-end gap-2.5 md:text-3xl italic absolute bottom-4 md:top-6 md:right-8 left-6">
        <a href={CREATOR_URL} target="_blank" className="text-base">x.com</a>
        <a href={REPO_URL} target="_blank" className="text-base">github</a>
      </span>

    </footer>
  );
}
