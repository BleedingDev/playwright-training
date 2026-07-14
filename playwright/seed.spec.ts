import { expect, test } from "./fixtures";

test("@exercise seed: customer reaches the address-change starting point", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(
    page.getByRole("heading", { name: "Prehľad firmy" })
  ).toBeVisible();
  await page.getByRole("link", { name: "Zmena sídla" }).click();
  await expect(
    page.getByRole("heading", { name: "Zmena sídla" })
  ).toBeVisible();
});
