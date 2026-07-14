import { expect, test as setup } from "@playwright/test";

const roles = ["customer", "operator", "admin"] as const;

for (const role of roles) {
  setup(`authenticate ${role}`, async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(`${role}@example.test`);
    await page.getByLabel("Heslo").fill("password");
    await page.getByRole("button", { name: "Prihlásiť sa" }).click();
    await expect(page).not.toHaveURL(/\/login$/u);
    await page
      .context()
      .storageState({ path: `playwright/.auth/${role}.json` });
  });
}
