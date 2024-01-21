import {auth} from "@/auth.config";

export default async function Home() {
    const session = await auth();

    console.log('session', session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            Session: {session?.user?.uuid || 'No session'}
            Session: {session?.user?.token || 'No session'}
          Session: {session?.user?.name || 'No session'}
          Session: {session?.user?.email || 'No session'}
      </div>
    </main>
  );
}
