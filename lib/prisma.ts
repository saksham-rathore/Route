import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  // Allow `next build` page-collection to import this module without a DB.
  // Real DATABASE_URL must be set in deploy env; queries will fail loudly there if not.
  // NOTE: never commit a real connection string here — use a dummy build placeholder.
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://build:build@localhost:5432/build?sslmode=disable";
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}