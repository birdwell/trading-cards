import { expect, test } from "@playwright/test";

test("home page renders the app shell", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle("Almanac");
  await expect(page.getByRole("link", { name: "Almanac" })).toBeVisible();

  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link", { name: "Collection" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Import" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Brands" })).toBeVisible();
});
