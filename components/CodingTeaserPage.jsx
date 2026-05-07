export default function CodingTeaserPage() {
  return (
    <article
      className="coding-teaser-page mx-auto flex flex-col"
      style={{
        width: "148mm",
        height: "210mm",
        background: "#0f1624",
        padding: "20mm 16mm",
        color: "white",
      }}
    >
      <div
        className="font-display font-black tracking-[0.35em] uppercase text-[10pt] text-center"
        style={{ color: "var(--color-hoda-blue)" }}
      >
        What's next
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="font-display font-black text-[42pt] leading-[0.95] tracking-tight mb-5">
          Ready to write
          <br />
          your first code?
        </h1>

        <p className="text-[13pt] leading-[1.5] max-w-[110mm] opacity-85 mb-10">
          You can build worlds now. Time to make them move.
          <br />
          Learn to script Roblox games, one keystroke at a time.
        </p>

        <img
          src="/qr-roblox-typer.png"
          alt="QR code to hoda.link/roblox-studio-typer"
          style={{
            width: "60mm",
            height: "60mm",
            background: "white",
            padding: "4mm",
            borderRadius: "8px",
          }}
        />

        <div className="mt-6 font-mono text-[11pt] opacity-90">
          hoda.link/roblox-studio-typer
        </div>
      </div>

      <div
        className="font-display font-black text-[10pt] tracking-[0.3em] uppercase text-center"
        style={{ color: "var(--color-hoda-blue)" }}
      >
        Hoda Computer
      </div>
    </article>
  );
}
