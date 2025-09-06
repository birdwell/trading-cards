import { Sport } from "../shared/types";

/**
 * Extracts the sport type from a Beckett URL
 * @param url - The Beckett URL to analyze
 * @returns Sport enum value (Basketball or Football)
 */
export function getSport(url: string): Sport {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('basketball')) {
    return Sport.Basketball;
  }
  
  if (urlLower.includes('football')) {
    return Sport.Football;
  }
  
  // Default to Football for Beckett URLs
  return Sport.Football;
}