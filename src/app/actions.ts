"use server";
import { revalidatePath } from "next/cache";
import { createServerClient } from "./lib/pocketbase";
import { cookies } from "next/headers";
import { signOut } from "./lib/auth";

const cookieStore = cookies();

const pb = createServerClient(cookieStore);

export async function addLog(formData: FormData) {
  const newLog = {
    body: formData.get("log"),
  };
  await pb.collection("logs").create(newLog);

  revalidatePath("/");
}

export async function handleSignOut() {
  await signOut();
}
