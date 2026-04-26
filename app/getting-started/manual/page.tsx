import { ManualCodePanel } from "@/components/manual-code-panel";
import { getManualSetupSources } from "@/lib/source";

const cssImportLine = `@import "@/styles/dotmatrix-loader.css";`;

export default async function ManualGettingStartedPage() {
  const manualSetup = await getManualSetupSources();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="theme-page-shell grid gap-6 rounded-2xl py-10 sm:p-6">
        <header className="grid gap-3">
          <p className="theme-text-muted text-xs">Getting Started</p>
          <h1 className="theme-text-strong text-2xl tracking-tight sm:text-3xl">Manual Setup Guide</h1>
          <p className="theme-text max-w-[72ch] text-sm leading-relaxed">
            Before you paste any individual loader component, add these shared runtime files once.
            After this setup, you can copy any loader source snippet from the gallery and use it directly.
          </p>
        </header>

        <ManualCodePanel
          title={manualSetup.coreFilePath}
          code={manualSetup.coreSource}
          lang="tsx"
        />

        <ManualCodePanel
          title={manualSetup.hooksFilePath}
          code={manualSetup.hooksSource}
          lang="typescript"
        />

        <div className="grid gap-4">
          <ManualCodePanel
            title={manualSetup.cssFilePath}
            code={manualSetup.cssSource}
            lang="css"
            scrollClassName="min-h-[60dvh] max-h-[60dvh] overflow-x-auto"
          />
          <ManualCodePanel
            title="Import in your global CSS"
            code={cssImportLine}
            lang="css"
            scrollClassName="overflow-x-auto"
          />
        </div>
      </section>
    </main>
  );
}
