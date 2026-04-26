import Link from "next/link";

import { ManualCodePanel } from "@/components/manual-code-panel";

const initCommand = `npx shadcn@latest init`;

const componentsJsonExample = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@dotmatrix": "https://dotmatrix.zzzzshawn.cloud/r/{name}.json"
  }
}`;

const installCommand = `npx shadcn@latest add @dotmatrix/dotm-square-3`;

const globalsCssImportExample = `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "../components/dotmatrix-loader.css";
@custom-variant dark (&:is(.dark *));`;

const usageExample = `import { DotmSquare3 } from "@/components/ui/dotm-square-3";

export function SaveButton({ isSaving }: { isSaving: boolean }) {
  return (
    <button
      type="button"
      disabled={isSaving}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2"
    >
      {isSaving ? <DotmSquare3 size={18} dotSize={3} aria-label="Saving" /> : null}
      <span>{isSaving ? "Saving..." : "Save changes"}</span>
    </button>
  );
}`;

export default function UsagePage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="theme-page-shell grid gap-6 rounded-2xl py-10 sm:p-6">
        <header className="grid gap-3">
          <p className="theme-text-muted text-xs">Usage</p>
          <h1 className="theme-text-strong text-2xl tracking-tight sm:text-3xl">Install Dot Matrix from the registry</h1>
          <p className="theme-text max-w-[72ch] text-sm leading-relaxed">
            Dot Matrix loaders ship through a custom shadcn registry (scoped as <code className="font-mono text-[0.9em]">@dotmatrix</code>
            {" "}in the CLI) so the install flow stays familiar: configure once, pull the items you need, then adapt each loader to your product.
          </p>
        </header>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">Prerequisites</h2>
          <ul className="theme-text grid gap-2 text-sm leading-relaxed">
            <li>- React app already running</li>
            <li>- Tailwind CSS configured</li>
            <li>- `components.json` present for shadcn CLI</li>
            <li>- path aliases aligned with your component structure</li>
          </ul>
          <p className="theme-text text-sm leading-relaxed">
            If your project does not have `components.json` yet, initialize shadcn first.
          </p>
          <ManualCodePanel title="Initialize shadcn" code={initCommand} lang="bash" />
        </section>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">Configure the registry</h2>
          <p className="theme-text max-w-[72ch] text-sm leading-relaxed">
            Add the <code className="font-mono text-[0.9em]">@dotmatrix</code> entry in the{" "}
            <code className="font-mono text-[0.9em]">registries</code> field of{" "}
            <code className="font-mono text-[0.9em]">components.json</code> so the CLI can resolve items like{" "}
            <code className="font-mono text-[0.9em]">@dotmatrix/dotm-square-3</code>.
          </p>
          <ManualCodePanel
            title="components.json"
            code={componentsJsonExample}
            lang="json"
            scrollClassName="min-h-[45dvh] max-h-[60dvh] overflow-x-auto"
          />
        </section>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">Install a component</h2>
          <p className="theme-text text-sm leading-relaxed">
            Pull any loader into your app with the shadcn CLI:
          </p>
          <ManualCodePanel title="Install loader" code={installCommand} lang="bash" />
          <ul className="theme-text grid gap-2 text-sm leading-relaxed">
            <li>- `@dotmatrix/dotm-square-3`</li>
            <li>- `@dotmatrix/dotm-circular-5`</li>
            <li>- `@dotmatrix/dotm-triangle-2`</li>
          </ul>
          <p className="theme-text text-sm leading-relaxed">
            Installed files are local. Rename, restyle, and retime motion as needed.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">Ensure loader styles are imported</h2>
          <p className="theme-text max-w-[72ch] text-sm leading-relaxed">
            Dot Matrix loaders depend on <code className="font-mono text-[0.9em]">dotmatrix-loader.css</code>. If your
            setup does not inject it automatically, add this import in{" "}
            <code className="font-mono text-[0.9em]">app/globals.css</code>.
          </p>
          <ManualCodePanel title="globals.css" code={globalsCssImportExample} lang="css" />
        </section>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">Use in real UI states</h2>
          <p className="theme-text max-w-[72ch] text-sm leading-relaxed">
            Keep indicators close to the action they describe. Inline usage works well when only part
            of the interface is pending.
          </p>
          <ManualCodePanel
            title="Save button example"
            code={usageExample}
            lang="tsx"
            scrollClassName="min-h-[40dvh] max-h-[60dvh] overflow-x-auto"
          />
        </section>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">Usage guidelines</h2>
          <ul className="theme-text grid gap-2 text-sm leading-relaxed">
            <li>- Use inline loaders when only a local region is pending.</li>
            <li>- Prefer skeletons when preserving content shape matters most.</li>
            <li>- Pair motion with accessible text when context is not obvious.</li>
            <li>- Avoid multiple competing loaders in one viewport.</li>
          </ul>
        </section>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">Next step</h2>
          <p className="theme-text text-sm leading-relaxed">
            Browse the{" "}
            <Link href="/" className="theme-link underline decoration-(--color-fg-dim) underline-offset-2">
              components gallery
            </Link>{" "}
            for specific primitives, or read the{" "}
            <Link
              href="/getting-started/introduction"
              className="theme-link underline decoration-(--color-fg-dim) underline-offset-2"
            >
              introduction
            </Link>{" "}
            for what Dot Matrix is aiming for and its constraints.
          </p>
        </section>
      </section>
    </main>
  );
}
