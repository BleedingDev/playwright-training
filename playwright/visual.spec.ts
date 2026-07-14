import { expect, test } from "./fixtures";

test("@visual operator queue matches the approved baseline", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("operator@example.test");
  await page.getByLabel("Heslo").fill("password");
  await page.getByRole("button", { name: "Prihlásiť sa" }).click();
  await expect(page).toHaveURL(/\/operator\/requests$/u);
  await page.goto("/operator/requests");
  await expect(
    page.getByRole("heading", { name: "Požiadavky na schválenie" })
  ).toBeVisible();
  await expect(page).toHaveScreenshot("operator-queue.png", {
    fullPage: true,
  });
});
