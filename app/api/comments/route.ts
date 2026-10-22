import { EngagementError, parseComment, parseResource } from "@/lib/engagement-policy";
import { boundedJson, checkOrigin, errorResponse, requireResource, verifyTurnstile, visitorKey } from "@/lib/engagement-http";
import { publicEngagement, submitComment, takeLimit } from "@/lib/engagement-store";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const visitor = visitorKey(request, "comment");
    await takeLimit(`comment-attempt:${visitor}`, 6, 60);
    await takeLimit(`comment-day:${visitor}`, 20, 86400);
    const data = await boundedJson(request);
    const ref = parseResource(data);
    const comment = parseComment(data);
    await requireResource(ref);
    if (!(await publicEngagement(ref)).enabled) throw new EngagementError("目前暫停接受新留言。", 403);
    await verifyTurnstile(comment.token);
    await takeLimit(`comment-submit:${visitor}`, 1, 60);
    await takeLimit("comment-global-day", 300, 86400);
    await submitComment(ref, comment.name, comment.body);
    return Response.json({ message: "留言已送出，審核通過後會公開顯示。" }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch(error) { return errorResponse(error); }
}
