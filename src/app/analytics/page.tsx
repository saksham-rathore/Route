import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Workspace</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
          Interactive geography and visitor analytics dashboard is accessible from your project console.
        </p>
      </div>
    </main>
  );
}