export default function ChallengePage({ challenge }) {
  const { number, title, story, slug, steps = [], doneWhen, scene } = challenge;

  return (
    <article
      className="challenge-page mx-auto bg-white text-[var(--color-ink)] shadow-sm flex flex-col"
      style={{ width: "148mm", height: "210mm", padding: "10mm 11mm" }}
    >
      <header className="flex items-baseline justify-between mb-1">
        <span className="text-[10pt] font-black uppercase tracking-widest text-[var(--color-hoda-orange)]">
          Level {String(number).padStart(2, "0")}
        </span>
        <span className="text-[8pt] text-neutral-300 font-bold">{number} / 30</span>
      </header>

      <h1 className="text-[34pt] font-black leading-[1.05] tracking-tight">{title}</h1>
      <p className="mt-0 mb-2 italic text-[12pt] text-neutral-500">{story}</p>

      {scene && scene.blocks ? (
        <div
          className="rounded-2xl overflow-hidden mb-3"
          style={{
            background: scene.background || "#eaf4ff",
            flex: "0 0 auto",
            height: "95mm",
          }}
        >
          <img
            src={`/scenes/${slug}.png`}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      ) : (
        <div
          className="rounded-2xl border-2 border-dashed border-neutral-200 mb-3 flex items-center justify-center text-neutral-400 text-[10pt]"
          style={{ height: "95mm" }}
        >
          Visual coming
        </div>
      )}

      <ol className="space-y-2 mb-3 flex-1">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-[12pt]"
              style={{ background: "var(--color-hoda-orange)" }}
            >
              {i + 1}
            </span>
            <span className="text-[14pt] leading-snug font-bold pt-[2px]">{s}</span>
          </li>
        ))}
      </ol>

      <div
        className="rounded-xl px-3 py-2 flex items-center gap-3"
        style={{
          background: "var(--color-hoda-green)15",
          borderLeft: "4px solid var(--color-hoda-green)",
        }}
      >
        <span
          className="text-[8pt] font-black uppercase tracking-widest"
          style={{ color: "var(--color-hoda-green)" }}
        >
          Done when
        </span>
        <span className="text-[11pt] font-semibold leading-snug">{doneWhen}</span>
      </div>
    </article>
  );
}
