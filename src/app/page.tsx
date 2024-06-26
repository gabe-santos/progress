import parse from "html-react-parser";
import { addLog } from "./actions";
import { createServerClient } from "./lib/pocketbase";
import { redirect } from "next/navigation";
import { getAuthenticatedUser, signOut } from "./lib/auth";
import { cookies } from "next/headers";

export const revalidate = 0;

export default async function Home() {
  const cookieStore = cookies();
  const pb = createServerClient(cookieStore);
  const user = await getAuthenticatedUser();

  if (!pb.authStore.isValid) {
    console.log("no user detected");
    redirect("/login");
  }

  const records = await pb.collection("logs").getFullList({
    sort: "-created",
  });

  return (
    <div className="flex flex-col gap-8">
      <form action={signOut}>
        <button type="submit">Sign Out</button>
      </form>
      {/* <h1>Welcome {user.name}</h1> */}
      <form action={addLog}>
        <input type="text" name="log" />
        <button>submit</button>
      </form>
      {records.map((r) => {
        return (
          <div key={r.id}>
            {new Date(r.created).toLocaleString()}
            {parse(r.body)}
          </div>
        );
      })}
    </div>
  );
}
