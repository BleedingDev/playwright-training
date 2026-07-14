import { chromium } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:8080";
const browser = await chromium.launch();
const page = await browser.newPage();
const response = await page.goto(`${baseURL}/health`);

if (!response?.ok()) {
  throw new Error(
    `Health endpoint returned ${response?.status() ?? "no response"}`
  );
}

await browser.close();
