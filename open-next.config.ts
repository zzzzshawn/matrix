import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // Prerendered pages read loader sources from disk at build time; serve them from static assets.
  incrementalCache: staticAssetsIncrementalCache,
  // Keep off: with Next 16's segment prefetching, intercepted RSC responses never
  // satisfy the client router, so every open tab re-prefetches the nav links
  // forever (~15 req/s per tab). That burned the account's daily Workers quota.
  enableCacheInterception: false
});
