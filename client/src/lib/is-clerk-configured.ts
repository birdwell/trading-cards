export type ClerkEnv = {
  CLERK_SECRET_KEY?: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  CLERK_PUBLISHABLE_KEY?: string;
};

function isPresent(value?: string): boolean {
  return Boolean(value?.trim());
}

// Next.js only inlines NEXT_PUBLIC_* when the identifier is written literally.
// Reading from a passed `process.env` object leaves the client bundle empty.
function currentClerkEnv(): ClerkEnv {
  return {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  };
}

export function hasClerkPublishableKey(
  env: ClerkEnv = currentClerkEnv()
): boolean {
  return (
    isPresent(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) ||
    isPresent(env.CLERK_PUBLISHABLE_KEY)
  );
}

export function hasClerkSecretKey(
  env: ClerkEnv = currentClerkEnv()
): boolean {
  return isPresent(env.CLERK_SECRET_KEY);
}

export function isClerkConfigured(
  env: ClerkEnv = currentClerkEnv()
): boolean {
  return hasClerkPublishableKey(env) && hasClerkSecretKey(env);
}
