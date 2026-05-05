#!/usr/bin/env node
// Batch export each challenge page to a separate A4 PDF.
// Usage:
//   node bin/export-pdf.mjs              # exports all 30 to pdfs/
//   SLUG=fake-wall node bin/export-pdf.mjs out.pdf   # one page only

import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || `http://localhost:${PORT}`;
const SINGLE_SLUG = process.env.SLUG;
const SINGLE_OUT = process.argv[2];
const OUTPUT_DIR = resolve(SINGLE_OUT ? "." : "pdfs");

if (!SINGLE_OUT) mkdirSync(OUTPUT_DIR, { recursive: true });

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

async function exportPage(slug, filename) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1700, deviceScaleFactor: 2 });
  page.on("pageerror", (err) => console.log(`  ERR ${slug}:`, err.message));
  const url = `${HOST}/challenges/${slug}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  // Give fonts + WebGL a moment to settle.
  await new Promise((r) => setTimeout(r, 2500));
  const hasCanvas = await page.$("canvas");
  if (hasCanvas) await new Promise((r) => setTimeout(r, 1500));
  await page.pdf({
    path: filename,
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  await page.close();
}

if (SINGLE_SLUG) {
  const out = resolve(SINGLE_OUT || `${SINGLE_SLUG}.pdf`);
  console.log(`Exporting ${SINGLE_SLUG} -> ${out}`);
  await exportPage(SINGLE_SLUG, out);
} else {
  // Scrape slugs (and numbers) from the index page so we don't have to import the JS module.
  const index = await browser.newPage();
  await index.goto(`${HOST}/`, { waitUntil: "networkidle0" });
  const items = await index.$$eval('a[href^="/challenges/"]', (els) =>
    els.map((e) => ({
      slug: e.getAttribute("href").replace("/challenges/", ""),
      // Page index has a leading numeric span; grab whatever first number-looking text we can find.
      number: parseInt((e.textContent || "").trim().match(/\d+/)?.[0] || "0", 10),
    })),
  );
  // Dedupe (the demo button on the index links to fake-wall too).
  const seen = new Set();
  const slugs = items.filter((i) => {
    if (seen.has(i.slug)) return false;
    seen.add(i.slug);
    return true;
  });
  await index.close();

  console.log(`Exporting ${slugs.length} pages to ${OUTPUT_DIR}/`);
  for (const { slug, number } of slugs) {
    const padded = String(number).padStart(2, "0");
    const filename = resolve(OUTPUT_DIR, `${padded}-${slug}.pdf`);
    process.stdout.write(`  ${padded} ${slug}... `);
    await exportPage(slug, filename);
    console.log("ok");
  }
}

await browser.close();
console.log("Done.");
