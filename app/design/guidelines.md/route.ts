import { agentsMarkdown } from "@/lib/guidelines";

export const dynamic = "force-static";

export function GET() {
  return new Response(agentsMarkdown(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
