"use client";
import { Edges } from "@react-three/drei";
import { resolveMaterial } from "@/lib/materials";

const HODA_ORANGE = "#ff6b35";

function Geometry({ shape, size }) {
  const [w, h, d] = size;
  if (shape === "sphere") {
    return <sphereGeometry args={[w / 2, 32, 24]} />;
  }
  if (shape === "cylinder") {
    return <cylinderGeometry args={[w / 2, w / 2, h, 32]} />;
  }
  if (shape === "cone") {
    return <coneGeometry args={[w / 2, h, 32]} />;
  }
  return <boxGeometry args={[w, h, d]} />;
}

/**
 * One Roblox Part rendered as a real 3D mesh.
 * Same prop API as the SVG Block, plus a `shape` field for non-box primitives.
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
  shape = "block",
}) {
  const m = resolveMaterial(color, material);
  const opacity = 1 - transparency;
  const isInvisible = transparency >= 0.99;
  const isGhost = !canCollide;
  const showEdges = shape === "block";

  const roughness = m.glow ? 0.4 : material === "metal" ? 0.3 : 0.75;
  const metalness = reflectance > 0
    ? Math.min(0.9, reflectance)
    : material === "metal" ? 0.6 : 0.05;

  if (isGhost && !isInvisible) {
    return (
      <mesh position={position} rotation={rotation} castShadow={false} receiveShadow>
        <Geometry shape={shape} size={size} />
        <meshStandardMaterial
          color={m.color}
          roughness={roughness}
          transparent
          opacity={Math.min(opacity, 0.45)}
        />
        {showEdges && <Edges color={HODA_ORANGE} linewidth={3} threshold={1} />}
      </mesh>
    );
  }

  if (isInvisible && isGhost) {
    return (
      <mesh position={position} rotation={rotation}>
        <Geometry shape={shape} size={size} />
        <meshBasicMaterial visible={false} />
        {showEdges && <Edges color={HODA_ORANGE} linewidth={2} threshold={1} />}
      </mesh>
    );
  }

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <Geometry shape={shape} size={size} />
      <meshStandardMaterial
        color={m.color}
        roughness={roughness}
        metalness={metalness}
        transparent={opacity < 1 || m.glow}
        opacity={opacity}
        emissive={m.glow ? m.color : "#000000"}
        emissiveIntensity={m.glow ? 0.7 : 0}
      />
      {showEdges && <Edges color="#1a1f2c" threshold={1} />}
    </mesh>
  );
}
