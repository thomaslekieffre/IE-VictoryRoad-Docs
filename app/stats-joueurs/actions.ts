"use server";

import { revalidatePath } from "next/cache";

export async function refreshPlayerStats() {
  revalidatePath("/stats-joueurs");
}
