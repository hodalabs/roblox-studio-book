// All 30 challenges. Each one short enough for an 8yo to scan.
// `steps` are 3-4 imperatives. `scene.blocks` builds the goal state.
// `scene.tags` adds floating Studio-style property labels.
// `scene.player` is a Roblox-style R6 character (timeline keyframes for animation).

const PLAYER = { shirtColor: "#2a9df4", pantsColor: "#3a5a78", skinColor: "#ffc73d" };
const player = (position) => ({ ...PLAYER, timeline: [{ t: 0, position }] });

const FLOOR = "#cfd5dc";
const STONE = "#9aa3ad";
const WOOD = "#8b5a2b";

// Jay's review notes — pulled from Supabase 2026-05-07. Snapshot, baked in for review.
// `verdict`: fine | tweak | broken | confusing | cut
const JAY_FEEDBACK = {
  "spawn-room": {
    verdict: "fine",
    note: "The build is fine, we could probably reiterate on this in the future by adding a point light or a light source in the neon block itself, and change its properties.",
  },
  "show-off-three": {
    verdict: "fine",
    note: "This is also fine.",
  },
  "fake-wall": {
    verdict: "fine",
    note: "This is fine too.",
  },
  "the-window": {
    verdict: "fine",
    note: "This is fine too.",
  },
  "ghost-door": {
    verdict: "broken",
    note: "This visually doesn't make a difference? It's the same as if the part isn't there, unless you meant to make it CanCollide = true?",
  },
  "hall-of-mirrors": {
    verdict: "broken",
    note: "You won't be able to see yourself with the reflectance property, and it's something that's rarely used in games. However for slight visual effects it's fine, reflectance usually reflects the skybox and that's it.",
  },
  "material-gallery": {
    verdict: "tweak",
    note: "This is fine, just might be visually misleading because in Roblox the output won't be the same.",
  },
  "glass-house": {
    verdict: "fine",
    note: "This is fine.",
  },
  "stained-glass": {
    verdict: "fine",
    note: "This is fine too.",
  },
  "ice-slide": {
    verdict: "broken",
    note: "You won't slide down just because the block's material is ice.",
  },
  "treasure-room": {
    verdict: "tweak",
    note: "This is alright, I would probably make the gold Neon and a dark yellow color, it looks more cartoonish and better.",
  },
  "lava-pit": {
    verdict: "fine",
    note: "This is fine, I suppose coding on this part will be done later.",
  },
  "glowing-path": {
    verdict: "tweak",
    note: "This is fine too, it might be confusing for them to what Lighting is. I'd add a visual of the explorer tab to show them + a visual of the properties tab to find brightness.",
  },
  "precise-bridge": {
    verdict: "confusing",
    note: "This is confusing. I'm not sure myself how this would work. The distance between the 2 blocks is not specified, maybe ask them to change to a specific position, but even then this is a big jump from what was being done previously. Should add filler lessons in between where you teach them how to change size and position using the properties tab.",
  },
  "tilted-tower": {
    verdict: "confusing",
    note: "This is a bit confusing and a big jump again in my opinion. There should be some practice with changing things from the properties tab first.",
  },
  "paper-bridge": {
    verdict: "confusing",
    note: "This is also confusing — not sure what \"find it from the side, walk across\" means. Plus the previous feedback I had on the bridge thing.",
  },
  "giant-door": {
    verdict: "tweak",
    note: "This is better, would add a visual of where to find the Size property.",
  },
  "decorations": {
    verdict: "tweak",
    note: "This is getting a bit repetitive but it's alright. I guess it's slight practice. The visuals aren't so pleasing though, should probably come up with a better layout.",
  },
  "first-script": {
    verdict: "cut",
    note: "This is alright, however the Output is a very overwhelming tool to enable, it's a lot of unnecessary text. Sometimes the print gets lost in other things in the output, so we should probably come up with a better first script.\n\nscript.Parent.Transparency = 0.5\nscript.Parent.BrickColor = BrickColor.new(\"Really red\")\nscript.Parent.BrickColor = BrickColor.Random()\n\nHere are better options.",
  },
  "auto-color": {
    verdict: "cut",
    note: "Start with BrickColor, then introduce the 3-parameter RGB type Color3.new().",
  },
  "kill-brick": {
    verdict: "cut",
    note: "This is a really big jump, too complex even. It will just be a copy paste type / I don't know what's happening type of situation. Unless that's alright. These instructions are not clear, should add code that they can copy and paste probably.",
  },
  "real-lava": {
    verdict: "cut",
    note: "That's alright.",
  },
  "disappearing-platform": {
    verdict: "cut",
    note: "Still a bit complex, would have to include copy paste code. CanCollide = false by script is fine.",
  },
  "hidden-trap": {
    verdict: "cut",
    note: "This is a bit confusing, maybe add color notes on the blocks to achieve what we're trying to do.",
  },
  "boss-room": {
    verdict: "cut",
    note: "We didn't really go over AssemblyLinearVelocity, that could probably be a better lesson, unless the kids already know how to do that. A disappearing platform is going to be very complicated to do. Ghost wall is fine, kill brick with copy paste code is fine.",
  },
  "finish-line": {
    verdict: "fine",
    note: "Yep this is fine.",
  },
  "sounds": {
    verdict: "cut",
    note: "I would teach them how to add music to the game, which is done by adding a sound from the toolbox in SoundService, then set the looped and playing property to true. That has to be done here too — the looped and playing property — so this has to be explained better. Where do you get the sound? Why are we introducing SoundIds? etc.",
  },
  "polish-pass": {
    verdict: "tweak",
    note: "This is fine, introduce lights (they go inside of blocks).",
  },
  "publish": {
    verdict: "tweak",
    note: "This is fine, just needs better instructions. I would make this into 3 steps: save to roblox, fill out questionnaire, go to the settings page and make it public and save.",
  },
  "show-your-parent": {
    verdict: "tweak",
    note: "They won't be able to find the link just like that either, need specific instructions on this.",
  },
};

