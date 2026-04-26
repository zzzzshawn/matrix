import Link from "next/link";

export default function IntroductionPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="theme-page-shell grid gap-8 rounded-2xl p-5 sm:p-6">
        <header className="grid gap-3">
          <p className="theme-text-muted text-xs">Introduction</p>
          <h1 className="theme-text-strong text-2xl tracking-tight sm:text-3xl">Dotmatrix loaders that feel intentional</h1>
          <p className="theme-text max-w-[72ch] text-sm leading-relaxed">
            Install the Dotmatrix registry into your app and ship loading states that feel designed,
            lightweight, and easy to maintain. This project focuses on one job: providing expressive
            loading primitives for modern React interfaces without pulling in a giant component system.
          </p>
        </header>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">What this project is</h2>
          <p className="theme-text max-w-[72ch] text-sm leading-relaxed">
            Dotmatrix Loader Library follows the same install model many teams already use with shadcn:
            pull a component into your codebase, then edit it like local code. The current collection
            stays compact on purpose so loaders can blend into your existing UI language instead of
            forcing a separate aesthetic.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">Why it exists</h2>
          <ul className="theme-text grid gap-2 text-sm leading-relaxed">
            <li>- focused loading components instead of a full design framework</li>
            <li>- open source code you own after installation</li>
            <li>- registry distribution that fits existing shadcn-style workflows</li>
            <li>- primitives that adapt to your spacing, color, and motion tokens quickly</li>
          </ul>
        </section>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">How it fits your stack</h2>
          <p className="theme-text max-w-[72ch] text-sm leading-relaxed">
            The setup works best in React apps already using Tailwind CSS with a shadcn-compatible
            `components.json`. In that environment, onboarding is short: add the registry, install a
            loader, and style it to match your product.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">Open source and community</h2>
          <p className="theme-text max-w-[72ch] text-sm leading-relaxed">
            Every installed component is inspectable and editable, which matters because loading states
            often need product-specific tuning for timing, scale, and accessibility. If you find rough
            edges or have a reusable pattern to share, contributions are welcome.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="theme-text-strong text-lg tracking-tight">Start here</h2>
          <p className="theme-text max-w-[72ch] text-sm leading-relaxed">
            Jump into{" "}
            <Link href="/getting-started/usage" className="theme-link underline decoration-(--color-fg-dim) underline-offset-2">
              Usage
            </Link>{" "}
            to install your first component, or review{" "}
            <Link href="/" className="theme-link underline decoration-(--color-fg-dim) underline-offset-2">
              the loader gallery
            </Link>{" "}
            to preview available primitives.
          </p>
        </section>
      </section>
    </main>
  );
}
