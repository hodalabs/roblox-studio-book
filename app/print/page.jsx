import { challenges } from "@/content/challenges";
import ChallengePage from "@/components/ChallengePage";

export const metadata = {
  title: "Roblox Studio Book — Print",
};

export default function PrintAll() {
  // For PDF export. Pages with `scene.blocks` are full demos; the rest still print
  // with placeholder visuals so the kid sees a consistent book layout.
  return (
    <div>
      {challenges.map((c, i) => (
        <div key={c.slug} className={i < challenges.length - 1 ? "page-break" : ""}>
          <ChallengePage challenge={c} />
        </div>
      ))}
    </div>
  );
}
