import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
    seed: "tsx src/prisma/seed.ts",
  },
  datasource: {
    // `prisma generate` doesn't need a live DB, but `env("DATABASE_URL")`
    // throws when the var is missing (fresh deploy/CI without env yet),
    // which leaves src/generated/prisma uncreated -> "module not found".
    // Fall back to a dummy URL so generate always succeeds;
    // runtime/migrations still use the real DATABASE_URL.
    url:
      process.env.DATABASE_URL ??
      "postgresql://neondb_owner:npg_OFDEGj6S4dnp@ep-lucky-cake-ax7m4iqn-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});