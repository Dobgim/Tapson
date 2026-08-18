import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // `satisfies` keeps the changeFrequency literals from widening to `string`
  // when the array is mapped over below.
  const staticRoutes = (
    [
      { url: `${site.url}/`, priority: 1, changeFrequency: "daily" },
      { url: `${site.url}/inventory`, priority: 0.9, changeFrequency: "daily" },
      { url: `${site.url}/specials`, priority: 0.9, changeFrequency: "daily" },
      { url: `${site.url}/financing`, priority: 0.7, changeFrequency: "monthly" },
      { url: `${site.url}/trade-in`, priority: 0.7, changeFrequency: "monthly" },
      { url: `${site.url}/service`, priority: 0.7, changeFrequency: "monthly" },
      { url: `${site.url}/parts`, priority: 0.7, changeFrequency: "monthly" },
      { url: `${site.url}/locations`, priority: 0.6, changeFrequency: "monthly" },
      { url: `${site.url}/about`, priority: 0.5, changeFrequency: "yearly" },
      { url: `${site.url}/contact`, priority: 0.6, changeFrequency: "yearly" },
      { url: `${site.url}/credits`, priority: 0.2, changeFrequency: "yearly" },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified: now }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${site.url}/inventory?category=${c.slug}`,
    lastModified: now,
    priority: 0.8,
    changeFrequency: "daily",
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${site.url}/inventory/${p.slug}`,
    lastModified: now,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
