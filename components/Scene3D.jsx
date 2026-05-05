"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import Block3D from "./Block3D";
import PlayerCharacter from "./PlayerCharacter";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Animated R6 character. Reads timeline keyframes and interpolates each frame.
 * Position values in timeline are FEET positions (group origin sits at the floor).
 * For static scenes, pass a single-keyframe timeline.
 */
function AnimatedPlayer({ player, playing, onComplete }) {
  const groupRef = useRef();
  const startTime = useRef(null);
  const wasPlaying = useRef(false);
  const completed = useRef(false);

  const setPos = (x, y, z) => {
    if (!groupRef.current) return;
    groupRef.current.position.set(x, y, z);
  };

  useFrame(({ clock }) => {
    if (!playing || !player.timeline || player.timeline.length < 2) {
      startTime.current = null;
      wasPlaying.current = false;
      completed.current = false;
      const [x, y, z] = player.timeline[0].position;
      setPos(x, y, z);
      return;
    }

    if (!wasPlaying.current) {
      startTime.current = clock.elapsedTime;
      wasPlaying.current = true;
      completed.current = false;
    }

    const t = clock.elapsedTime - startTime.current;
    const total = player.timeline[player.timeline.length - 1].t;

    if (t >= total) {
      const last = player.timeline[player.timeline.length - 1].position;
      setPos(...last);
      if (!completed.current) {
        completed.current = true;
        onComplete?.();
      }
      return;
    }

    let i = 0;
    while (i < player.timeline.length - 1 && player.timeline[i + 1].t <= t) i++;
    const a = player.timeline[i];
    const b = player.timeline[Math.min(i + 1, player.timeline.length - 1)];
    const dt = b.t - a.t;
    const localT = dt > 0 ? (t - a.t) / dt : 0;

    setPos(
      lerp(a.position[0], b.position[0], localT),
      lerp(a.position[1], b.position[1], localT),
      lerp(a.position[2], b.position[2], localT),
    );
  });

  return (
    <group ref={groupRef}>
      <PlayerCharacter
        shirtColor={player.shirtColor}
        pantsColor={player.pantsColor}
        skinColor={player.skinColor}
        facing={player.facing}
      />
    </group>
  );
}

/**
 * Real-3D version of RobloxScene. Same `blocks` prop API.
 * `tags` are floating Studio-style property labels.
 * `player` is an animated character with a timeline.
 * `playing` triggers playback.
 */
export default function Scene3D({
  blocks = [],
  tags = [],
  player,
  playing = false,
  onComplete,
  height = "420px",
  background = "#eaf4ff",
  cameraPosition = [12, 11, 14],
  target = [0, 2, 0],
}) {
  return (
    <div style={{ width: "100%", height, background, borderRadius: "1rem", overflow: "hidden" }}>
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov: 35, near: 0.1, far: 200 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <color attach="background" args={[background]} />
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[10, 18, 8]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />
        <directionalLight position={[-8, 6, -8]} intensity={0.25} />
        <ContactShadows
          position={[0, -0.05, 0]}
          opacity={0.35}
          scale={50}
          blur={2}
          far={20}
        />
        {blocks.map((b, i) => (
          <Block3D key={i} {...b} />
        ))}
        {player && (
          <AnimatedPlayer player={player} playing={playing} onComplete={onComplete} />
        )}
        {tags.map((t, i) => (
          <Html
            key={i}
            position={t.position}
            center
            style={{ pointerEvents: "none" }}
          >
            <div
              style={{
                background: "white",
                border: "1.5px solid #ff6b35",
                borderRadius: 6,
                padding: "4px 8px",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 11,
                fontWeight: 700,
                color: "#1a1f2c",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                transform: `translate(${t.offsetX || 0}px, ${t.offsetY || -10}px)`,
              }}
            >
              {t.property} = {t.value}
            </div>
          </Html>
        ))}
        <OrbitControls
          target={target}
          enablePan={false}
          minDistance={6}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
    </div>
  );
}
