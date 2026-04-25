import { LoaderGallery } from "@/components/loader-gallery";
import { loaderRegistry } from "@/lib/registry-config";
import { getLoaderSource, getManualSetupSources } from "@/lib/source";

export default async function HomePage() {
  const [items, manualSetup] = await Promise.all([
    Promise.all(
      loaderRegistry.map(async (loader) => ({
        slug: loader.slug,
        title: loader.title,
        description: loader.description,
        componentName: loader.componentName,
        motionOptional: loader.motionOptional,
        sourceCode: await getLoaderSource(loader.fileName)
      }))
    ),
    getManualSetupSources()
  ]);

  return <LoaderGallery items={items} manualSetup={manualSetup} />;
}
