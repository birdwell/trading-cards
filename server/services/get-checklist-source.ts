import { chromium, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";
import {
  checklistFileNameFromUrl,
  hasInlineCardLines,
} from "../utils/checklist-file-name-from-url";
import logger from "../shared/logger";

export type ChecklistSource =
  | { kind: "xlsx"; url: string }
  | { kind: "inline"; text: string; sourceFileName: string };

const ARTICLE_SELECTORS = [
  ".article-content",
  "article",
  ".s-post",
  ".post",
  "main",
] as const;

async function extractInlineChecklistText(page: Page): Promise<string | null> {
  for (const selector of ARTICLE_SELECTORS) {
    const locator = page.locator(selector).first();
    if ((await locator.count()) === 0) {
      continue;
    }

    const text = (await locator.innerText()).trim();
    if (hasInlineCardLines(text)) {
      return text;
    }
  }

  const bodyText = (await page.locator("body").innerText()).trim();
  return hasInlineCardLines(bodyText) ? bodyText : null;
}

/**
 * Loads a Beckett article and returns either a downloadable XLSX URL
 * or inline checklist text scraped from older pages that have no spreadsheet.
 */
export async function getChecklistSource(
  url: string
): Promise<ChecklistSource | null> {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    const xlsxLinks = page.locator('a[href$=".xlsx"]');
    const xlsxCount = await xlsxLinks.count();

    if (xlsxCount > 0) {
      const href = await xlsxLinks.first().getAttribute("href");
      if (href) {
        logger.info(`Found XLSX checklist link for ${url}`);
        return { kind: "xlsx", url: href };
      }
    }

    logger.info(
      `No XLSX link found for ${url}; trying inline checklist fallback`
    );

    const text = await extractInlineChecklistText(page);
    if (!text) {
      return null;
    }

    const sourceFileName = checklistFileNameFromUrl(url);
    logger.info(
      `Found inline checklist text for ${url} (${text.length} chars) → ${sourceFileName}`
    );

    return {
      kind: "inline",
      text,
      sourceFileName,
    };
  } finally {
    await browser.close();
  }
}

export async function saveInlineChecklist(
  text: string,
  sourceFileName: string
): Promise<string> {
  const folder = "./spreadsheet-downloads";
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const outputLocationPath = path.join(folder, sourceFileName);
  fs.writeFileSync(outputLocationPath, text, "utf8");
  logger.info(`Saved inline checklist to: ${outputLocationPath}`);
  return outputLocationPath;
}

/** @deprecated Prefer getChecklistSource — kept for existing unit tests. */
export async function getXlsxLink(url: string): Promise<string | null> {
  const source = await getChecklistSource(url);
  return source?.kind === "xlsx" ? source.url : null;
}
