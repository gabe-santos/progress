import { signIn } from "../lib/auth";

export default function Login() {
  return (
    <main className="flex flex-col justify-center">
      <div className="border">
        <form action={signIn}>
          <input type="text" name="email" className="border" />
          <input type="password" name="password" className="border" />
          <button type="submit">submit</button>
        </form>
      </div>
    </main>
  );
}
