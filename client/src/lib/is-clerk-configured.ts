export type ClerkEnv = {
  CLERK_SECRET_KEY?: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  CLERK_PUBLISHABLE_KEY?: string;
};

function isPresent(value?: string): boolean {
  return Boolean(value?.trim());
}

export function hasClerkPublishableKey(
  env: ClerkEnv = process.env as ClerkEnv
): boolean {
  return (
    isPresent(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) ||
    isPresent(env.CLERK_PUBLISHABLE_KEY)
  );
}

export function hasClerkSecretKey(
  env: ClerkEnv = process.env as ClerkEnv
): boolean {
  return isPresent(env.CLERK_SECRET_KEY);
}

export function isClerkConfigured(
  env: ClerkEnv = process.env as ClerkEnv
): boolean {
  return hasClerkPublishableKey(env) && hasClerkSecretKey(env);
}
