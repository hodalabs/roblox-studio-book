import { challenges } from "@/content/challenges";
import ChallengePage from "@/components/ChallengePage";
import CoverPage from "@/components/CoverPage";

export const metadata = {
  title: "Roblox Studio Book — Print",
};

export default function PrintAll() {
  return (
    <div>
      <div className="page-break">
        <CoverPage />
      </div>
      {challenges.map((c, i) => (
        <div key={c.slug} className={i < challenges.length - 1 ? "page-break" : ""}>
          <ChallengePage challenge={c} />
        </div>
      ))}
    </div>
  );
}
