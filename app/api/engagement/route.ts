import { parseResource, isAutomatedAgent } from "@/lib/engagement-policy";
import { boundedJson, checkOrigin, errorResponse, requireResource, visitorKey } from "@/lib/engagement-http";
import { publicEngagement, recordView, takeLimit } from "@/lib/engagement-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const ref = parseResource({ kind: params.get("kind"), slug: params.get("slug") });
    const offset = Math.min(10000, Math.max(0, Number(params.get("offset")) || 0));
    await requireResource(ref);
    return Response.json(await publicEngagement(ref, Math.floor(offset)), { headers: { "Cache-Control": "no-store" } });
  } catch(error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const ref = parseResource(await boundedJson(request));
    await requireResource(ref);
    if (!isAutomatedAgent(request.headers.get("user-agent") || "")) {
      const visitor = visitorKey(request, "view");
      await takeLimit(`views:${visitor}`, 500, 86400);
      await recordView(ref, visitor);
    }
    return Response.json(await publicEngagement(ref), { headers: { "Cache-Control": "no-store" } });
  } catch(error) { return errorResponse(error); }
}
