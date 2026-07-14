import { expect, test } from "./fixtures";

test.describe("@exercise RÚIAN response scenarios", () => {
  test("address API error should be recoverable", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("customer@example.test");
    await page.getByLabel("Heslo").fill("password");
    await page.getByRole("button", { name: "Prihlásiť sa" }).click();
    await expect(page).toHaveURL(/\/dashboard$/u);
    await page.goto("/address-change");

    await page.getByRole("combobox", { name: "Adresa sídla" }).fill("Praha");

    await expect(page.getByRole("alert")).toContainText(
      "Vyhľadávanie adries je dočasne nedostupné"
    );
    await expect(
      page.getByRole("button", { name: "Skúsiť znova" })
    ).toBeVisible();
  });
});
