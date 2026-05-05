"use client";
import { Edges } from "@react-three/drei";
import { resolveMaterial } from "@/lib/materials";

const HODA_ORANGE = "#ff6b35";

/**
 * One Roblox Part rendered as a real 3D mesh.
 * Same prop API as the SVG Block — position, size, color, material, transparency, canCollide, reflectance.
 * Roblox and Three.js both use +Y up, so coords pass through directly.
 */
export default function Block3D({
  position = [0, 0, 0],
  size = [1, 1, 1],
  color,
  material = "plastic",
  transparency = 0,
  canCollide = true,
  reflectance = 0,
  rotation,
}) {
  const m = resolveMaterial(color, material);
  const opacity = 1 - transparency;
  const isInvisible = transparency >= 0.99;
  const isGhost = !canCollide;

  const roughness = m.glow ? 0.4 : material === "metal" ? 0.3 : 0.75;
  const metalness = reflectance > 0
    ? Math.min(0.9, reflectance)
    : material === "metal" ? 0.6 : 0.05;

  // Ghost (CanCollide off): the visual cue is a bright orange wireframe
  // plus the block rendered semi-transparent so kids can SEE that it's "not really there."
  if (isGhost && !isInvisible) {
    return (
      <mesh position={position} rotation={rotation} castShadow={false} receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={m.color}
          roughness={roughness}
          transparent
          opacity={Math.min(opacity, 0.45)}
        />
        <Edges color={HODA_ORANGE} linewidth={3} threshold={1} />
      </mesh>
    );
  }

  if (isInvisible && isGhost) {
    return (
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={size} />
        <meshBasicMaterial visible={false} />
        <Edges color={HODA_ORANGE} linewidth={2} threshold={1} />
      </mesh>
    );
  }

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={m.color}
        roughness={roughness}
        metalness={metalness}
        transparent={opacity < 1 || m.glow}
        opacity={opacity}
        emissive={m.glow ? m.color : "#000000"}
        emissiveIntensity={m.glow ? 0.7 : 0}
      />
      <Edges color="#1a1f2c" threshold={1} />
    </mesh>
  );
}
