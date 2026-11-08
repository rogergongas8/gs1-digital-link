import type { MetadataRoute } from "next";
import { SEO_GS1_TOOLS } from "@/data/seo-tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://gs1-digital-link-lac.vercel.app";

  const programmaticRoutes: MetadataRoute.Sitemap = SEO_GS1_TOOLS.map(
    (tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/01/08412345678905/10/LOT26A?17=271231`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...programmaticRoutes,
  ];
}
