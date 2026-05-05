import { project } from "@/lib/isometric";

/**
 * A curved arrow drawn between two 3D points (Roblox studs).
 * Used to show motion (player walking through a gap, etc).
 */
export function Arrow({ from, to, scale = 28, color = "#ff6b35", curve = 0.35, dashed = false }) {
  const a = project(from[0], from[1], from[2], scale);
  const b = project(to[0], to[1], to[2], scale);
  // Control point: midpoint pulled toward the camera (negative y on screen) for a nice arc
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  // Perpendicular pulled "up" on screen
  const cx = mid.x + (-dy / len) * len * curve;
  const cy = mid.y + (dx / len) * len * curve - 8;
  const path = `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={dashed ? "6,5" : undefined}
        markerEnd="url(#arrowhead)"
      />
    </g>
  );
}

/**
 * A property tag pointing at a 3D-anchored point.
 * Shows the Roblox Property name and its new value, like a Studio tooltip.
 */
export function PropertyTag({
  position,
  property,
  value,
  scale = 28,
  offset = [40, -50],
  accent = "#ff6b35",
}) {
  const p = project(position[0], position[1], position[2], scale);
  const tagX = p.x + offset[0];
  const tagY = p.y + offset[1];
  const text = `${property} = ${value}`;
  // Estimate text width so we can size the box (px per char at 11pt)
  const w = Math.max(70, text.length * 6.6 + 14);
  const h = 22;
  return (
    <g>
      <line
        x1={p.x} y1={p.y}
        x2={tagX} y2={tagY + h / 2}
        stroke={accent} strokeWidth={1.5} strokeLinecap="round"
      />
      <circle cx={p.x} cy={p.y} r={3} fill={accent} />
      <rect
        x={tagX} y={tagY}
        width={w} height={h}
        rx={5} ry={5}
        fill="white" stroke={accent} strokeWidth={1.5}
      />
      <text
        x={tagX + w / 2}
        y={tagY + h / 2 + 4}
        textAnchor="middle"
        fontSize={11}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill="#1a1f2c"
        fontWeight={700}
      >
        {text}
      </text>
    </g>
  );
}

/**
 * A circled step number anchored at a 3D point.
 */
export function StepNumber({ position, n, scale = 28, color = "#2a9df4" }) {
  const p = project(position[0], position[1], position[2], scale);
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={12} fill={color} />
      <text
        x={p.x} y={p.y + 4}
        textAnchor="middle"
        fontSize={13}
        fontWeight={900}
        fill="white"
        fontFamily="Nunito, sans-serif"
      >
        {n}
      </text>
    </g>
  );
}

export function Annotations({ items = [], scale = 28 }) {
  return (
    <g>
      {items.map((a, i) => {
        if (a.type === "arrow") return <Arrow key={i} {...a} scale={scale} />;
        if (a.type === "tag") return <PropertyTag key={i} {...a} scale={scale} />;
        if (a.type === "step") return <StepNumber key={i} {...a} scale={scale} />;
        return null;
      })}
    </g>
  );
}
