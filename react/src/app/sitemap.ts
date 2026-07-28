import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Single-page site — the section anchors live on "/" and are not separate URLs,
// so one entry is the whole map. Add entries here when real routes appear.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://isthmusmeridian.com/",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
