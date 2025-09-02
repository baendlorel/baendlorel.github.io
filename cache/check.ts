import lz from 'lz-string';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
function check() {
  const p = join(import.meta.dirname, 'repo-data.compressed.js');
  const text = readFileSync(p, 'utf-8');
  const str = text.slice(text.indexOf("'") + 1, text.lastIndexOf("'"));
  const rawjson = lz.decompressFromBase64(str);
  console.log(JSON.parse(rawjson));
}
check();
