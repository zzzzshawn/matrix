export interface ShowcaseVideo {
  id: string;
  title: string;
  description?: string;
  src: string;
  poster?: string;
  /** Hardcoded frame size used for the loading skeleton aspect ratio. */
  skeletonWidth: number;
  skeletonHeight: number;
}

/** Add showcase entries here — `src` should be a direct video URL (mp4, webm, etc.). */
export const showcaseVideos: readonly ShowcaseVideo[] = [
  {
    id: "inferay",
    title: "Inferay",
    src: "https://pub-b522cba2357b46e3a10e1954b8bf1931.r2.dev/Bkrn_efhkqm1GtLV.mp4",
    skeletonWidth: 874,
    skeletonHeight: 808
  },
  {
    id: "databuddy",
    title: "Databuddy",
    src: "https://pub-b522cba2357b46e3a10e1954b8bf1931.r2.dev/Screen%20Recording%202026-07-03%20at%2012.54.57.mov",
    skeletonWidth: 1920,
    skeletonHeight: 1806
  },
  {
    id: "usualsai",
    title: "Usualsai",
    src: "https://pub-b522cba2357b46e3a10e1954b8bf1931.r2.dev/IE1c9uX1jjAm28bI.mp4",
    skeletonWidth: 2164,
    skeletonHeight: 1202
  },
  {
    id: "usualsai-screen-recording",
    title: "Usualsai",
    src: "https://pub-b522cba2357b46e3a10e1954b8bf1931.r2.dev/Screen%20Recording%202026-07-03%20at%2013.10.04.mov",
    skeletonWidth: 1810,
    skeletonHeight: 1126
  }
];
