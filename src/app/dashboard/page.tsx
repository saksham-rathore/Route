"use client";

import { useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Redirecting...</p>
      </main>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Welcome, {session.user.name || session.user.email}
        </p>
      </div>

      <button
        onClick={handleSignOut}
        className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
      >
        Sign Out
      </button>
    </main>
  );
}