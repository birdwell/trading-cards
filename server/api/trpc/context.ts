import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { verifyToken } from "@clerk/backend";
import logger from "../../shared/logger";

export type Context = {
  userId: string | null;
};

export async function createContext({
  req,
}: CreateHTTPContextOptions): Promise<Context> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return { userId: null };
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    logger.warn("CLERK_SECRET_KEY is not set; treating request as anonymous");
    return { userId: null };
  }

  const token = authHeader.slice("Bearer ".length);
  try {
    const payload = await verifyToken(token, { secretKey });
    return { userId: payload?.sub ?? null };
  } catch (error) {
    logger.warn(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      "Failed to verify Clerk token"
    );
    return { userId: null };
  }
}
