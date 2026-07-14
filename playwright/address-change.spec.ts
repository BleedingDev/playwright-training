import { expect, test } from "./fixtures";

const requestedAddress = "Václavské náměstí 837/11, 110 00 Praha 1";

test("@regression @address-change customer submits an address change and sees pending", async ({
  page,
}) => {
  await page.goto("/address-change");
  await page.getByRole("combobox", { name: "Adresa sídla" }).fill("Václav");
  await page.getByRole("option", { name: requestedAddress }).click();
  await page.getByRole("button", { name: "Odoslať požiadavku" }).click();

  await expect(
    page.getByText("Požiadavka bola odoslaná a čaká na schválenie.")
  ).toBeVisible();
  await expect(page.getByText(requestedAddress)).toBeVisible();
  await expect(
    page.getByText("Čaká na schválenie", { exact: true })
  ).toBeVisible();
});
