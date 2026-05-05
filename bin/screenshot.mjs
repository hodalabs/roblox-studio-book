#!/usr/bin/env node
// Screenshot a challenge page for chat preview.
// Headless Chrome needs a GL backend; --use-gl=angle works best on macOS.
import puppeteer from "puppeteer";
import { resolve } from "node:path";

const PORT = process.env.PORT || "3000";
const SLUG = process.env.SLUG || "fake-wall";
const URL = `http://localhost:${PORT}/challenges/${SLUG}`;
const OUTPUT = resolve(process.argv[2] || `screenshot-${SLUG}.png`);

console.log(`Capturing ${URL}`);
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
await page.setViewport({ width: 900, height: 1300, deviceScaleFactor: 2 });

page.on("console", (msg) => {
  if (msg.type() === "error") console.log("PAGE ERROR:", msg.text());
});
page.on("pageerror", (err) => console.log("PAGE EXCEPTION:", err.message));

await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
await page.waitForSelector("canvas", { timeout: 10000 });
// Let WebGL settle (initial render + shadow map)
await new Promise((r) => setTimeout(r, 4000));

await page.screenshot({ path: OUTPUT, fullPage: true });
await browser.close();
console.log(`Saved ${OUTPUT}`);
