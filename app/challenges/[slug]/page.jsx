import { notFound } from "next/navigation";
import Link from "next/link";
import { challenges, getChallenge } from "@/content/challenges";
import InteractiveScene from "@/components/InteractiveScene";
import FeedbackArea from "@/components/FeedbackArea";

const STEP_COLORS = ["#ff6b35", "#2a9df4", "#4ec76d", "#ffc73d"];

export function generateStaticParams() {
  return challenges.map((c) => ({ slug: c.slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const challenge = getChallenge(slug);
  if (!challenge) notFound();

  const idx = challenges.findIndex((c) => c.slug === slug);
  const prev = idx > 0 ? challenges[idx - 1] : null;
  const next = idx < challenges.length - 1 ? challenges[idx + 1] : null;
  const { number, title, story, steps = [], doneWhen, scene } = challenge;

  return (
    <main className="py-8 px-4">
      <nav className="no-print max-w-3xl mx-auto mb-4 flex justify-between items-center text-sm">
        <Link href="/" className="text-neutral-500 hover:text-[var(--color-hoda-orange)]">
          ← All challenges
        </Link>
        <div className="flex gap-3">
          {prev && (
            <Link href={`/challenges/${prev.slug}`} className="text-neutral-500 hover:text-[var(--color-hoda-orange)]">
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link href={`/challenges/${next.slug}`} className="text-neutral-500 hover:text-[var(--color-hoda-orange)]">
              {next.title} →
            </Link>
          )}
        </div>
      </nav>

      <div className="rsb-content">
      <article className="bg-white rounded-3xl shadow-md overflow-hidden border-2 border-[var(--color-hoda-orange)]/20">
        {/* Branded top strip */}
        <div className="px-8 md:px-10 py-3 flex items-center justify-between"
             style={{ background: "var(--color-hoda-orange)" }}>
          <span className="font-display font-bold text-white tracking-wider uppercase text-sm">
            Roblox Studio Book
          </span>
          <span className="font-display font-bold text-white text-sm">
            Page {number} of 30
          </span>
        </div>

        <div className="p-8 md:p-10">
          {/* Big level badge + title */}
          <div className="flex items-center gap-3 mb-2">
            <span
              className="font-display font-bold text-white text-base px-3 py-1 rounded-full"
              style={{ background: "var(--color-hoda-blue)" }}
            >
              Level {String(number).padStart(2, "0")}
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-1">
            {title}
          </h1>
          <p className="text-lg text-neutral-500 mb-6 italic">{story}</p>

          {scene && scene.blocks ? (
            <div className="mb-6">
              <InteractiveScene scene={scene} />
              <div className="text-xs text-neutral-400 mt-2 text-right italic no-print">
                Drag to rotate. Scroll to zoom.
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl border-2 border-dashed border-neutral-200 mb-6 flex items-center justify-center text-neutral-400"
              style={{ height: "320px" }}
            >
              Visual coming
            </div>
          )}

          <ol className="space-y-4 mb-7">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white font-display font-bold text-xl shadow-sm"
                  style={{ background: STEP_COLORS[i % STEP_COLORS.length] }}
                >
                  {i + 1}
                </span>
                <span className="text-xl leading-snug font-bold pt-1">{s}</span>
              </li>
            ))}
          </ol>

          <div
            className="rounded-2xl px-5 py-4 flex items-center gap-4"
            style={{
              background: "rgba(78, 199, 109, 0.12)",
              border: "2px solid var(--color-hoda-green)",
            }}
          >
            <span
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-2xl"
              style={{ background: "var(--color-hoda-green)" }}
            >
              ✓
            </span>
            <div>
              <div
                className="text-xs font-display font-bold uppercase tracking-widest mb-0.5"
                style={{ color: "var(--color-hoda-green)" }}
              >
                You did it when
              </div>
              <div className="text-base font-bold leading-snug">{doneWhen}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 md:px-10 py-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50">
          <span className="text-xs text-neutral-400 font-display font-bold tracking-wide uppercase">
            hoda labs
          </span>
          <div className="flex gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: i < number ? "var(--color-hoda-orange)" : "#e5e5e5",
                }}
              />
            ))}
          </div>
        </div>
      </article>
        <FeedbackArea slug={slug} number={number} title={title} />
      </div>
    </main>
  );
}
