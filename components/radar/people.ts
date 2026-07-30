import type { Channel } from "@/components/radar/sources";

/**
 * People whose next thing I don’t want to miss.
 *
 * Not a follow list — a short one. Editing this file is the whole workflow:
 * add a person, list every place they actually publish, keep the note to one
 * clause about why they’re here.
 *
 * The list is deliberately empty until Nishil hands over the names.
 */
export type Person = {
  slug: string;
  name: string;
  /** One clause — why I read them, not their résumé. */
  note?: string;
  /** Every place they publish. Order is how I’d check them. */
  channels: Channel[];
};

export const PEOPLE: Person[] = [];
