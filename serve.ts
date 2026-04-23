import { serve } from "bun";
import { join } from "path";
import { spawnSync } from "bun";

const OUTPUT_DIR = "./output";
const PORT = 6913;

const gitCheck = spawnSync(["git", "--version"], { stderr: "pipe", stdout: "pipe" });
if (gitCheck.exitCode !== 0) {
  spawnSync(["apt-get", "update", "-y"], { stdio: ["inherit", "inherit", "inherit"] });
  spawnSync(["apt-get", "install", "-y", "git"], { stdio: ["inherit", "inherit", "inherit"] });
}

serve({
    port: PORT,

    async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === "/git-pull") {
            const result = spawnSync(["git", "pull"], {
                cwd: import.meta.dir,
                stderr: "pipe",
                stdout: "pipe",
            });

            const stdout = result.stdout?.toString() ?? "";
            const stderr = result.stderr?.toString() ?? "";
            const success = result.exitCode === 0;

            console.log("[git-pull] " + (success ? stdout : stderr));

            const buildResult = spawnSync(["bun", "run", "build"], {
                cwd: import.meta.dir,
                stderr: "pipe",
                stdout: "pipe",
            });

            const buildStdout = buildResult.stdout?.toString() ?? "";
            const buildStderr = buildResult.stderr?.toString() ?? "";
            const buildSuccess = buildResult.exitCode === 0;

            console.log("[build]" + (buildSuccess ? buildStdout : buildStderr));

            return new Response("", { status: (success && buildSuccess) ? 200 : 500 });
        }

        let filePath = url.pathname;

        if (filePath === "/" || filePath === "") {
            filePath = "/index.html";
        }

        const fullPath = join(import.meta.dir, OUTPUT_DIR, filePath);

        const file = Bun.file(fullPath);
        const exists = await file.exists();

        if (!exists) {
            const indexPath = join(import.meta.dir, OUTPUT_DIR, "index.html");
            const indexFile = Bun.file(indexPath);
            const indexExists = await indexFile.exists();

            if (indexExists) {
                return new Response(indexFile);
            }

            return new Response("404 - Fichier non trouvé", { status: 404 });
        }

        return new Response(file);
    },
});

console.log(`Serveur démarré sur http://localhost:${PORT}`);
