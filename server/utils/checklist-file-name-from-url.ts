/**
 * Builds a synthetic checklist filename from a Beckett article URL slug.
 *
 * Example:
 * https://www.beckett.com/news/2019-donruss-optic-football-cards/
 * → 2019-Donruss-Optic-Football-Checklist.txt
 */
export function checklistFileNameFromUrl(url: string): string {
  let slug = "checklist";

  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "");
    slug = pathname.split("/").filter(Boolean).pop() || slug;
  } catch {
    const parts = url.split("/").filter(Boolean);
    slug = parts[parts.length - 1] || slug;
  }

  const normalized = slug
    .replace(/-cards$/i, "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("-");

  if (/-(Basketball|Football)-Checklist$/i.test(normalized)) {
    return `${normalized}.txt`;
  }

  if (/-(Basketball|Football)$/i.test(normalized)) {
    return `${normalized}-Checklist.txt`;
  }

  return `${normalized}-Checklist.txt`;
}

export function hasInlineCardLines(text: string): boolean {
  // Card lines look like "27 Dak Prescott" (1-3 digit numbers).
  // Exclude 4-digit years in prose such as "2019 Donruss Optic...".
  const matches = text.match(/^\d{1,3}\s+[A-Za-z]/gm);
  return (matches?.length ?? 0) >= 10;
}
