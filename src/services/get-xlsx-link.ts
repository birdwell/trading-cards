import { chromium } from "playwright";

export async function getXlsxLink(url: string): Promise<string | null> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const link = await page.locator('a[href$=".xlsx"]').getAttribute("href");

  await browser.close();
  return link;
}
