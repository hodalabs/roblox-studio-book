#!/usr/bin/env node
// Export the entire book (cover + all challenge pages) as ONE long A5 PDF.
// Usage: PORT=3004 node bin/export-book.mjs [output.pdf]

import puppeteer from "puppeteer";
import { resolve } from "node:path";

const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || `http://localhost:${PORT}`;
const OUT = resolve(process.argv[2] || "30-days-of-roblox-studio.pdf");

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

const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 1500, deviceScaleFactor: 2 });
page.on("pageerror", (err) => console.log("ERR:", err.message));

console.log(`Loading ${HOST}/print ...`);
await page.goto(`${HOST}/print`, { waitUntil: "networkidle0", timeout: 90000 });

// Let images and fonts settle.
await new Promise((r) => setTimeout(r, 2500));

console.log(`Writing ${OUT}`);
await page.pdf({
  path: OUT,
  width: "152mm",
  height: "214mm",
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: false,
});

await browser.close();
console.log("Done.");
