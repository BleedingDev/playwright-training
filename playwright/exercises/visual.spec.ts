import { expect, test } from "../fixtures";

test.use({ storageState: "playwright/.auth/operator.json" });

test("@exercise @visual operator queue matches the baseline", async ({
  page,
}) => {
  await page.goto("/operator/requests");
  await expect(page).toHaveScreenshot("operator-queue.png", {
    fullPage: true,
  });
});
