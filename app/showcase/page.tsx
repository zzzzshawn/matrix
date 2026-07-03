import type { Metadata } from "next";

import { ShowcaseContent } from "@/app/showcase/showcase-content";

export const metadata: Metadata = {
  title: "Showcase",
  description: "See Dot Matrix loaders in action."
};

export default function ShowcasePage() {
  return <ShowcaseContent />;
}
