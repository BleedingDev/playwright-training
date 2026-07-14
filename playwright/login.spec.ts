import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("@smoke @auth customer can sign in and see the dashboard", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("customer@example.test");
  await page.getByLabel("Heslo").fill("password");
  await page.getByRole("button", { name: "Prihlásiť sa" }).click();

  await expect(
    page.getByRole("heading", { name: "Prehľad firmy" })
  ).toBeVisible();
});
