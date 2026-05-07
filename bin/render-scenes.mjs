#!/usr/bin/env node
// Pre-render the 3D scene of every challenge to public/scenes/<slug>.png.
// /print can then show static PNGs (no WebGL context limit, works on one page).
// Usage: PORT=3004 node bin/render-scenes.mjs

import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || `http://localhost:${PORT}`;
const OUT_DIR = resolve("public/scenes");
mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--enable-webgl",
    "--use-gl=angle",
    "--enable-accelerated-2d-canvas",
    "--ignore-gpu-blocklist",
    "--enable-gpu-rasterization",
  ],
});

const index = await browser.newPage();
await index.goto(`${HOST}/`, { waitUntil: "networkidle0" });
const items = await index.$$eval('a[href^="/challenges/"]', (els) =>
  els.map((e) => e.getAttribute("href").replace("/challenges/", "")),
);
const slugs = [...new Set(items)];
await index.close();

console.log(`Rendering ${slugs.length} scenes -> ${OUT_DIR}/`);

for (const slug of slugs) {
  process.stdout.write(`  ${slug}... `);
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 2 });
  await page.goto(`${HOST}/challenges/${slug}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForSelector("canvas", { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 3000));

  // Hide the on-screen Play/Stop buttons so they don't appear in the screenshot.
  await page.addStyleTag({
    content: ".no-print, button { visibility: hidden !important; }",
  });

  // Target = the canvas's parent (the rounded container with bg color).
  const handle = await page.evaluateHandle(() => {
    const c = document.querySelector("canvas");
    return c ? c.parentElement : null;
  });
  if (!handle || !(await handle.asElement())) {
    console.log("no canvas");
    await page.close();
    continue;
  }
  await handle.asElement().screenshot({
    path: resolve(OUT_DIR, `${slug}.png`),
    omitBackground: false,
  });
  await page.close();
  console.log("ok");
}

await browser.close();
console.log("Done.");
