import { expect, test } from "./fixtures";

test.use({ storageState: "playwright/.auth/operator.json" });

test("@visual operator queue matches the approved baseline", async ({
  page,
}) => {
  await page.goto("/operator/requests");
  await expect(
    page.getByRole("heading", { name: "Požiadavky na schválenie" })
  ).toBeVisible();
  await expect(page).toHaveScreenshot("operator-queue.png", {
    fullPage: true,
  });
});
