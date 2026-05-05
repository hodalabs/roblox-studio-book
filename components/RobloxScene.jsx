import { project, depthKey } from "@/lib/isometric";
import Block from "./Block";
import { Annotations } from "./Annotations";

/**
 * Container that lays out Block children in isometric space.
 * Pass `blocks`: an array of Block prop objects.
 * Pass `annotations`: array of arrow/tag/step overlays (drawn on top of blocks).
 */
export default function RobloxScene({
  blocks = [],
  annotations = [],
  scale = 28,
  className = "",
  background = "#eaf4ff",
}) {
  // Back-to-front sort
  const sorted = [...blocks].sort((a, b) => {
    const ap = a.position || [0, 0, 0];
    const bp = b.position || [0, 0, 0];
    return depthKey(ap[0], ap[1], ap[2]) - depthKey(bp[0], bp[1], bp[2]);
  });

  // Compute viewBox by projecting every corner of every block.
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const b of sorted) {
    const [px, py, pz] = b.position || [0, 0, 0];
    const [sx, sy, sz] = b.size || [1, 1, 1];
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const corners = [
      [px - hx, py - hy, pz - hz], [px + hx, py - hy, pz - hz],
      [px - hx, py + hy, pz - hz], [px + hx, py + hy, pz - hz],
      [px - hx, py - hy, pz + hz], [px + hx, py - hy, pz + hz],
      [px - hx, py + hy, pz + hz], [px + hx, py + hy, pz + hz],
    ];
    for (const c of corners) {
      const p = project(c[0], c[1], c[2], scale);
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
  }

  if (!isFinite(minX)) {
    minX = -100; minY = -100; maxX = 100; maxY = 100;
  }

  // Extra room for annotations (tags, arrows) that float beyond block bounds
  const padding = annotations.length > 0 ? 70 : 24;
  const viewW = maxX - minX + padding * 2;
  const viewH = maxY - minY + padding * 2;
  const viewBox = `${minX - padding} ${minY - padding} ${viewW} ${viewH}`;

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ background, display: "block", width: "100%", height: "auto" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="8" refY="5"
          markerWidth="7" markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff6b35" />
        </marker>
      </defs>
      {sorted.map((b, i) => (
        <Block key={i} {...b} scale={scale} />
      ))}
      <Annotations items={annotations} scale={scale} />
    </svg>
  );
}
