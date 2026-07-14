import { expect, test } from "./fixtures";

test("@regression @address-change operator approval updates the customer company address", async ({
  browser,
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("customer@example.test");
  await page.getByLabel("Heslo").fill("password");
  await page.getByRole("button", { name: "Prihlásiť sa" }).click();
  await expect(page).toHaveURL(/\/dashboard$/u);
  await page.goto("/address-change");
  await page.getByRole("combobox", { name: "Adresa sídla" }).fill("Dlouhá");
  await page
    .getByRole("option", { name: "Dlouhá 730/35, 110 00 Praha 1" })
    .click();
  await page.getByRole("button", { name: "Odoslať požiadavku" }).click();

  const operatorContext = await browser.newContext();
  const operatorPage = await operatorContext.newPage();
  await operatorPage.goto("/login");
  await operatorPage.getByLabel("E-mail").fill("operator@example.test");
  await operatorPage.getByLabel("Heslo").fill("password");
  await operatorPage
    .getByRole("button", { name: "Prihlásiť sa" })
    .click();
  await expect(operatorPage).toHaveURL(/\/operator\/requests$/u);
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
