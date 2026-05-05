// Each material maps to a default color + a visual finish (glow, sheen, dashed lines, etc).
// User-supplied `color` overrides the material's default color.

export const MATERIALS = {
  plastic: { color: null, glow: false, sheen: 0 },
  neon:    { color: null, glow: true,  sheen: 0 },
  wood:    { color: "#8b5a2b", glow: false, sheen: 0 },
  brick:   { color: "#a8423a", glow: false, sheen: 0 },
  grass:   { color: "#4a7c2e", glow: false, sheen: 0 },
  ice:     { color: "#a8d8e6", glow: false, sheen: 0.3 },
  metal:   { color: "#9aa0a6", glow: false, sheen: 0.4 },
  slate:   { color: "#5a6470", glow: false, sheen: 0 },
  marble:  { color: "#e8e4d0", glow: false, sheen: 0.2 },
  glass:   { color: "#cfe6f5", glow: false, sheen: 0.3 },
  lava:    { color: "#e85500", glow: true,  sheen: 0 },
  sand:    { color: "#dec78b", glow: false, sheen: 0 },
};

export function resolveMaterial(color, material = "plastic") {
  const def = MATERIALS[material] || MATERIALS.plastic;
  return {
    color: color || def.color || "#a4a4a4",
    glow: def.glow,
    sheen: def.sheen,
  };
}

export function shade(hex, factor) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return `rgb(${clamp(r * factor)}, ${clamp(g * factor)}, ${clamp(b * factor)})`;
}
