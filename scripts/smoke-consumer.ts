import { readFile } from "node:fs/promises";
import path from "node:path";

interface RegistryManifest {
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface RegistryItem {
  name: string;
  files: Array<{ path: string; content: string }>;
}

async function run() {
  const docsRoot = process.cwd();
  const registryPath = path.join(docsRoot, "registry.json");

  const registry = JSON.parse(await readFile(registryPath, "utf-8")) as RegistryManifest;

  if (!registry.items.length) {
    throw new Error("No registry items found.");
  }

  for (const manifestItem of registry.items) {
    const itemPath = path.join(docsRoot, "public", manifestItem.url.replace(/^\//, ""));
    const item = JSON.parse(await readFile(itemPath, "utf-8")) as RegistryItem;

    if (item.name !== manifestItem.name) {
      throw new Error(`Name mismatch for ${manifestItem.name}.`);
    }

    if (!item.files.length) {
      throw new Error(`No installable files for ${manifestItem.name}.`);
    }
  }

  console.log(`Smoke check passed for ${registry.items.length} registry item(s).`);
}

void run();
