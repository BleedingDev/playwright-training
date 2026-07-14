import { expect, test } from "./fixtures";

test("@exercise weak green test only checks the redirect", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("customer@example.test");
  await page.getByLabel("Heslo").fill("password");
  await page.getByRole("button", { name: "Prihlásiť sa" }).click();
  await expect(page).toHaveURL(/\/dashboard$/u);
  await page.route("**/api/addresses?**", (route) =>
    route.fulfill({
      json: {
        items: [
          {
            city: "Praha 1",
            houseNumber: "837/11",
            id: "weak-217310",
            label: "Václavské náměstí 837/11, 110 00 Praha 1",
            postalCode: "110 00",
            street: "Václavské náměstí",
          },
        ],
      },
    })
  );
  await page.goto("/address-change");
  await page.getByRole("combobox", { name: "Adresa sídla" }).fill("Václav");
  await page
    .getByRole("option", {
      name: "Václavské náměstí 837/11, 110 00 Praha 1",
    })
    .click();
  await page.getByRole("button", { name: "Odoslať požiadavku" }).click();

  await expect(page).toHaveURL(/\/dashboard$/u);
});
