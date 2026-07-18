import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/page-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "/",
    "/projects",
    "/projects/sediment",
    "/projects/atlas",
    "/projects/cedar",
    "/ideas",
    "/writings",
    "/tinkerletter",
    "/tinkerletter/shoe-buyers-field-guide",
    "/scaffolds",
  ] as const;

  return paths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
  }));
}
