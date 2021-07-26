#!/usr/bin/env node
// @ts-ignore-file
import { preprocess, compile } from "svelte/compiler";
import preprocessor from "svelte-preprocess";
import { readFile, writeFile } from "fs/promises";
import glob from "glob";

(async () => {
    if (process.argv[2]) return process_file(process.argv[2]);
    glob("**/*.svelte", (_, files) => files.forEach(process_file))
})();


async function process_file(filepath) {
    const filename = filepath.split('/').pop();
    const raw_source = await readFile(filepath, "utf8");
    const processed_source = await preprocess(raw_source, preprocessor(), { filename });
    const { js: { code, map } } = compile(processed_source.code, { filename, sourcemap: processed_source.map, dev: true });
    const js = code
        .replace('from "svelte/internal"', 'from "/node_modules/svelte/internal/index.mjs"')
        .replace(/\.svelte";/g, '.js";')
        .replace(/\.svelte';/g, ".js';");
    const output = `${js}\n//# sourceMappingURL=${map.toUrl()}`
    await writeFile(filepath.replace('.svelte', '.js'), output);
}
