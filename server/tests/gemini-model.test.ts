import { google } from "@ai-sdk/google";
import {
  createGeminiModel,
  DEFAULT_GEMINI_MODEL,
  getGeminiModelName,
  isGeminiModelUnavailableError,
} from "../core/gemini-model";

jest.mock("@ai-sdk/google", () => ({
  google: jest.fn((modelName: string) => ({ modelName })),
}));

const mockedGoogle = google as unknown as jest.Mock;
const originalGeminiModel = process.env.GEMINI_MODEL;

describe("gemini model configuration", () => {
  afterEach(() => {
    mockedGoogle.mockClear();

    if (originalGeminiModel === undefined) {
      delete process.env.GEMINI_MODEL;
    } else {
      process.env.GEMINI_MODEL = originalGeminiModel;
    }
  });

  it("defaults to the supported Gemini Flash model", () => {
    delete process.env.GEMINI_MODEL;

    expect(getGeminiModelName()).toBe(DEFAULT_GEMINI_MODEL);

    createGeminiModel();

    expect(mockedGoogle).toHaveBeenCalledWith("gemini-2.5-flash");
  });

  it("uses a configured model name when provided", () => {
    process.env.GEMINI_MODEL = " gemini-2.5-flash-lite ";

    expect(getGeminiModelName()).toBe("gemini-2.5-flash-lite");

    createGeminiModel();

    expect(mockedGoogle).toHaveBeenCalledWith("gemini-2.5-flash-lite");
  });

  it("detects retired or unsupported Gemini model errors", () => {
    expect(
      isGeminiModelUnavailableError(
        new Error(
          "models/gemini-1.5-flash-latest is not found for API version v1beta"
        )
      )
    ).toBe(true);

    expect(
      isGeminiModelUnavailableError(
        new Error("model is not supported for generateContent")
      )
    ).toBe(true);

    expect(isGeminiModelUnavailableError(new Error("network timeout"))).toBe(
      false
    );
  });
});