const _challenges = [
  {
    number: 1,
    slug: "spawn-room",
    title: "The Spawn Room",
    story: "Every obby needs a start.",
    steps: [
      "Drop a SpawnLocation in the world.",
      "Build a small room around it: floor, four walls, ceiling.",
      "Add a glowing neon block on the ceiling.",
    ],
    doneWhen: "You press Play and land inside a tidy little room.",
    scene: {
      cameraPosition: [5, 4.5, 14],
      target: [0, 2, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [10, 0.4, 10], material: "grass" },
        { position: [0, 2.5, -5], size: [10, 5, 0.4], color: "#f5f1e6", material: "plastic" },
        { position: [-5, 2.5, 0], size: [0.4, 5, 10], color: "#f5f1e6", material: "plastic" },
        { position: [5, 2.5, 0], size: [0.4, 5, 10], color: "#f5f1e6", material: "plastic" },
        { position: [0, 5, 0], size: [10, 0.4, 10], color: "#f5f1e6", material: "plastic" },
        { position: [0, 4.65, 0], size: [2.2, 0.3, 2.2], color: "#ffe066", material: "neon" },
        { position: [0, 0.3, 0], size: [3, 0.15, 3], color: "#2a9df4", material: "plastic" },
      ],
      player: player([0, 0.38, 0]),
    },
  },
  {
    number: 2,
    slug: "show-off-three",
    title: "Show Off",
    story: "Three obstacles. Show what you know.",
    steps: [
      "Build a hallway out the door.",
      "Add a trampoline, a conveyor, and an escalator in a row.",
      "Use AssemblyLinearVelocity for all three.",
    ],
    doneWhen: "You run through all three without falling.",
    scene: {
      cameraPosition: [16, 11, 18],
      target: [1, 1.5, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [20, 0.3, 5], color: FLOOR, material: "slate" },
        { position: [-5, 0.45, 0], size: [3, 0.3, 3], color: "#ff6b35", material: "neon" },
        { position: [0, 0.2, 0], size: [4, 0.15, 3], color: "#3f4853", material: "metal" },
        { position: [5.2, 1.65, 0], size: [5, 0.4, 3], rotation: [0, 0, Math.PI / 6], color: STONE, material: "metal" },
        { position: [9, 2.9, 0], size: [3, 0.3, 3], color: FLOOR, material: "slate" },
      ],
      tags: [
        { position: [-5, 2.2, 0],  property: "Trampoline", value: "✓", offsetY: -16 },
        { position: [0, 1.5, 0],   property: "Conveyor",   value: "✓", offsetY: -16 },
        { position: [5.2, 3.4, 0], property: "Escalator",  value: "✓", offsetY: -16 },
      ],
      player: {
        ...PLAYER,
        facing: -Math.PI / 2,
        timeline: [
          { t: 0.0, position: [-9, 0.15, 0] },
          { t: 0.9, position: [-5, 0.15, 0] },
          { t: 1.1, position: [-5, 0.6, 0] },
          { t: 1.7, position: [-3.0, 3.6, 0] },
          { t: 2.2, position: [-2, 0.275, 0] },
          { t: 3.2, position: [2, 0.275, 0] },
          { t: 3.5, position: [3, 0.6, 0] },
          { t: 4.7, position: [7.0, 2.9, 0] },
          { t: 5.2, position: [9, 3.05, 0] },
        ],
      },
    },
  },
  {
    number: 3,
    slug: "fake-wall",
    title: "The Fake Wall",
    story: "Looks solid. It isn't.",
    steps: [
      "Build a wall with 6 tall gray blocks side by side.",
      "Click the middle block.",
      "In Properties, turn off CanCollide.",
      "Walk straight through it.",
    ],
    doneWhen: "The wall looks normal but you walk through the middle.",
    scene: {
      scale: 22,
      cameraPosition: [12, 11, 14],
      target: [0, 2, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [16, 0.4, 6], color: FLOOR, material: "slate" },
        { position: [-5, 2.5, -1.5], size: [2, 5, 1], color: STONE, material: "slate" },
        { position: [-3, 2.5, -1.5], size: [2, 5, 1], color: STONE, material: "slate" },
        { position: [-1, 2.5, -1.5], size: [2, 5, 1], color: STONE, material: "slate", canCollide: false },
        { position: [1, 2.5, -1.5],  size: [2, 5, 1], color: STONE, material: "slate" },
        { position: [3, 2.5, -1.5],  size: [2, 5, 1], color: STONE, material: "slate" },
        { position: [5, 2.5, -1.5],  size: [2, 5, 1], color: STONE, material: "slate" },
      ],
      tags: [
        { position: [-1, 5.7, -1.5], property: "CanCollide", value: "false", offsetY: -10 },
      ],
      player: player([-1, 0.2, 2.4]),
    },
  },
  {
    number: 4,
    slug: "the-window",
    title: "The Window",
    story: "Let players peek ahead.",
    steps: [
      "Build a corridor after the fake wall.",
      "Make the far wall one big block.",
      "Set its Transparency to 0.5.",
    ],
    doneWhen: "You see the next obstacle through the wall.",
    scene: {
      cameraPosition: [10, 5.5, 12],
      target: [0, 2, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [12, 0.4, 6], color: FLOOR, material: "slate" },
        { position: [-4, 2.5, -2], size: [2, 5, 0.5], color: STONE, material: "slate" },
        { position: [-2, 2.5, -2], size: [2, 5, 0.5], color: STONE, material: "slate" },
        { position: [0, 2.5, -2], size: [2, 5, 0.5], color: "#cfe6f5", transparency: 0.5 },
        { position: [2, 2.5, -2], size: [2, 5, 0.5], color: STONE, material: "slate" },
        { position: [4, 2.5, -2], size: [2, 5, 0.5], color: STONE, material: "slate" },
      ],
      tags: [{ position: [0, 5.4, -2], property: "Transparency", value: "0.5" }],
      player: player([0, 0.2, 2]),
    },
  },
  {
    number: 5,
    slug: "ghost-door",
    title: "The Ghost Door",
    story: "A door that isn't there.",
    steps: [
      "Place a brown Wood block in the doorway.",
      "Turn off CanCollide.",
      "Set Transparency to 1.",
    ],
    doneWhen: "You walk through an empty-looking opening.",
    scene: {
      cameraPosition: [10, 5.5, 12],
      target: [0, 2, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [12, 0.4, 5], color: FLOOR, material: "slate" },
        { position: [-3.5, 2.5, -1.5], size: [3, 5, 0.5], color: WOOD, material: "wood" },
        { position: [3.5, 2.5, -1.5], size: [3, 5, 0.5], color: WOOD, material: "wood" },
        { position: [0, 4.5, -1.5], size: [2, 1, 0.5], color: WOOD, material: "wood" },
        { position: [0, 1.75, -1.5], size: [2, 3.5, 0.5], color: WOOD, material: "wood", canCollide: false, transparency: 1 },
      ],
      tags: [{ position: [0, 5.5, -1.5], property: "CanCollide", value: "false" }],
      player: player([0, 0.2, 1.5]),
    },
  },
  {
    number: 6,
    slug: "hall-of-mirrors",
    title: "Hall of Mirrors",
    story: "See yourself everywhere.",
    steps: [
      "Build a small square room.",
      "Set Reflectance to 1 on every wall.",
      "Crank the lights.",
    ],
    doneWhen: "You see your character bouncing around the walls.",
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 2, 0],
      background: "#fff8e7",
      blocks: [
        { position: [0, 0, 0], size: [8, 0.4, 8], color: FLOOR, material: "slate" },
        { position: [-4, 2.5, 0], size: [0.4, 5, 8], color: "#9aa0a6", material: "metal", reflectance: 1 },
        { position: [4, 2.5, 0], size: [0.4, 5, 8], color: "#9aa0a6", material: "metal", reflectance: 1 },
        { position: [0, 2.5, -4], size: [8, 5, 0.4], color: "#9aa0a6", material: "metal", reflectance: 1 },
      ],
      tags: [{ position: [-4, 5.5, 0], property: "Reflectance", value: "1" }],
      player: player([0, 0.2, 0]),
    },
  },
  {
    number: 7,
    slug: "material-gallery",
    title: "Material Gallery",
    story: "One color. Eight materials.",
    steps: [
      "Build a corridor with eight blocks in a row.",
      "Make them all the same color.",
      "Pick a different Material for each: Wood, Brick, Grass, Ice, Metal, Slate, Marble, Glass.",
    ],
    doneWhen: "Eight same-colored blocks all look different.",
    scene: {
      cameraPosition: [13, 6, 14],
      target: [0, 1.2, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [16, 0.4, 4], color: FLOOR, material: "slate" },
        { position: [-7, 1.5, 0], size: [1.5, 2.5, 1], material: "wood" },
        { position: [-5, 1.5, 0], size: [1.5, 2.5, 1], material: "brick" },
        { position: [-3, 1.5, 0], size: [1.5, 2.5, 1], material: "grass" },
        { position: [-1, 1.5, 0], size: [1.5, 2.5, 1], material: "ice" },
        { position: [1, 1.5, 0], size: [1.5, 2.5, 1], material: "metal" },
        { position: [3, 1.5, 0], size: [1.5, 2.5, 1], material: "slate" },
        { position: [5, 1.5, 0], size: [1.5, 2.5, 1], material: "marble" },
        { position: [7, 1.5, 0], size: [1.5, 2.5, 1], material: "glass", transparency: 0.3 },
      ],
      player: player([-9, 0.2, 1]),
    },
  },
  {
    number: 8,
    slug: "glass-house",
    title: "Glass House",
    story: "A see-through house.",
    steps: [
      "Build a small house: walls and roof.",
      "Set every wall to Transparency 0.4 with a faint blue color.",
      "Inside, put one bright Neon yellow block as a lamp.",
    ],
    doneWhen: "You can see the lamp glowing from outside.",
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 2, 0],
      background: "#fff8e7",
      blocks: [
        { position: [0, 0, 0], size: [10, 0.4, 8], color: FLOOR, material: "slate" },
        { position: [-2.5, 2, -2], size: [5, 4, 0.3], color: "#cfe6f5", transparency: 0.4 },
        { position: [-5, 2, 0], size: [0.3, 4, 4], color: "#cfe6f5", transparency: 0.4 },
        { position: [0, 2, 0], size: [0.3, 4, 4], color: "#cfe6f5", transparency: 0.4 },
        { position: [-2.5, 4.15, 0], size: [5, 0.3, 4], color: "#cfe6f5", transparency: 0.4 },
        { position: [-2.5, 3.5, 0], size: [1.2, 0.4, 1.2], color: "#ffe066", material: "neon" },
      ],
      tags: [{ position: [-2.5, 4.7, -2], property: "Transparency", value: "0.4" }],
      player: player([3, 0.2, 1]),
    },
  },
  {
    number: 9,
    slug: "stained-glass",
    title: "Stained Glass",
    story: "A church-style window.",
    steps: [
      "Build a wall with a 4-block grid in the middle.",
      "Set every grid block to Transparency 0.5.",
      "Color each one differently: red, blue, green, yellow.",
    ],
    doneWhen: "Colored light patterns shine through the wall.",
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 2, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [12, 0.4, 6], color: FLOOR, material: "slate" },
        { position: [-4.5, 2.5, -2], size: [3, 5, 0.5], color: STONE, material: "slate" },
        { position: [4.5, 2.5, -2], size: [3, 5, 0.5], color: STONE, material: "slate" },
        { position: [0, 4.5, -2], size: [6, 1, 0.5], color: STONE, material: "slate" },
        { position: [0, 0.5, -2], size: [6, 1, 0.5], color: STONE, material: "slate" },
        { position: [-1.5, 3, -2], size: [1.4, 1.4, 0.4], color: "#e63946", transparency: 0.5 },
        { position: [0, 3, -2], size: [1.4, 1.4, 0.4], color: "#2a9df4", transparency: 0.5 },
        { position: [1.5, 3, -2], size: [1.4, 1.4, 0.4], color: "#4ec76d", transparency: 0.5 },
        { position: [-1.5, 1.6, -2], size: [1.4, 1.4, 0.4], color: "#ffc73d", transparency: 0.5 },
        { position: [0, 1.6, -2], size: [1.4, 1.4, 0.4], color: "#a06cd5", transparency: 0.5 },
        { position: [1.5, 1.6, -2], size: [1.4, 1.4, 0.4], color: "#ff6b35", transparency: 0.5 },
      ],
      player: player([0, 0.2, 1.5]),
    },
  },
  {
    number: 10,
    slug: "ice-slide",
    title: "Ice Slide",
    story: "Slippery as soap.",
    steps: [
      "Build a sloped tunnel.",
      "Set every block's Material to Ice.",
      "Make sure the slope goes down.",
    ],
    doneWhen: "You step on it and slide all the way down.",
    scene: {
      cameraPosition: [11, 5, 13],
      target: [0, 1.5, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [14, 0.4, 5], color: FLOOR, material: "slate" },
        { position: [-3, 1.5, 0], size: [9, 0.5, 3.5], rotation: [0, 0, -Math.PI / 9], material: "ice" },
        { position: [-7, 0.7, 0], size: [2, 1, 3.5], material: "ice" },
      ],
      tags: [{ position: [0, 3.2, 0], property: "Material", value: "Ice" }],
      player: player([-7, 1.4, 0]),
    },
  },
  {
    number: 11,
    slug: "treasure-room",
    title: "Treasure Room",
    story: "A pile of gold.",
    steps: [
      "Stack small yellow-gold blocks in a small room.",
      "Set Material to Marble.",
      "Set Reflectance to 0.5.",
      "Add a neon yellow block above for spotlight glow.",
    ],
    doneWhen: "The room sparkles when you walk in.",
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 1.5, 0],
      background: "#fff8e7",
      blocks: [
        { position: [0, 0, 0], size: [10, 0.4, 8], color: FLOOR, material: "slate" },
        { position: [-2, 0.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [-1, 0.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [0, 0.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [1, 0.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [2, 0.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [-1.5, 1.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [-0.5, 1.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [0.5, 1.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [1.5, 1.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [-1, 2.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [0, 2.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        { position: [1, 2.7, -2], size: [1, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
        // Spotlight
        { position: [0, 4.5, -2], size: [3, 0.3, 1], color: "#ffe066", material: "neon" },
      ],
      tags: [{ position: [3, 1.5, -2], property: "Reflectance", value: "0.5" }],
      player: player([3, 0.2, 1.5]),
    },
  },
  {
    number: 12,
    slug: "lava-pit",
    title: "Lava Pit",
    story: "A pool of fake lava.",
    steps: [
      "Dig a section of floor lower than the rest.",
      "Fill it with a flat block, Material Lava, color red-orange.",
      "Add three small floating jump blocks across.",
    ],
    doneWhen: "The pit looks scary and you can jump across.",
    scene: {
      cameraPosition: [12, 6, 13],
      target: [0, 0.8, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [-6, 0, 0], size: [4, 0.4, 5], color: FLOOR, material: "slate" },
        { position: [6, 0, 0], size: [4, 0.4, 5], color: FLOOR, material: "slate" },
        // Lava pool (flush with ground level)
        { position: [0, 0.1, 0], size: [8, 0.2, 5], color: "#e85500", material: "lava" },
        // Jump blocks
        { position: [-3, 0.7, 0], size: [1.2, 0.4, 1.2], color: "#9aa3ad", material: "metal" },
        { position: [0, 0.7, 0], size: [1.2, 0.4, 1.2], color: "#9aa3ad", material: "metal" },
        { position: [3, 0.7, 0], size: [1.2, 0.4, 1.2], color: "#9aa3ad", material: "metal" },
      ],
      tags: [{ position: [0, 1.5, 0], property: "Material", value: "Lava" }],
      player: player([-6, 0.2, 1.5]),
    },
  },
  {
    number: 13,
    slug: "glowing-path",
    title: "Glowing Path",
    story: "Light the way.",
    steps: [
      "Set Lighting.Brightness to 0.5.",
      "Place a row of bright neon blocks on the floor.",
      "Follow the path through the dim hallway.",
    ],
    doneWhen: "The path glows like runway lights.",
    scene: {
      cameraPosition: [12, 6, 13],
      target: [0, 1, 0],
      background: "#1a1f2c",
      blocks: [
        { position: [0, 0, 0], size: [14, 0.4, 4], color: "#2a2f3c", material: "slate" },
        { position: [-3, 2, -2], size: [10, 4, 0.4], color: "#3f4853", material: "slate" },
        // Neon path lights
        { position: [-5, 0.3, 0], size: [1, 0.2, 1], color: "#ffc73d", material: "neon" },
        { position: [-3, 0.3, 0], size: [1, 0.2, 1], color: "#ff6b35", material: "neon" },
        { position: [-1, 0.3, 0], size: [1, 0.2, 1], color: "#ffc73d", material: "neon" },
        { position: [1, 0.3, 0], size: [1, 0.2, 1], color: "#ff6b35", material: "neon" },
        { position: [3, 0.3, 0], size: [1, 0.2, 1], color: "#ffc73d", material: "neon" },
        { position: [5, 0.3, 0], size: [1, 0.2, 1], color: "#ff6b35", material: "neon" },
      ],
      tags: [{ position: [0, 1.4, 0], property: "Material", value: "Neon" }],
      player: player([-6.5, 0.2, 1]),
    },
  },
  {
    number: 14,
    slug: "precise-bridge",
    title: "Precise Bridge",
    story: "Type the numbers in.",
    steps: [
      "Use ONE block to bridge a gap.",
      "In Properties, type Size: 20, 1, 4.",
      "Set Position to the exact middle of the gap.",
    ],
    doneWhen: "The bridge fits perfectly without eyeballing.",
    scene: {
      cameraPosition: [13, 6, 14],
      target: [0, 0.8, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [-7, 0, 0], size: [3, 0.4, 5], color: FLOOR, material: "slate" },
        { position: [7, 0, 0], size: [3, 0.4, 5], color: FLOOR, material: "slate" },
        // The single bridge block
        { position: [0, 0.7, 0], size: [12, 0.5, 3], color: WOOD, material: "wood" },
      ],
      tags: [{ position: [0, 1.5, 0], property: "Size", value: "(12, 0.5, 3)" }],
      player: player([-7, 0.2, 1.5]),
    },
  },
  {
    number: 15,
    slug: "tilted-tower",
    title: "Tilted Tower",
    story: "A tower that leans.",
    steps: [
      "Stack five blocks.",
      "On block 2, type Orientation 0, 0, 15.",
      "Block 3: 0, 0, 30. Keep going.",
    ],
    doneWhen: "Your tower leans like Pisa.",
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 2.5, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [10, 0.4, 6], color: FLOOR, material: "slate" },
        { position: [0, 0.7, 0], size: [2, 1, 2], color: "#a8423a", material: "brick" },
        { position: [0.1, 1.7, 0], size: [2, 1, 2], color: "#a8423a", material: "brick", rotation: [0, 0, -0.1] },
        { position: [0.3, 2.7, 0], size: [2, 1, 2], color: "#a8423a", material: "brick", rotation: [0, 0, -0.2] },
        { position: [0.55, 3.7, 0], size: [2, 1, 2], color: "#a8423a", material: "brick", rotation: [0, 0, -0.3] },
        { position: [0.85, 4.7, 0], size: [2, 1, 2], color: "#a8423a", material: "brick", rotation: [0, 0, -0.4] },
      ],
      tags: [{ position: [1.2, 5.5, 0], property: "Orientation.Z", value: "-30°" }],
      player: player([-3, 0.2, 1.5]),
    },
  },
  {
    number: 16,
    slug: "paper-bridge",
    title: "Paper Bridge",
    story: "So thin you might miss it.",
    steps: [
      "Place ONE block across the gap.",
      "Set Size to 10, 0.1, 2.",
      "Find it from the side. Walk across.",
    ],
    doneWhen: "Hard to spot from the side. Solid to walk on.",
    scene: {
      cameraPosition: [12, 5, 13],
      target: [0, 0.8, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [-6, 0, 0], size: [3, 0.4, 4], color: FLOOR, material: "slate" },
        { position: [6, 0, 0], size: [3, 0.4, 4], color: FLOOR, material: "slate" },
        { position: [0, 0.5, 0], size: [10, 0.1, 2], color: "#f5f1e6", material: "plastic" },
      ],
      tags: [{ position: [0, 1.5, 0], property: "Size", value: "(10, 0.1, 2)" }],
      player: player([-6, 0.2, 1.5]),
    },
  },
  {
    number: 17,
    slug: "giant-door",
    title: "Giant Door",
    story: "Bigger than the player.",
    steps: [
      "Place ONE block.",
      "Set Size to 10, 20, 1.",
      "Color it red.",
      "Turn off CanCollide so you walk under.",
    ],
    doneWhen: "A door three times your height looms over you.",
    scene: {
      cameraPosition: [14, 12, 16],
      target: [0, 6, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [16, 0.4, 6], color: FLOOR, material: "slate" },
        { position: [0, 7, -1], size: [10, 14, 1], color: "#e63946", material: "plastic", canCollide: false, transparency: 0.15 },
      ],
      tags: [{ position: [0, 14.5, -1], property: "Size", value: "(10, 20, 1)" }],
      player: player([0, 0.2, 2]),
    },
  },
  {
    number: 18,
    slug: "decorations",
    title: "Decorations",
    story: "Make it look real.",
    steps: [
      "Walk through your obby.",
      "Replace gray walls with Wood, Brick, or Slate.",
      "Add neon ceiling lights.",
      "Add a few transparent blocks as windows.",
    ],
    doneWhen: "It looks like a place, not a sandbox.",
    scene: {
      cameraPosition: [11, 6, 13],
      target: [0, 2, 0],
      background: "#fff8e7",
      blocks: [
        { position: [0, 0, 0], size: [14, 0.4, 6], material: "grass" },
        // Brick wall section
        { position: [-4, 2, -2], size: [4, 4, 0.4], material: "brick" },
        // Wood door
        { position: [-1, 1.5, -2], size: [2, 3, 0.4], material: "wood" },
        // Stained glass window
        { position: [2, 2.5, -2], size: [3, 2, 0.4], color: "#cfe6f5", transparency: 0.4 },
        // Neon ceiling lights
        { position: [-4, 4.5, 0], size: [2, 0.2, 0.5], color: "#ffe066", material: "neon" },
        { position: [0, 4.5, 0], size: [2, 0.2, 0.5], color: "#ffe066", material: "neon" },
        { position: [4, 4.5, 0], size: [2, 0.2, 0.5], color: "#ffe066", material: "neon" },
        // Roof beam
        { position: [0, 4.8, -2], size: [14, 0.3, 0.4], material: "wood" },
      ],
      player: player([4, 0.2, 1.5]),
    },
  },
  {
    number: 19,
    slug: "first-script",
    title: "Your First Script",
    story: "Time to type code.",
    steps: [
      "Click any block. Right-click. Insert Object. Script.",
      'Delete the default text. Type: print("Hi!").',
      "Press Play. Open View → Output.",
    ],
    doneWhen: 'You see "Hi!" in the Output window.',
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 1.5, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [10, 0.4, 6], color: FLOOR, material: "slate" },
        { position: [0, 1.5, 0], size: [2, 2, 2], color: "#2a9df4", material: "plastic" },
      ],
      tags: [
        { position: [0, 3.2, 0], property: "Script", value: 'print("Hi!")' },
      ],
      player: player([3, 0.2, 1.5]),
    },
  },
  {
    number: 20,
    slug: "auto-color",
    title: "Auto-Color Block",
    story: "A block paints itself.",
    steps: [
      "Insert a Script into a block.",
      "Type: script.Parent.Color = Color3.new(1, 0, 0).",
      "Press Play.",
    ],
    doneWhen: "The block paints itself red the moment Play starts.",
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 1.5, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [10, 0.4, 6], color: FLOOR, material: "slate" },
        { position: [0, 1.5, 0], size: [2, 2, 2], color: "#e63946", material: "plastic" },
      ],
      tags: [
        { position: [0, 3.2, 0], property: "Color", value: "(1, 0, 0)" },
      ],
      player: player([3, 0.2, 1.5]),
    },
  },
  {
    number: 21,
    slug: "kill-brick",
    title: "Kill Brick",
    story: "The most famous Roblox script.",
    steps: [
      "Insert a Script into a red block.",
      "Use a Touched event.",
      "Inside it: hit.Parent.Humanoid.Health = 0.",
    ],
    doneWhen: "Stepping on the block kills you instantly.",
    scene: {
      cameraPosition: [10, 5, 12],
      target: [0, 0.5, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [12, 0.4, 5], color: FLOOR, material: "slate" },
        { position: [0, 0.4, 0], size: [3, 0.5, 3], color: "#e63946", material: "neon" },
      ],
      tags: [{ position: [0, 1.6, 0], property: "Touched", value: "Health = 0" }],
      player: player([-4, 0.2, 1.5]),
    },
  },
  {
    number: 22,
    slug: "real-lava",
    title: "Real Lava",
    story: "Make the lava deadly.",
    steps: [
      "Go back to your lava pit (Level 12).",
      "Add the kill brick script to the lava block.",
      "Test it. Try not to die.",
    ],
    doneWhen: "Falling in the lava actually kills you.",
    scene: {
      cameraPosition: [12, 6, 13],
      target: [0, 0.8, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [-6, 0, 0], size: [4, 0.4, 5], color: FLOOR, material: "slate" },
        { position: [6, 0, 0], size: [4, 0.4, 5], color: FLOOR, material: "slate" },
        { position: [0, 0.1, 0], size: [8, 0.2, 5], color: "#e85500", material: "lava" },
        { position: [-3, 0.7, 0], size: [1.2, 0.4, 1.2], color: "#9aa3ad", material: "metal" },
        { position: [0, 0.7, 0], size: [1.2, 0.4, 1.2], color: "#9aa3ad", material: "metal" },
        { position: [3, 0.7, 0], size: [1.2, 0.4, 1.2], color: "#9aa3ad", material: "metal" },
      ],
      tags: [{ position: [0, 1.5, 0], property: "Touched", value: "Health = 0" }],
      player: player([-6, 0.2, 1.5]),
    },
  },
  {
    number: 23,
    slug: "disappearing-platform",
    title: "Disappearing Platform",
    story: "Step on it. It vanishes.",
    steps: [
      "Insert a Script into a platform.",
      "On Touched, set Transparency = 1.",
      "Also set CanCollide = false.",
    ],
    doneWhen: "The platform vanishes under your feet.",
    scene: {
      cameraPosition: [11, 5, 12],
      target: [0, 1, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [-5, 0, 0], size: [3, 0.4, 4], color: FLOOR, material: "slate" },
        { position: [5, 0, 0], size: [3, 0.4, 4], color: FLOOR, material: "slate" },
        { position: [-1.5, 0.7, 0], size: [2, 0.4, 3], color: "#2a9df4", material: "plastic" },
        { position: [1.5, 0.7, 0], size: [2, 0.4, 3], color: "#2a9df4", material: "plastic", transparency: 0.6 },
      ],
      tags: [{ position: [1.5, 1.6, 0], property: "Transparency", value: "1" }],
      player: player([-5, 0.2, 1.5]),
    },
  },
  {
    number: 24,
    slug: "hidden-trap",
    title: "Hidden Trap",
    story: "Looks innocent. Isn't.",
    steps: [
      "Build one block that looks like the surrounding floor.",
      "Add a kill-brick script.",
      "Surround it with five safe blocks that look the same.",
    ],
    doneWhen: "Players step on it the first time.",
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 0.4, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [-2.5, 0.2, 0], size: [1.5, 0.4, 1.5], color: WOOD, material: "wood" },
        { position: [-1, 0.2, 0], size: [1.5, 0.4, 1.5], color: WOOD, material: "wood" },
        { position: [0.5, 0.2, 0], size: [1.5, 0.4, 1.5], color: WOOD, material: "wood" },
        { position: [2, 0.2, 0], size: [1.5, 0.4, 1.5], color: WOOD, material: "wood" },
        { position: [3.5, 0.2, 0], size: [1.5, 0.4, 1.5], color: WOOD, material: "wood" },
        { position: [-1, 0.2, -1.5], size: [1.5, 0.4, 1.5], color: WOOD, material: "wood" },
        { position: [0.5, 0.2, -1.5], size: [1.5, 0.4, 1.5], color: WOOD, material: "wood" },
        { position: [2, 0.2, -1.5], size: [1.5, 0.4, 1.5], color: WOOD, material: "wood" },
      ],
      tags: [{ position: [0.5, 1.4, 0], property: "Trap", value: "Health = 0" }],
      player: player([-3, 0.4, 1.5]),
    },
  },
  {
    number: 25,
    slug: "boss-room",
    title: "Boss Room",
    story: "Combine your favorites.",
    steps: [
      "Add a trampoline to launch you up.",
      "Add a disappearing platform you must land on quickly.",
      "Add a ghost wall you walk through.",
      "Add a kill brick to dodge.",
    ],
    doneWhen: "Beating it feels hard but fair.",
    scene: {
      cameraPosition: [14, 8, 15],
      target: [0, 2, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [16, 0.4, 7], color: FLOOR, material: "slate" },
        // Trampoline
        { position: [-6, 0.45, 0], size: [2.5, 0.3, 2.5], color: "#ff6b35", material: "neon" },
        // Disappearing platform mid-air
        { position: [-2, 3, 0], size: [2, 0.3, 2], color: "#2a9df4", transparency: 0.5 },
        // Kill brick
        { position: [2, 0.45, 0], size: [2, 0.3, 2.5], color: "#e63946", material: "neon" },
        // Ghost wall
        { position: [5.5, 2.5, 0], size: [1, 5, 3], color: STONE, material: "slate", canCollide: false, transparency: 0.4 },
        // End platform
        { position: [7.5, 0.4, 0], size: [2, 0.4, 3], color: FLOOR, material: "slate" },
      ],
      tags: [
        { position: [-6, 1.5, 0], property: "Trampoline" },
        { position: [-2, 4, 0], property: "Vanish" },
        { position: [2, 1.5, 0], property: "Kill" },
        { position: [5.5, 5.5, 0], property: "Ghost" },
      ],
      player: player([-7.5, 0.2, 2.5]),
    },
  },
  {
    number: 26,
    slug: "finish-line",
    title: "The Finish Line",
    story: "Every obby ends.",
    steps: [
      "Build a small platform at the very end.",
      "Spell THE END with neon blocks above it.",
      "Make it glow.",
    ],
    doneWhen: "Stepping on it feels like victory.",
    scene: {
      cameraPosition: [10, 6, 12],
      target: [0, 2.5, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [10, 0.4, 6], material: "grass" },
        // Victory podium
        { position: [0, 0.5, 0], size: [4, 0.3, 4], color: "#ffc73d", material: "neon" },
        // Glowing arch banners
        { position: [-3, 4, -1.5], size: [0.5, 5, 0.5], color: "#ff6b35", material: "neon" },
        { position: [3, 4, -1.5], size: [0.5, 5, 0.5], color: "#ff6b35", material: "neon" },
        { position: [0, 6, -1.5], size: [6.5, 0.5, 0.5], color: "#ff6b35", material: "neon" },
        // Confetti blocks floating
        { position: [-2, 5, 0], size: [0.4, 0.4, 0.4], color: "#2a9df4", material: "neon" },
        { position: [-1, 5.3, 0], size: [0.4, 0.4, 0.4], color: "#4ec76d", material: "neon" },
        { position: [1, 5.2, 0], size: [0.4, 0.4, 0.4], color: "#a06cd5", material: "neon" },
        { position: [2, 5, 0], size: [0.4, 0.4, 0.4], color: "#ffc73d", material: "neon" },
      ],
      tags: [{ position: [0, 6.8, -1.5], property: "THE END", value: "🎉" }],
      player: player([0, 0.65, 0]),
    },
  },
  {
    number: 27,
    slug: "sounds",
    title: "Sounds",
    story: "Pick a block. Give it a noise.",
    steps: [
      "Find a block that needs a sound (trampoline, kill brick, finish line).",
      "Add a Sound object with a SoundId.",
      "Play it on Touched.",
    ],
    doneWhen: "Something in your obby makes a satisfying noise.",
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 1.2, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [10, 0.4, 6], color: FLOOR, material: "slate" },
        { position: [0, 0.95, 0], size: [2.5, 1.5, 2.5], color: "#a06cd5", material: "neon" },
      ],
      tags: [
        { position: [0, 2.4, 0], property: "Sound", value: "♪ ♫" },
      ],
      player: player([3, 0.2, 1.5]),
    },
  },
  {
    number: 28,
    slug: "polish-pass",
    title: "Polish Pass",
    story: "Fix what's ugly.",
    steps: [
      "Play your obby start to finish.",
      "Plain blocks become materials.",
      "Empty corners get neon.",
      "Long sections get a window.",
    ],
    doneWhen: "You feel proud playing through it.",
    scene: {
      cameraPosition: [12, 6, 14],
      target: [0, 2, 0],
      background: "#fff8e7",
      blocks: [
        { position: [0, 0, 0], size: [16, 0.4, 6], material: "grass" },
        // Brick castle wall
        { position: [-5, 2.5, -2], size: [4, 5, 0.5], material: "brick" },
        // Glass window in the wall
        { position: [-5, 3, -2], size: [2, 1.5, 0.6], color: "#cfe6f5", transparency: 0.4 },
        // Wood door
        { position: [-1.5, 1.5, -2], size: [2, 3, 0.5], material: "wood" },
        // Stone arch
        { position: [3, 2.5, -2], size: [3, 5, 0.5], material: "slate" },
        // Neon trim
        { position: [-5, 5.2, -2], size: [4, 0.3, 0.6], color: "#ffe066", material: "neon" },
        { position: [3, 5.2, -2], size: [3, 0.3, 0.6], color: "#ffe066", material: "neon" },
        // Treasure chest detail
        { position: [5, 0.7, 0], size: [1.5, 1, 1], color: "#d4af37", material: "marble", reflectance: 0.5 },
      ],
      player: player([-2, 0.2, 1.5]),
    },
  },
  {
    number: 29,
    slug: "publish",
    title: "Publish",
    story: "Put it on Roblox.",
    steps: [
      "File → Publish to Roblox → Save.",
      "Pick a name.",
      "Click publish.",
    ],
    doneWhen: "You have a roblox.com link to share.",
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 2, 0],
      background: "#eaf4ff",
      blocks: [
        { position: [0, 0, 0], size: [10, 0.4, 6], color: FLOOR, material: "slate" },
        // Globe / planet (stack of blocks approximating a sphere)
        { position: [0, 1.5, -1], size: [3, 3, 3], color: "#2a9df4", material: "plastic" },
        { position: [0, 3, -1], size: [2, 0.4, 2], color: "#4ec76d", material: "grass" },
        { position: [0, 1.5, -1], size: [2, 0.5, 3.2], color: "#4ec76d", material: "grass" },
        // Cloud blocks
        { position: [-3, 4, 0], size: [1.5, 0.6, 0.6], color: "#ffffff", transparency: 0.2 },
        { position: [3, 4.3, 0], size: [1.2, 0.5, 0.5], color: "#ffffff", transparency: 0.2 },
      ],
      tags: [{ position: [0, 4, -1], property: "URL", value: "roblox.com/games/..." }],
      player: player([3, 0.2, 1.5]),
    },
  },
  {
    number: 30,
    slug: "show-your-parent",
    title: "Show Your Parent",
    story: "The final boss.",
    steps: [
      "Send your obby link to your parent.",
      "Watch them play.",
      "Let them struggle a little.",
    ],
    doneWhen: 'They say "you made this?!"',
    scene: {
      cameraPosition: [9, 5, 11],
      target: [0, 1.5, 0],
      background: "#fff8e7",
      blocks: [
        { position: [0, 0, 0], size: [10, 0.4, 6], material: "grass" },
        // Trophy plinth
        { position: [0, 0.5, 0], size: [2, 0.6, 2], color: "#d4af37", material: "marble", reflectance: 0.5 },
        // Trophy cup (stacked)
        { position: [0, 1.4, 0], size: [1.2, 1, 1.2], color: "#ffc73d", material: "neon" },
        { position: [0, 2.3, 0], size: [1.6, 0.3, 1.6], color: "#ffc73d", material: "neon" },
        // Confetti
        { position: [-2, 3, 0], size: [0.3, 0.3, 0.3], color: "#ff6b35", material: "neon" },
        { position: [-1, 3.5, 0.5], size: [0.3, 0.3, 0.3], color: "#2a9df4", material: "neon" },
        { position: [1, 3.4, -0.5], size: [0.3, 0.3, 0.3], color: "#4ec76d", material: "neon" },
        { position: [2, 3.1, 0], size: [0.3, 0.3, 0.3], color: "#a06cd5", material: "neon" },
      ],
      tags: [{ position: [0, 3.5, 0], property: "🏆", value: "you made this?!" }],
      player: player([-2.5, 0.2, 2]),
    },
  },
];

export const challenges = _challenges.map((c) => ({
  ...c,
  feedback: JAY_FEEDBACK[c.slug] || null,
}));

export function getChallenge(slug) {
  return challenges.find((c) => c.slug === slug);
}
