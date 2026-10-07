export type ClerkEnv = {
  CLERK_SECRET_KEY?: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  CLERK_PUBLISHABLE_KEY?: string;
};

// Next.js only inlines NEXT_PUBLIC_* into client bundles for literal
// `process.env.X` reads, so passing `process.env` as an object would make
// client components see no keys and mismatch the server render.
function readClerkEnv(): ClerkEnv {
  return {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  };
}

function isPresent(value?: string): boolean {
  return Boolean(value?.trim());
}

export function hasClerkPublishableKey(
  env: ClerkEnv = readClerkEnv()
): boolean {
  return (
    isPresent(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) ||
    isPresent(env.CLERK_PUBLISHABLE_KEY)
  );
}

export function hasClerkSecretKey(
  env: ClerkEnv = readClerkEnv()
): boolean {
  return isPresent(env.CLERK_SECRET_KEY);
}

export function isClerkConfigured(
  env: ClerkEnv = readClerkEnv()
): boolean {
  return hasClerkPublishableKey(env) && hasClerkSecretKey(env);
}
