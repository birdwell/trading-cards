import { google } from "@ai-sdk/google";

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
export const GEMINI_MODEL_UNAVAILABLE_MESSAGE =
  "Gemini model is unavailable. Check GEMINI_MODEL or update to a supported model.";

export function getGeminiModelName() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export function createGeminiModel() {
  return google(getGeminiModelName());
}

export function isGeminiModelUnavailableError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("is not found for API version") ||
    error.message.includes("not supported for generateContent")
  );
}
