// Post-build: Next 16 static export writes route-segment prefetch files as folders
// (out/x/__next.x/$d$slug/__PAGE__.txt) but the client requests the dotted name
// (out/x/__next.x.$d$slug.__PAGE__.txt). Copy each file to the dotted name so prefetches stop 404-ing.
// ponytail: workaround for a Next export quirk; delete this script when Next writes the dotted names itself.
import fs from "node:fs";
import path from "node:path";

let copied = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (!e.isDirectory()) continue;
    if (e.name.startsWith("__next.")) flatten(p, dir, e.name);
    else walk(p);
  }
}
function flatten(segDir, parent, prefix) {
  for (const e of fs.readdirSync(segDir, { withFileTypes: true })) {
    const p = path.join(segDir, e.name);
    if (e.isDirectory()) flatten(p, parent, `${prefix}.${e.name}`);
    else {
      fs.copyFileSync(p, path.join(parent, `${prefix}.${e.name}`));
      copied++;
    }
  }
}
walk("out");
console.log(`flatten-segments: ${copied} files`);
