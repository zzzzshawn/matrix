import { readFile } from "node:fs/promises";
import path from "node:path";

const loadersRoot = path.join(process.cwd(), "loaders");

export async function getLoaderSource(fileName: string): Promise<string> {
  return readFile(path.join(loadersRoot, "loaders", fileName), "utf-8");
}

export async function getSharedCssSource(): Promise<string> {
  return readFile(path.join(loadersRoot, "styles.css"), "utf-8");
}
