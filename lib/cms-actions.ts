import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cmsErrorMessage } from "@/lib/cms-store";

export async function finishCmsEdit(save: () => Promise<string>) {
  let destination: string;
  try {
    destination = await save();
  } catch (error) {
    return { error: cmsErrorMessage(error) };
  }
  revalidatePath("/", "layout");
  redirect(destination);
}
