import { expect, test } from "./fixtures";

test("@regression @address-change operator approval updates the customer company address", async ({
  browser,
  page,
}) => {
  await page.goto("/address-change");
  await page.getByRole("combobox", { name: "Adresa sídla" }).fill("Dlouhá");
  await page
    .getByRole("option", { name: "Dlouhá 730/35, 110 00 Praha 1" })
    .click();
  await page.getByRole("button", { name: "Odoslať požiadavku" }).click();

  const operatorContext = await browser.newContext({
    storageState: "playwright/.auth/operator.json",
  });
  const operatorPage = await operatorContext.newPage();
  await operatorPage.goto("/operator/requests");
  await operatorPage.getByRole("link", { name: "Otvoriť detail" }).click();
  await operatorPage
    .getByRole("button", { name: "Schváliť požiadavku" })
    .click();
  await expect(
    operatorPage.getByText("Požiadavka bola spracovaná.")
  ).toBeVisible();
  await operatorContext.close();

  await page.goto("/dashboard");
  await expect(
    page
      .getByText("Aktuálne sídlo")
      .locator("..")
      .getByText("Dlouhá 730/35, 110 00 Praha 1")
  ).toBeVisible();
  await expect(page.getByText("Schválená")).toBeVisible();
});
