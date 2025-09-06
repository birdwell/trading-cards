import { initTRPC } from '@trpc/server';

// Initialize tRPC
const t = initTRPC.create();

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
