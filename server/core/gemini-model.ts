import { createGateway } from "ai";

export const DEFAULT_GEMINI_MODEL = "google/gemini-2.5-flash";
export const GEMINI_MODEL_UNAVAILABLE_MESSAGE =
  "Gemini model is unavailable on AI Gateway. Check GEMINI_MODEL or update to a supported model.";

// AI Gateway ids are "provider/model"; bare names from the direct Google
// provider era (e.g. "gemini-2.5-flash") still resolve to Google.
export function getGeminiModelName() {
  const configured = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  return configured.includes("/") ? configured : `google/${configured}`;
}

export function createGeminiModel() {
  // Without AI_KEY the gateway falls back to AI_GATEWAY_API_KEY or Vercel OIDC.
  const gateway = createGateway({
    apiKey: process.env.AI_KEY?.trim() || undefined,
  });
  return gateway(getGeminiModelName());
}

export function isGeminiModelUnavailableError(error: unknown) {
  return error instanceof Error && error.name === "GatewayModelNotFoundError";
}
