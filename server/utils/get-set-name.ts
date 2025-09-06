export interface SetInfo {
  year: string;
  name: string;
}

/**
 * Extracts set information from trading card checklist filenames
 * 
 * Examples:
 * - "2024-25-Panini-NBA-Hoops-Basketball-Checklist.xlsx" -> { year: "2024-25", name: "Panini NBA Hoops" }
 * - "2024-Panini-Prizm-Football-Checklist.xlsx" -> { year: "2024", name: "Panini Prizm" }
 */
export function getSetName(fileName: string): SetInfo {
  // Remove file extension and path
  const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/.*\//, '');
  
  // Regex patterns to match different filename formats
  // Pattern 1: YYYY-YY-Brand-Set-Sport-Checklist
  // Pattern 2: YYYY-Brand-Set-Sport-Checklist
  const yearRangePattern = /^(\d{4}-\d{2})-(.+?)-(Basketball|Football)-Checklist$/i;
  const singleYearPattern = /^(\d{4})-(.+?)-(Basketball|Football)-Checklist$/i;
  
  let match = baseName.match(yearRangePattern);
  if (match) {
    const [, year, setName] = match;
    return {
      year,
      name: setName.replace(/-/g, ' ')
    };
  }
  
  match = baseName.match(singleYearPattern);
  if (match) {
    const [, year, setName] = match;
    return {
      year,
      name: setName.replace(/-/g, ' ')
    };
  }
  
  // Fallback: try to extract year and remove common suffixes
  const fallbackPattern = /^(\d{4}(?:-\d{2})?)-?(.+?)(?:-(Basketball|Football|Checklist))*$/i;
  match = baseName.match(fallbackPattern);
  
  if (match) {
    const [, year, setName] = match;
    return {
      year,
      name: setName.replace(/-/g, ' ').replace(/\s+(Basketball|Football|Checklist)\s*$/gi, '').trim()
    };
  }
  
  // Ultimate fallback: use the whole filename as set name with current year
  return {
    year: new Date().getFullYear().toString(),
    name: baseName.replace(/-/g, ' ')
  };
}
