/**
 * Regenerate DataCaptain favicons from public/logo/logo.jpeg
 * Usage: node scripts/generate-favicons.js
 * Requires: sharp (via Next.js), png-to-ico (npm i -D png-to-ico)
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function toTransparentPng(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (min > 248) out[i + 3] = 0;
    else if (min > 230 && max - min < 18) {
      const t = (min - 230) / (255 - 230);
      out[i + 3] = Math.round(255 * (1 - t));
    }
  }
  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function main() {
  let pngToIco;
  try {
    pngToIco = require("png-to-ico");
  } catch {
    console.error("Install png-to-ico first: npm i -D png-to-ico");
    process.exit(1);
  }

  const root = path.join(__dirname, "..");
  const src = path.join(root, "public/logo/logo.jpeg");
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  let minX = w,
    minY = h,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const contentH = maxY - minY + 1;
  const iconBottom = minY + Math.floor(contentH * 0.52);
  let iMinX = w,
    iMinY = h,
    iMaxX = 0,
    iMaxY = 0;
  for (let y = minY; y <= iconBottom; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) {
        iMinX = Math.min(iMinX, x);
        iMinY = Math.min(iMinY, y);
        iMaxX = Math.max(iMaxX, x);
        iMaxY = Math.max(iMaxY, y);
      }
    }
  }

  const pad = 12;
  const left = Math.max(0, iMinX - pad);
  const top = Math.max(0, iMinY - pad);
  const width = Math.min(w - left, iMaxX - iMinX + 1 + pad * 2);
  const height = Math.min(h - top, iMaxY - iMinY + 1 + pad * 2);

  const croppedBuf = await sharp(src)
    .extract({ left, top, width, height })
    .png()
    .toBuffer();
  const transparent = await toTransparentPng(croppedBuf);
  const side = Math.max(width, height);
  const transparentIcon = await sharp(transparent)
    .resize({
      width: side,
      height: side,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  fs.mkdirSync(path.join(root, "public/icons"), { recursive: true });
  fs.writeFileSync(path.join(root, "public/icons/icon-source.png"), transparentIcon);

  const outputs = [
    ["public/favicon-16x16.png", 16],
    ["public/favicon-32x32.png", 32],
    ["public/apple-touch-icon.png", 180],
    ["public/icons/favicon-16x16.png", 16],
    ["public/icons/favicon-32x32.png", 32],
    ["public/icons/apple-touch-icon.png", 180],
    ["public/icons/icon-192.png", 192],
    ["public/icons/icon-512.png", 512],
    ["src/app/icon.png", 32],
    ["src/app/apple-icon.png", 180],
  ];

  for (const [out, size] of outputs) {
    await sharp(transparentIcon)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(root, out));
  }

  const bufs = [];
  for (const size of [16, 32, 48]) {
    bufs.push(
      await sharp(transparentIcon)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer()
    );
  }
  const ico = await pngToIco(bufs);
  fs.writeFileSync(path.join(root, "public/favicon.ico"), ico);
  fs.writeFileSync(path.join(root, "src/app/favicon.ico"), ico);
  fs.writeFileSync(path.join(root, "public/icons/favicon.ico"), ico);
  console.log("Favicons generated from DataCaptain logo.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
