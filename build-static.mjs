import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, "dist", "public");
const pages = [
  "index.html",
  "about.html",
  "services.html",
  "portable-cabins.html",
  "office-cabins.html",
  "interior-work.html",
  "projects.html",
  "project-gallery.html",
  "contact.html",
];
const directories = ["assets", "css", "js", "public"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const page of pages) {
  await cp(path.join(root, page), path.join(output, page));
}

for (const directory of directories) {
  await cp(path.join(root, directory), path.join(output, directory), {
    recursive: true,
  });
}

console.info(`Copied ${pages.length} static pages and their assets to dist/public.`);
