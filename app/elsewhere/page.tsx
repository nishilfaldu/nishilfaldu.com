import type { Metadata } from "next";
import { ElsewhereList } from "@/components/elsewhere-list";
import { pageMetadata } from "@/components/page-metadata";

/**
 * Secondary rooms. Everything it does lives in <ElsewhereList />.
 */

export const metadata: Metadata = pageMetadata({
  title: "Elsewhere",
  description:
    "The other rooms on this site — ideas, scaffolds, what’s in the works.",
  path: "/elsewhere",
});

export default function ElsewherePage() {
  return <ElsewhereList />;
}
