import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("mise tasks are runnable from native Windows shells", async () => {
  const mise = await readFile(new URL(".mise.toml", root), "utf-8");

  assert.doesNotMatch(mise, /\bbash\s/u);
  assert.doesNotMatch(mise, /\bcurl\s/u);
  assert.doesNotMatch(mise, /\$\{/u);
  assert.doesNotMatch(mise, /(?:^|&&\s)[A-Z][A-Z0-9_]*=/mu);
  assert.doesNotMatch(mise, /\s&&\s/u);
});

test("README documents native Windows support", async () => {
  const readme = await readFile(new URL("README.md", root), "utf-8");

  assert.match(readme, /PowerShell/u);
  assert.doesNotMatch(
    readme,
    /Windows spúšťajte workshop vo WSL|Mise tasky používajú Bash/u
  );
});

test("setup and verify sync generated Wayfinder types to the host", async () => {
  const cli = await readFile(
    new URL("scripts/workshop-cli.mjs", root),
    "utf-8"
  );

  assert.match(cli, /\["actions", "routes", "wayfinder"\]/u);
  assert.equal(cli.match(/syncWayfinder\(\);/gu)?.length, 2);
});

test("available CI and Git hook do not use host-side Bash", async () => {
  const [workflow, hook] = await Promise.all([
    readFile(new URL(".github/workflows/e2e.yml", root), "utf-8").catch(
      (error) => {
        if (error.code === "ENOENT") {
          return null;
        }
        throw error;
      }
    ),
    readFile(new URL("scripts/pre-push", root), "utf-8").catch((error) => {
      if (error.code === "ENOENT") {
        return null;
      }
      throw error;
    }),
  ]);

  if (workflow) {
    assert.doesNotMatch(workflow, /bash scripts/u);
  }
  if (hook) {
    assert.match(hook, /^#!\/usr\/bin\/env node/u);
  }
});
