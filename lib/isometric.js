// Isometric projection that mirrors Roblox Studio's default camera angle.
// Roblox axes: +X right, +Y up, +Z toward viewer.
// Screen is right-handed iso (30deg).

const COS30 = Math.cos(Math.PI / 6); // 0.866
const SIN30 = Math.sin(Math.PI / 6); // 0.5

export function project(x, y, z, scale = 30) {
  return {
    x: (x - z) * COS30 * scale,
    y: (x + z) * SIN30 * scale - y * scale,
  };
}

// Painter's-algorithm key. Lower = farther from camera, drawn first.
// (x + z) is depth into scene; y as tiny tiebreaker so stacked blocks order correctly.
export function depthKey(x, y, z) {
  return (x + z) * 1000 + y;
}

export function blockCorners([px, py, pz], [sx, sy, sz]) {
  const hx = sx / 2, hy = sy / 2, hz = sz / 2;
  return {
    BBL: [px - hx, py - hy, pz - hz],
    BBR: [px + hx, py - hy, pz - hz],
    BTL: [px - hx, py + hy, pz - hz],
    BTR: [px + hx, py + hy, pz - hz],
    FBL: [px - hx, py - hy, pz + hz],
    FBR: [px + hx, py - hy, pz + hz],
    FTL: [px - hx, py + hy, pz + hz],
    FTR: [px + hx, py + hy, pz + hz],
  };
}

export function toPolygonPoints(points3d, scale) {
  return points3d
    .map((p) => {
      const proj = project(p[0], p[1], p[2], scale);
      return `${proj.x.toFixed(2)},${proj.y.toFixed(2)}`;
    })
    .join(" ");
}
