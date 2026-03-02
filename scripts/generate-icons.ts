// scripts/generate-icons.mjs
import sharp from "sharp";
import { mkdirSync } from "fs";

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

mkdirSync("public/icons", { recursive: true });

for (const size of sizes) {
  await sharp("public/images/logo.png")
    .resize(size, size)
    .toFile(`public/icons/icon-${size}x${size}.png`);
  console.log(`Generated ${size}x${size}`);
}