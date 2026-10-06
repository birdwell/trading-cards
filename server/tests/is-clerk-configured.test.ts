import {
  hasClerkPublishableKey,
  hasClerkSecretKey,
  isClerkConfigured,
} from "../../client/src/lib/is-clerk-configured";

describe("isClerkConfigured", () => {
  test("is false when both keys are missing", () => {
    expect(isClerkConfigured({})).toBe(false);
  });

  test("is false when only the publishable key is set", () => {
    expect(
      isClerkConfigured({
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
      })
    ).toBe(false);
  });

  test("is false when only the secret key is set", () => {
    expect(
      isClerkConfigured({
        CLERK_SECRET_KEY: "sk_test_123",
      })
    ).toBe(false);
  });

  test("is false when keys are blank", () => {
    expect(
      isClerkConfigured({
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "   ",
        CLERK_SECRET_KEY: "   ",
      })
    ).toBe(false);
  });

  test("is true when both keys are set", () => {
    expect(
      isClerkConfigured({
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_123",
        CLERK_SECRET_KEY: "sk_test_123",
      })
    ).toBe(true);
  });

  test("accepts CLERK_PUBLISHABLE_KEY as the publishable key", () => {
    expect(
      hasClerkPublishableKey({ CLERK_PUBLISHABLE_KEY: "pk_live_123" })
    ).toBe(true);
    expect(hasClerkSecretKey({ CLERK_SECRET_KEY: "sk_live_123" })).toBe(true);
    expect(
      isClerkConfigured({
        CLERK_PUBLISHABLE_KEY: "pk_live_123",
        CLERK_SECRET_KEY: "sk_live_123",
      })
    ).toBe(true);
  });
});
