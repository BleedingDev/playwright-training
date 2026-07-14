import { expect, test } from "@playwright/test";

test("@smoke @auth customer cannot open the admin route", async ({ page }) => {
  const response = await page.goto("/admin");

  expect(response?.status()).toBe(403);
  await expect(page.getByText("403")).toBeVisible();
});
