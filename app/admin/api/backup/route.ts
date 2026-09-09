import { requireAdminRole } from "@/lib/admin-auth";
import { readCmsContent } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireAdminRole();
  const content = await readCmsContent();
  return new Response(JSON.stringify(content, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="vietthai-content-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "private, no-store"
    }
  });
}
