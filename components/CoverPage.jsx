export default function CoverPage() {
  return (
    <article
      className="cover-page mx-auto flex flex-col items-center justify-between"
      style={{
        width: "148mm",
        height: "210mm",
        background: "#0f1624",
        padding: "18mm 14mm",
        color: "white",
      }}
    >
      <div
        className="font-display font-bold tracking-[0.35em] uppercase text-[10pt]"
        style={{ color: "var(--color-hoda-blue)" }}
      >
        Hoda Computer
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="font-display font-bold text-[18pt] tracking-[0.3em] uppercase mb-4 opacity-70">
          30 Days of
        </div>
        <h1 className="font-display font-bold text-[64pt] leading-[0.92] tracking-tight uppercase">
          Roblox
          <br />
          Studio
        </h1>

        <div className="my-9 flex gap-3">
          <span
            className="block w-12 h-12 rounded-md"
            style={{ background: "var(--color-hoda-yellow)" }}
          />
          <span
            className="block w-12 h-12 rounded-md"
            style={{ background: "var(--color-hoda-blue)" }}
          />
          <span
            className="block w-12 h-12 rounded-md"
            style={{ background: "var(--color-hoda-green)" }}
          />
        </div>

        <p className="text-[15pt] font-display font-medium leading-snug max-w-[100mm] opacity-85">
          Build your first real game,
          <br />
          one block at a time.
        </p>
      </div>

      <div className="font-display font-bold text-[14pt] tracking-[0.25em] uppercase">
        By Rafid Hoda
      </div>
    </article>
  );
}
