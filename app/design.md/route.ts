import { generateSpec } from "@nishilfaldu/sunny/spec";

export const dynamic = "force-static";

export function GET() {
  return new Response(generateSpec("light"), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
