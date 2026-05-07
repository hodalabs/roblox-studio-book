import { notFound } from "next/navigation";
import { challenges } from "@/content/challenges";
import CoverPage from "@/components/CoverPage";
import MessagePage from "@/components/MessagePage";
import CodingTeaserPage from "@/components/CodingTeaserPage";
import ChallengePage from "@/components/ChallengePage";
import BookNav from "@/components/BookNav";

const TOTAL = challenges.length + 3; // cover + message + N + coding teaser

export function generateStaticParams() {
  return Array.from({ length: TOTAL }, (_, i) => ({ n: String(i + 1) }));
}

export default async function BookReader({ params }) {
  const { n } = await params;
  const page = parseInt(n, 10);
  if (!page || page < 1 || page > TOTAL) notFound();

  let content;
  if (page === 1) {
    content = <CoverPage />;
  } else if (page === 2) {
    content = <MessagePage />;
  } else if (page === TOTAL) {
    content = <CodingTeaserPage />;
  } else {
    const ch = challenges[page - 3];
    content = <ChallengePage challenge={ch} total={challenges.length} live />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-8 pb-24">
      <div style={{ transform: "scale(1)", transformOrigin: "center" }}>
        {content}
      </div>
      <BookNav current={page} total={TOTAL} />
    </main>
  );
}
