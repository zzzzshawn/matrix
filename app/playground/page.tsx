import { PlaygroundClient } from "@/app/playground/playground-client";
import { loaderRegistry } from "@/lib/registry-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description: "Tune Dot Matrix loader props with live DialKit controls."
};

interface PlaygroundPageProps {
  searchParams?: Promise<{
    loader?: string;
  }>;
}

export default async function PlaygroundPage({ searchParams }: PlaygroundPageProps) {
  const params = await searchParams;
  const initialSlug = params?.loader;
  const loaderOptions = loaderRegistry.map((loader) => ({
    slug: loader.slug,
    title: loader.title,
    componentName: loader.componentName
  }));

  return (
    <PlaygroundClient
      initialSlug={initialSlug}
      loaders={loaderOptions}
    />
  );
}
