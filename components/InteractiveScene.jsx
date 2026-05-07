"use client";
import { useState } from "react";
import Scene3D from "./Scene3D";

/**
 * Wraps Scene3D with a Play/Replay button when the scene includes an animated player.
 */
export default function InteractiveScene({ scene, height = "480px" }) {
  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handlePlay = () => {
    setHasPlayed(false);
    setPlaying(false);
    requestAnimationFrame(() => setPlaying(true));
  };

  const handleStop = () => {
    setPlaying(false);
    setHasPlayed(false);
  };

  const onComplete = () => {
    setPlaying(false);
    setHasPlayed(true);
  };

  return (
    <div className="relative">
      <Scene3D
        blocks={scene.blocks}
        tags={scene.tags || []}
        player={scene.player}
        playing={playing}
        onComplete={onComplete}
        background={scene.background || "#eaf4ff"}
        cameraPosition={scene.cameraPosition}
        target={scene.target}
        height={height}
      />
      {scene.player && scene.player.timeline && scene.player.timeline.length > 1 && (
        <div className="absolute bottom-4 left-4 flex gap-2 no-print">
          {playing ? (
            <button
              onClick={handleStop}
              className="px-4 py-2 rounded-full bg-white text-[var(--color-ink)] font-bold shadow-md hover:shadow-lg transition border border-neutral-200"
            >
              ◼ Stop
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="px-5 py-2 rounded-full text-white font-black shadow-md hover:shadow-lg transition flex items-center gap-2"
              style={{ background: "var(--color-hoda-orange)" }}
            >
              {hasPlayed ? "↻ Replay" : "▶ Play"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
