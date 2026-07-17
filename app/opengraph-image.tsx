import { SITE_DESCRIPTION } from "@/components/page-metadata";
import { OG_SIZE, renderOgCard } from "@/components/og";

/**
 * Homepage share card — name, essay line, address.
 * Light paper on purpose: scrapers serve a static PNG, not a theme.
 */
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `Nishil Faldu — ${SITE_DESCRIPTION}`;

export default function Image() {
  return renderOgCard({ title: SITE_DESCRIPTION, mark: true });
}
