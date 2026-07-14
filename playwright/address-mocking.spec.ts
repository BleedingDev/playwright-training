import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await page.goto("/address-change");
});

test("@regression @address-change address API 500 shows a recoverable error", async ({
  page,
}) => {
  await page.route("**/api/addresses?**", (route) =>
    route.fulfill({ json: { message: "failed" }, status: 500 })
  );
  await page.getByRole("combobox", { name: "Adresa sídla" }).fill("Praha");

  await expect(page.getByRole("alert")).toContainText(
    "Vyhľadávanie adries je dočasne nedostupné"
  );
  await expect(
    page.getByRole("button", { name: "Skúsiť znova" })
  ).toBeVisible();
});

test("@regression @address-change empty address API shows an empty state", async ({
  page,
}) => {
  await page.route("**/api/addresses?**", (route) =>
    route.fulfill({ json: { items: [] } })
  );
  await page.getByRole("combobox", { name: "Adresa sídla" }).fill("Nikde");

  await expect(
    page.getByText("Pre zadaný výraz sme nenašli žiadnu adresu.")
  ).toBeVisible();
});

test("@regression @address-change delayed API waits for the user-visible state", async ({
  page,
}) => {
  await page.route("**/api/addresses?**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.fulfill({
      json: {
        items: [
          {
            city: "Brno",
            houseNumber: "166/11",
            id: "delayed-1",
            label: "Česká 166/11, 602 00 Brno",
            postalCode: "602 00",
            street: "Česká",
          },
        ],
      },
    });
  });
  await page.getByRole("combobox", { name: "Adresa sídla" }).fill("Česká");

  await expect(page.getByRole("status")).toHaveText("Vyhľadávam adresy…");
  await expect(
    page.getByRole("option", { name: "Česká 166/11, 602 00 Brno" })
  ).toBeVisible();
});

test("@regression @address-change stalled API shows a timeout state", async ({
  page,
}) => {
  await page.route("**/api/addresses?**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await route.fulfill({ json: { items: [] } });
  });
  await page.getByRole("combobox", { name: "Adresa sídla" }).fill("Praha");

  await expect(page.getByRole("alert")).toContainText(
    "Vyhľadávanie trvá príliš dlho"
  );
});
