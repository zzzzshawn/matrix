import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { loaderRegistry } from "../lib/registry-config";

interface RegistryFile {
  path: string;
  type: "registry:ui" | "registry:lib" | "registry:style";
  content: string;
}

const docsRoot = process.cwd();
const loadersRoot = path.join(docsRoot, "loaders");
const publicRegistryDir = path.join(docsRoot, "public", "r");

const sharedSourceFiles: Array<{ filePath: string; targetPath: string; type: RegistryFile["type"] }> = [
  {
    filePath: "base/dot-matrix-base.tsx",
    targetPath: "lib/dotmatrix/base/dot-matrix-base.tsx",
    type: "registry:lib"
  },
  {
    filePath: "core/cx.ts",
    targetPath: "lib/dotmatrix/core/cx.ts",
    type: "registry:lib"
  },
  {
    filePath: "core/patterns.ts",
    targetPath: "lib/dotmatrix/core/patterns.ts",
    type: "registry:lib"
  },
  {
    filePath: "core/grid-paths.ts",
    targetPath: "lib/dotmatrix/core/grid-paths.ts",
    type: "registry:lib"
  },
  {
    filePath: "core/math.ts",
    targetPath: "lib/dotmatrix/core/math.ts",
    type: "registry:lib"
  },
  {
    filePath: "core/circle-mask.ts",
    targetPath: "lib/dotmatrix/core/circle-mask.ts",
    type: "registry:lib"
  },
  {
    filePath: "core/path-wave-factory.tsx",
    targetPath: "lib/dotmatrix/core/path-wave-factory.tsx",
    type: "registry:lib"
  },
  {
    filePath: "core/phases.ts",
    targetPath: "lib/dotmatrix/core/phases.ts",
    type: "registry:lib"
  },
  {
    filePath: "hooks/use-prefers-reduced-motion.ts",
    targetPath: "lib/dotmatrix/hooks/use-prefers-reduced-motion.ts",
    type: "registry:lib"
  },
  {
    filePath: "types.ts",
    targetPath: "lib/dotmatrix/types.ts",
    type: "registry:lib"
  },
  {
    filePath: "styles.css",
    targetPath: "styles/dotmatrix-loader.css",
    type: "registry:style"
  }
];

async function readSource(relativePath: string): Promise<string> {
  return readFile(path.join(loadersRoot, relativePath), "utf-8");
}

async function build() {
  await rm(publicRegistryDir, { recursive: true, force: true });
  await mkdir(publicRegistryDir, { recursive: true });

  const registryItems = await Promise.all(
    loaderRegistry.map(async (loader) => {
      const files: RegistryFile[] = [];

      const componentSource = await readSource(path.join("loaders", loader.fileName));
      files.push({
        path: `components/ui/${loader.fileName}`,
        type: "registry:ui",
        content: componentSource
      });

      for (const sharedFile of sharedSourceFiles) {
        files.push({
          path: sharedFile.targetPath,
          type: sharedFile.type,
          content: await readSource(sharedFile.filePath)
        });
      }

      const item = {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name: loader.slug,
        type: "registry:ui",
        title: loader.title,
        description: loader.description,
        dependencies: loader.dependencies,
        registryDependencies: [],
        meta: {
          animation: loader.motionOptional ? "css + optional motion" : "css-only"
        },
        files
      };

      await writeFile(
        path.join(publicRegistryDir, `${loader.slug}.json`),
        JSON.stringify(item, null, 2) + "\n",
        "utf-8"
      );

      await writeFile(path.join(publicRegistryDir, `${loader.slug}.tsx`), componentSource, "utf-8");

      return {
        name: loader.slug,
        type: "registry:ui",
        title: loader.title,
        description: loader.description,
        dependencies: loader.dependencies,
        registryDependencies: [],
        url: `/r/${loader.slug}.json`
      };
    })
  );

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "dotmatrix-loaders",
    homepage: "https://your-docs-domain.com",
    items: registryItems
  };

  await writeFile(
    path.join(docsRoot, "registry.json"),
    JSON.stringify(registry, null, 2) + "\n",
    "utf-8"
  );

  await writeFile(
    path.join(publicRegistryDir, "index.json"),
    JSON.stringify(registryItems, null, 2) + "\n",
    "utf-8"
  );
}

void build();
