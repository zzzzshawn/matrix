import Link from "next/link";

import { HomeMatrixIcon } from "@/components/package-manager-install-toolbar";

export function HomeLink() {
  return (
    <div className="w-max rounded-xl bg-surface p-1">
      <Link
        href="/"
        aria-label="Home"
        className="inline-flex items-center justify-center rounded-lg bg-bg p-[7px] text-fg-strong transition-[opacity,color] duration-150 ease-out hover:opacity-90 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)"
      >
        <HomeMatrixIcon className="size-4 sm:size-5" />
      </Link>
    </div>
  );
}
