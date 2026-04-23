const build_msg = "\033[0;32m[BUILD]\033[0m"
const info_msg = "\033[0;36m[INFO]\033[0m"

import { existsSync } from "fs";
if (existsSync("./output")) {
    await Bun.$`rm -rf ./output`;
    console.log(`${build_msg} Dossier output nettoyé`);
}

const result = await Bun.build({
    entrypoints: ["./src/game.ts"],
    outdir: "./output",
    target: "browser",
    format: "esm",
    minify: false,
    sourcemap: "external",
});

if (!result.success) {
    console.error("Build échoué :");
    for (const msg of result.logs) {
        console.error(msg);
    }
    process.exit(1);
}
console.log(`${build_msg} Bundle JS OK — ${result.outputs.length} fichier(s) généré(s)`);

await Bun.write("./output/index.html", Bun.file("./src/index.html"));

console.log(`${build_msg} HTML OK`);

const glob = new Bun.Glob("src/assets/**/*");
const images = await Array.fromAsync(glob.scan("."));

images.forEach(async (image) => {
    await Bun.write("./output/" + image.substr("src".length), Bun.file(image));
})

console.log(`${build_msg} Assets OK`);

console.log(`${info_msg} Ouvrir le projet en ouvrant le fichier : output/index.html`)
