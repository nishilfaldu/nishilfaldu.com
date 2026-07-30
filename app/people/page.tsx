import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { PeopleList } from "@/components/radar/people-list";

/**
 * People I keep up with. Everything it does lives in <PeopleList />.
 */

export const metadata: Metadata = pageMetadata({
  title: "People",
  description:
    "The few writers whose next piece I don’t want to miss, and every place each of them publishes.",
  path: "/people",
});

export default function PeoplePage() {
  return <PeopleList />;
}
