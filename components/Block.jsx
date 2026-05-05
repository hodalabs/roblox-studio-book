import { blockCorners, toPolygonPoints } from "@/lib/isometric";
import { resolveMaterial, shade } from "@/lib/materials";

// Face shading factors. Top = brightest, then "front" (z+), then "right" (x+).
const FACE = { top: 1.0, front: 0.82, right: 0.66 };

/**
 * One Roblox Part rendered in isometric SVG.
 * Props mirror the Roblox Properties panel 1:1.
 *
 * @param {[number,number,number]} position - Roblox Position (X, Y, Z) in studs
 * @param {[number,number,number]} size     - Roblox Size in studs
 * @param {string}  color        - hex color, overrides material default
 * @param {string}  material     - plastic | neon | wood | brick | grass | ice | metal | slate | marble | glass | lava | sand
 * @param {number}  transparency - 0 (solid) to 1 (invisible)
 * @param {boolean} canCollide   - false renders dashed outline (the "ghost" property cue)
 * @param {number}  reflectance  - 0 to 1, adds a sheen highlight
 * @param {number}  scale        - pixels per stud
 */
export default function Block({
  position = [0, 0, 0],
  size = [1, 1, 1],
  color,
  material = "plastic",
  transparency = 0,
  canCollide = true,
  reflectance = 0,
  scale = 30,
}) {
  const m = resolveMaterial(color, material);
  const c = blockCorners(position, size);

  const opacity = 1 - transparency;
  const isInvisible = transparency >= 0.99;
  const isGhost = !canCollide;

  const topColor = shade(m.color, FACE.top);
  const frontColor = shade(m.color, FACE.front);
  const rightColor = shade(m.color, FACE.right);

  const stroke = isInvisible
    ? "rgba(40, 40, 60, 0.5)"
    : "rgba(0, 0, 0, 0.45)";
  const strokeWidth = isGhost ? 1.6 : 0.6;
  const dash = isGhost ? "5,4" : undefined;
  const filter = m.glow ? "url(#neonGlow)" : undefined;

  // If both invisible AND ghost, render only the dashed outline of the silhouette.
  if (isInvisible && isGhost) {
    return (
      <g>
        <polygon
          points={toPolygonPoints([c.BTL, c.BTR, c.FTR, c.FTL], scale)}
          fill="none" stroke={stroke} strokeWidth={1.4} strokeDasharray="5,4"
        />
        <polygon
          points={toPolygonPoints([c.BBR, c.FBR, c.FTR, c.BTR], scale)}
          fill="none" stroke={stroke} strokeWidth={1.4} strokeDasharray="5,4"
        />
        <polygon
          points={toPolygonPoints([c.FBL, c.FBR, c.FTR, c.FTL], scale)}
          fill="none" stroke={stroke} strokeWidth={1.4} strokeDasharray="5,4"
        />
      </g>
    );
  }

  return (
    <g filter={filter}>
      <polygon
        points={toPolygonPoints([c.BTL, c.BTR, c.FTR, c.FTL], scale)}
        fill={topColor} fillOpacity={opacity}
        stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash}
      />
      <polygon
        points={toPolygonPoints([c.BBR, c.FBR, c.FTR, c.BTR], scale)}
        fill={rightColor} fillOpacity={opacity}
        stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash}
      />
      <polygon
        points={toPolygonPoints([c.FBL, c.FBR, c.FTR, c.FTL], scale)}
        fill={frontColor} fillOpacity={opacity}
        stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash}
      />
      {m.sheen > 0 && !isInvisible && (
        <polygon
          points={toPolygonPoints([c.BTL, c.BTR, c.FTR, c.FTL], scale)}
          fill="white" fillOpacity={m.sheen * opacity * 0.4}
          pointerEvents="none"
        />
      )}
      {reflectance > 0 && !isInvisible && (
        <polygon
          points={toPolygonPoints([c.BTL, c.BTR, c.FTR, c.FTL], scale)}
          fill="white" fillOpacity={reflectance * 0.5 * opacity}
          pointerEvents="none"
        />
      )}
    </g>
  );
}
