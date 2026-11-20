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

  // Empty local database: the shell only reaches this state after the tRPC
  // sets query succeeds. An API failure renders the error message instead.
  await expect(page.getByText("No data found")).toBeVisible();
});

test("brands and import routes render", async ({ page }) => {
  const brands = await page.goto("/brands");
  expect(brands?.ok()).toBe(true);
  await expect(page.getByText("No brands yet")).toBeVisible();

  const importPage = await page.goto("/import");
  expect(importPage?.ok()).toBe(true);
  await expect(page.getByLabel("Beckett URL")).toBeVisible();
});
