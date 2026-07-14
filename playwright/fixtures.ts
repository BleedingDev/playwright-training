import { expect, test as base } from "@playwright/test";

export const test = base.extend<{ resetApplication: void }>({
  resetApplication: [
    async ({ request }, use) => {
      const response = await request.post("/_test/reset");
      expect(response.ok()).toBeTruthy();
      await use();
    },
    { auto: true },
  ],
});

export { expect };
