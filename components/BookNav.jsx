"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookNav({ current, total }) {
  const router = useRouter();
  const prev = current > 1 ? `/page/${current - 1}` : null;
  const next = current < total ? `/page/${current + 1}` : null;

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft" && prev) router.push(prev);
      if (e.key === "ArrowRight" && next) router.push(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);

  return (
    <div className="fixed inset-x-0 bottom-5 flex items-center justify-center gap-3 z-50 pointer-events-none">
      {prev ? (
        <Link
          href={prev}
          aria-label="Previous page"
          className="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-2xl font-bold text-neutral-700 hover:text-[var(--color-hoda-orange)] transition"
        >
          ‹
        </Link>
      ) : (
        <span className="w-12 h-12" />
      )}
      <span className="pointer-events-auto bg-white/95 shadow-md rounded-full px-4 py-2 text-sm font-bold text-neutral-600 tabular-nums">
        {current} / {total}
      </span>
      {next ? (
        <Link
          href={next}
          aria-label="Next page"
          className="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-2xl font-bold text-neutral-700 hover:text-[var(--color-hoda-orange)] transition"
        >
          ›
        </Link>
      ) : (
        <span className="w-12 h-12" />
      )}
    </div>
  );
}
