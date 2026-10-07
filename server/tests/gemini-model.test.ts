import { createGateway } from "ai";
import {
  createGeminiModel,
  DEFAULT_GEMINI_MODEL,
  getGeminiModelName,
  isGeminiModelUnavailableError,
} from "../core/gemini-model";

const mockedGatewayModel = jest.fn((modelName: string) => ({ modelName }));

jest.mock("ai", () => ({
  createGateway: jest.fn(() => mockedGatewayModel),
}));

const mockedCreateGateway = createGateway as unknown as jest.Mock;
const originalGeminiModel = process.env.GEMINI_MODEL;
const originalAiKey = process.env.AI_KEY;

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

describe("gemini model configuration", () => {
  afterEach(() => {
    mockedCreateGateway.mockClear();
    mockedGatewayModel.mockClear();
    restoreEnv("GEMINI_MODEL", originalGeminiModel);
    restoreEnv("AI_KEY", originalAiKey);
  });

  it("defaults to Gemini Flash through AI Gateway", () => {
    delete process.env.GEMINI_MODEL;

    expect(getGeminiModelName()).toBe(DEFAULT_GEMINI_MODEL);

    createGeminiModel();

    expect(mockedGatewayModel).toHaveBeenCalledWith("google/gemini-2.5-flash");
  });

  it("prefixes bare Gemini model names with the google provider", () => {
    process.env.GEMINI_MODEL = " gemini-2.5-flash-lite ";

    expect(getGeminiModelName()).toBe("google/gemini-2.5-flash-lite");
  });

  it("passes gateway model ids through unchanged", () => {
    process.env.GEMINI_MODEL = "google/gemini-3-flash";

    createGeminiModel();

    expect(mockedGatewayModel).toHaveBeenCalledWith("google/gemini-3-flash");
  });

  it("authenticates with AI_KEY", () => {
    process.env.AI_KEY = " gateway-key ";

    createGeminiModel();

    expect(mockedCreateGateway).toHaveBeenCalledWith({
      apiKey: "gateway-key",
    });
  });

  it("lets the gateway use its default auth when AI_KEY is unset", () => {
    delete process.env.AI_KEY;

    createGeminiModel();

    expect(mockedCreateGateway).toHaveBeenCalledWith({ apiKey: undefined });
  });

  it("detects gateway model-not-found errors", () => {
    const notFound = new Error("Model not found");
    notFound.name = "GatewayModelNotFoundError";

    expect(isGeminiModelUnavailableError(notFound)).toBe(true);
    expect(isGeminiModelUnavailableError(new Error("network timeout"))).toBe(
      false
    );
    expect(isGeminiModelUnavailableError("Model not found")).toBe(false);
  });
});
