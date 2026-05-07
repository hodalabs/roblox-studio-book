export default function MessagePage() {
  return (
    <article
      className="message-page mx-auto flex flex-col"
      style={{
        width: "148mm",
        height: "210mm",
        background: "#ffffff",
        padding: "16mm 14mm",
        color: "var(--color-ink)",
      }}
    >
      <div className="flex gap-5 items-start mb-5">
        <img
          src="/rafid.jpg"
          alt="Rafid Hoda"
          style={{
            width: "38mm",
            height: "44mm",
            objectFit: "cover",
            borderRadius: "10px",
            flexShrink: 0,
          }}
        />
        <h1 className="font-display font-black text-[19pt] leading-[1.15]">
          Use this book to connect with your child.
        </h1>
      </div>

      <div className="space-y-3 text-[11.5pt] leading-[1.5] text-neutral-700">
        <p>
          This book is designed to create mini games inside of Roblox Studio
          that don&apos;t take more than 10 mins a day. If you sit with your
          child for just 10 mins a day and try to finish one of these
          challenges you will start feeling quite comfortable in Roblox Studio
          by the end.
        </p>
        <p>
          Spending some time each day will also build a consistency that kids
          lack these days. Building something every day.
        </p>
        <p>Good luck and I hope you have lots of fun.</p>
        <p className="pt-2 text-neutral-600 italic">
          Scan the QR code below to access the web version which has
          interactive 3D models with animations.
        </p>
      </div>

      <div className="mt-auto pt-6 flex items-end justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/qr-roblox-book.png"
            alt="QR code to hoda.link/roblox-studio-book"
            style={{ width: "26mm", height: "26mm" }}
          />
          <div className="text-[10pt] leading-snug">
            <div className="font-display font-black uppercase tracking-wider text-[8pt] text-neutral-500 mb-1">
              Web version
            </div>
            <div className="font-mono text-[9pt] text-neutral-700">
              hoda.link/roblox-studio-book
            </div>
          </div>
        </div>
        <div className="text-[11pt] text-neutral-500 italic">Rafid Hoda</div>
      </div>
    </article>
  );
}
