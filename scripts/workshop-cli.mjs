/* eslint-disable func-style, no-await-in-loop, unicorn/consistent-function-scoping */
import { spawnSync } from "node:child_process";
import { chmod, copyFile, readFile } from "node:fs/promises";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:8080";
const fixtureEnv = { RUIAN_DRIVER: "fixture" };
const secondaryEnv = {
  APP_PORT: "8081",
  COMPOSE_PROJECT_NAME: "playwright-training-secondary",
};

function execute(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: new URL("../", import.meta.url),
    encoding: options.capture ? "utf-8" : undefined,
    env: { ...process.env, ...options.env },
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`${command} exited with status ${result.status}`);
  }

  return result;
}

function output(command, args) {
  const result = execute(command, args, { allowFailure: true, capture: true });
  return result.status === 0 ? result.stdout.trim() : "";
}

function docker(args, env) {
  return execute("docker", ["compose", ...args], { env });
}

function pnpm(args) {
  return execute("pnpm", args);
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function healthIsReady(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForHealth(url = `${baseUrl}/health`) {
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    if (await healthIsReady(url)) {
      console.log(`PASS application health: ${url}`);
      return;
    }
    await sleep(1000);
  }

  throw new Error(
    `Application health check failed: ${url}\nTry: docker compose logs app`
  );
}

async function appUp({ fixture = false } = {}) {
  const env = fixture ? fixtureEnv : undefined;
  const args = ["up", "--detach", "--build"];
  if (fixture) {
    args.push("--force-recreate");
  }
  args.push("app");
  docker(args, env);
  await waitForHealth();
}

function resetApp(env) {
  docker(
    [
      "exec",
      "-T",
      "app",
      "php",
      "artisan",
      "migrate:fresh",
      "--seed",
      "--force",
    ],
    env
  );
}

async function setup() {
  pnpm(["install", "--frozen-lockfile"]);
  pnpm(["exec", "playwright", "install", "chromium"]);
  docker(["build", "app"]);
  docker(["up", "--detach", "app"]);
  resetApp();
  await waitForHealth();

  console.log(`\nSídloFlow: ${baseUrl}`);
  console.log(
    "Demo accounts: customer@example.test, operator@example.test, admin@example.test"
  );
  console.log("Demo password: password");
}

async function doctor() {
  let failures = 0;
  const pass = (label) => console.log(`PASS ${label}`);
  const fail = (label, fix) => {
    failures += 1;
    console.log(`FAIL ${label}\n     Fix: ${fix}`);
  };
  const checkCommand = (label, fix, command, args, env) => {
    const result = execute(command, args, {
      allowFailure: true,
      capture: true,
      env,
    });
    if (result.status === 0) {
      pass(label);
    } else {
      fail(label, fix);
    }
  };

  checkCommand("Docker daemon", "Start Docker Desktop", "docker", ["info"]);
  checkCommand("Docker Compose", "Update Docker Desktop", "docker", [
    "compose",
    "version",
  ]);
  checkCommand(
    `Node ${output("node", ["--version"]) || "missing"}`,
    "mise install",
    "node",
    ["--version"]
  );
  checkCommand(
    `pnpm ${output("pnpm", ["--version"]) || "missing"}`,
    "mise install",
    "pnpm",
    ["--version"]
  );

  let packageVersion = "";
  try {
    const packageJson = JSON.parse(
      await readFile(
        new URL(
          "../node_modules/@playwright/test/package.json",
          import.meta.url
        ),
        "utf-8"
      )
    );
    packageVersion = packageJson.version;
    pass(`@playwright/test ${packageVersion}`);
  } catch {
    fail("@playwright/test is installed", "pnpm install");
  }

  const compose = await readFile(
    new URL("../compose.yaml", import.meta.url),
    "utf-8"
  );
  const imageVersion =
    compose.match(/mcr\.microsoft\.com\/playwright:v(?<version>[^ -]+)-/u)
      ?.groups?.version ?? "";
  if (packageVersion && packageVersion === imageVersion) {
    pass(`Playwright package and Docker image match (${packageVersion})`);
  } else {
    fail(
      `Playwright package/image mismatch (${packageVersion || "missing"} vs ${imageVersion || "missing"})`,
      "Pin the same version in package.json and compose.yaml"
    );
  }

  checkCommand(
    "application container is running",
    "mise run app:up",
    "docker",
    ["compose", "exec", "-T", "app", "true"]
  );
  if (await healthIsReady(`${baseUrl}/health`)) {
    pass("GET /health");
  } else {
    fail("GET /health", "mise run app:up");
  }
  checkCommand("database migrations", "mise run app:reset", "docker", [
    "compose",
    "exec",
    "-T",
    "app",
    "php",
    "artisan",
    "migrate:status",
  ]);
  checkCommand(
    "three deterministic demo accounts",
    "mise run app:reset",
    "docker",
    [
      "compose",
      "exec",
      "-T",
      "-e",
      "HOME=/tmp",
      "app",
      "php",
      "artisan",
      "tinker",
      "--execute=throw_unless(App\\Models\\User::query()->whereIn('email', ['customer@example.test', 'operator@example.test', 'admin@example.test'])->count() === 3);",
    ]
  );
  checkCommand(
    "Chromium launch and browser smoke",
    "pnpm exec playwright install chromium",
    "node",
    ["scripts/browser-smoke.mjs"]
  );

  if (failures > 0) {
    throw new Error(`${failures} check(s) failed.`);
  }
  console.log("\nAll workshop checks passed.");
}

async function verify() {
  await appUp({ fixture: true });
  resetApp(fixtureEnv);
  docker([
    "run",
    "--rm",
    "php-tests",
    "php",
    "artisan",
    "test",
    "--testsuite=Feature,Unit",
  ]);
  pnpm(["run", "test:tooling"]);
  pnpm(["run", "test:types"]);
  pnpm(["run", "test:lint"]);
  pnpm(["exec", "playwright", "test", "--grep-invert", "@visual|@exercise"]);
  console.log("Playwright report: playwright-report/index.html");
}

async function installHooks() {
  const hookPath = output("git", ["rev-parse", "--git-path", "hooks/pre-push"]);
  if (!hookPath) {
    throw new Error("Could not resolve the Git hooks directory");
  }
  await copyFile(new URL("pre-push", import.meta.url), hookPath);
  await chmod(hookPath, 0o755);
  console.log(`Installed opt-in hook: ${hookPath}`);
}

const commands = {
  "app:down": () => docker(["down"]),
  "app:down:secondary": () => docker(["down"], secondaryEnv),
  "app:logs": () => docker(["logs", "--follow", "app"]),
  "app:reset": () => resetApp(),
  "app:up": () => appUp(),
  "app:up:secondary": async () => {
    docker(["up", "--detach", "--build", "app"], secondaryEnv);
    resetApp(secondaryEnv);
    await waitForHealth("http://127.0.0.1:8081/health");
  },
  "app:up:test": () => appUp({ fixture: true }),
  doctor,
  "exercise:mocking": () =>
    pnpm(["exec", "playwright", "test", "playwright/address-mocking.spec.ts"]),
  "exercise:timing": () =>
    pnpm([
      "exec",
      "playwright",
      "test",
      "playwright/exercises/timing.spec.ts",
      "--trace",
      "on",
    ]),
  "exercise:visual": () => {
    docker(["up", "--detach", "--build", "app"], fixtureEnv);
    docker(
      [
        "run",
        "--no-deps",
        "--rm",
        "playwright",
        "pnpm",
        "exec",
        "playwright",
        "test",
        "playwright/exercises/visual.spec.ts",
      ],
      fixtureEnv
    );
  },
  "exercise:weak-test": () =>
    pnpm(["exec", "playwright", "test", "playwright/address-change.spec.ts"]),
  "hooks:install": installHooks,
  setup,
  "test:codegen": () => pnpm(["exec", "playwright", "codegen", baseUrl]),
  "test:e2e": async () => {
    await appUp({ fixture: true });
    pnpm(["exec", "playwright", "test", "--grep-invert", "@visual|@exercise"]);
  },
  "test:e2e:docker": async () => {
    await appUp({ fixture: true });
    docker(
      [
        "run",
        "--no-deps",
        "--rm",
        "playwright",
        "pnpm",
        "exec",
        "playwright",
        "test",
        "--grep-invert",
        "@visual|@exercise",
      ],
      fixtureEnv
    );
  },
  "test:php": () =>
    docker([
      "run",
      "--rm",
      "php-tests",
      "php",
      "artisan",
      "test",
      "--testsuite=Feature,Unit",
    ]),
  "test:report": () =>
    pnpm(["exec", "playwright", "show-report", "playwright-report"]),
  "test:smoke": () => pnpm(["exec", "playwright", "test", "--grep", "@smoke"]),
  "test:ui": () => pnpm(["exec", "playwright", "test", "--ui"]),
  "test:visual": () => {
    docker(["up", "--detach", "--build", "app"], fixtureEnv);
    docker(
      [
        "run",
        "--no-deps",
        "--rm",
        "playwright",
        "pnpm",
        "exec",
        "playwright",
        "test",
        "playwright/visual.spec.ts",
      ],
      fixtureEnv
    );
  },
  verify,
  "wait-for-health": () => waitForHealth(process.argv[3]),
};

const [command] = process.argv.slice(2);
if (!(command in commands)) {
  console.error(`Unknown workshop command: ${command ?? "(missing)"}`);
  process.exit(2);
}

try {
  await commands[command]();
} catch (error) {
  console.error(`FAIL ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
