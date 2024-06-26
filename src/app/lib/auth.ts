"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "./pocketbase";

export async function signIn(formData: FormData) {
  const cookieStore = cookies();
  const pb = createServerClient(cookieStore);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { token, record: model } = await pb
    .collection("users")
    .authWithPassword(email, password);

  console.log("Authentication successful:", model);
  const cookie = JSON.stringify({ token, model });

  // Store the token in a secure HTTP-only cookie
  cookieStore.set("pb_auth", cookie, {
    secure: true,
    path: "/",
    sameSite: "strict",
    httpOnly: true,
  });
  redirect("/");
}

export async function signOut() {
  cookies().delete("pb_auth");
  redirect("/login");
}
