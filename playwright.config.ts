import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
    },
  },
  forbidOnly: isCi,
  fullyParallel: false,
  outputDir: "test-results",
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  reporter: isCi
    ? [["line"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : [["html", { open: "never", outputFolder: "playwright-report" }]],
  retries: isCi ? 1 : 0,
  snapshotPathTemplate: "playwright/snapshots/{arg}{ext}",
  testDir: "playwright",
  timeout: 30_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:8080",
    screenshot: "only-on-failure",
    trace: isCi ? "on-first-retry" : "retain-on-failure",
    video: "retain-on-failure",
  },
  workers: 1,
});
