import { expect, test } from "../fixtures";

test("@exercise fixed timing waits for the delayed user-visible result", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("customer@example.test");
  await page.getByLabel("Heslo").fill("password");
  await page.getByRole("button", { name: "Prihlásiť sa" }).click();
  await expect(page).toHaveURL(/\/dashboard$/u);
  await page.route("**/api/addresses?**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    await route.fulfill({
      json: {
        items: [
          {
            city: "Brno",
            houseNumber: "166/11",
            id: "timing-1",
            label: "Česká 166/11, 602 00 Brno",
            postalCode: "602 00",
            street: "Česká",
          },
        ],
      },
    });
  });
  await page.goto("/address-change");
  await page.getByRole("combobox", { name: "Adresa sídla" }).fill("Česká");

  await expect(
    page.getByRole("option", { name: "Česká 166/11, 602 00 Brno" })
  ).toBeVisible();
});
