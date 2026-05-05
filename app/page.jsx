import Link from "next/link";
import { challenges } from "@/content/challenges";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-10">
        <div className="text-sm font-bold uppercase tracking-widest text-[var(--color-hoda-orange)]">
          Roblox Studio Book
        </div>
        <h1 className="text-5xl font-black mt-2 leading-tight">
          30 challenges. One growing obby.
        </h1>
        <p className="mt-3 text-lg text-neutral-600">
          Build your first real Roblox game one ten-minute level at a time.
        </p>
      </header>

      <div className="flex gap-3 mb-8">
        <Link
          href="/print"
          className="px-4 py-2 rounded-lg bg-[var(--color-hoda-orange)] text-white font-bold text-sm hover:opacity-90"
        >
          View print version
        </Link>
        <Link
          href="/challenges/fake-wall"
          className="px-4 py-2 rounded-lg bg-[var(--color-hoda-blue)] text-white font-bold text-sm hover:opacity-90"
        >
          Demo: Level 3
        </Link>
      </div>

      <ol className="space-y-1">
        {challenges.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/challenges/${c.slug}`}
              className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-white/60 transition"
            >
              <span className="font-mono text-sm text-neutral-400 w-8">
                {String(c.number).padStart(2, "0")}
              </span>
              <span className="font-bold">{c.title}</span>
              <span className="text-sm text-neutral-500 truncate hidden sm:inline">
                — {c.story}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
