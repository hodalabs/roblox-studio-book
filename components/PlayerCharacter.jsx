"use client";
// Classic Roblox R6 character. Group origin sits at the feet (y = 0).
// All parts are positioned relative to that origin so callers just set group.position to the feet location.

const FACE_INK = "#1a1f2c";

export default function PlayerCharacter({
  shirtColor = "#2a9df4",
  pantsColor = "#3a5a78",
  skinColor = "#ffc73d",
  facing = 0, // radians, rotation around Y
}) {
  return (
    <group rotation={[0, facing, 0]}>
      {/* Legs */}
      <mesh position={[-0.25, 0.4, 0]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.6]} />
        <meshStandardMaterial color={pantsColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.25, 0.4, 0]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.6]} />
        <meshStandardMaterial color={pantsColor} roughness={0.7} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[1.0, 1.0, 0.6]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.7, 1.3, 0]} castShadow>
        <boxGeometry args={[0.4, 1.0, 0.6]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.7, 1.3, 0]} castShadow>
        <boxGeometry args={[0.4, 1.0, 0.6]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.6]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
      {/* Face: eyes + smile, very slightly in front of the head's +Z face */}
      <mesh position={[-0.16, 2.22, 0.301]}>
        <boxGeometry args={[0.1, 0.1, 0.005]} />
        <meshBasicMaterial color={FACE_INK} />
      </mesh>
      <mesh position={[0.16, 2.22, 0.301]}>
        <boxGeometry args={[0.1, 0.1, 0.005]} />
        <meshBasicMaterial color={FACE_INK} />
      </mesh>
      <mesh position={[0, 2.0, 0.301]}>
        <boxGeometry args={[0.28, 0.05, 0.005]} />
        <meshBasicMaterial color={FACE_INK} />
      </mesh>
      {/* Smile corners (small uptick at each end) */}
      <mesh position={[-0.16, 2.025, 0.301]}>
        <boxGeometry args={[0.05, 0.06, 0.005]} />
        <meshBasicMaterial color={FACE_INK} />
      </mesh>
      <mesh position={[0.16, 2.025, 0.301]}>
        <boxGeometry args={[0.05, 0.06, 0.005]} />
        <meshBasicMaterial color={FACE_INK} />
      </mesh>
    </group>
  );
}
