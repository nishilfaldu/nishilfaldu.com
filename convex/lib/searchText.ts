/**
 * One flat string per link, rebuilt on every write that touches its parts.
 * Ported from Sediment's buildSearchText — the URL is included on purpose, so
 * searching "substack" or a bare domain finds things whose titles never say it.
 */
export function buildSearchText(fields: {
  title?: string | null;
  description?: string | null;
  note?: string | null;
  url?: string | null;
}): string {
  return [fields.title, fields.description, fields.note, fields.url]
    .filter((value): value is string => Boolean(value?.trim()))
    .join("\n");
}
