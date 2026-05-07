import { challenges } from "@/content/challenges";
import ChallengePage from "@/components/ChallengePage";
import CoverPage from "@/components/CoverPage";
import MessagePage from "@/components/MessagePage";
import CodingTeaserPage from "@/components/CodingTeaserPage";

export const metadata = {
  title: "Roblox Studio Book: Print",
};

// 2mm print bleed on every page. Page becomes 152x214mm; the printer
// trims to 148x210mm, leaving the bg color flush to every edge.
function bleedStyle(bg) {
  return {
    width: "152mm",
    height: "214mm",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

export default function PrintAll() {
  const total = challenges.length;
  return (
    <div>
      <div className="page-break" style={bleedStyle("#0f1624")}>
        <CoverPage />
      </div>
      <div className="page-break" style={bleedStyle("#ffffff")}>
        <MessagePage />
      </div>
      {challenges.map((c) => (
        <div key={c.slug} className="page-break" style={bleedStyle("#ffffff")}>
          <ChallengePage challenge={c} total={total} />
        </div>
      ))}
      <div style={bleedStyle("#0f1624")}>
        <CodingTeaserPage />
      </div>
    </div>
  );
}
