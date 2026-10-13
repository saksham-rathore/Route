import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // `prisma generate` doesn't need a live DB, but `env("DATABASE_URL")`
    // throws when the var is missing (fresh deploy/CI without env yet),
    // which leaves src/generated/prisma uncreated -> "module not found".
    // Fall back to a dummy URL so generate always succeeds;
    // runtime/migrations still use the real DATABASE_URL.
    url:
      process.env.DATABASE_URL ??
      "postgresql://user:password@localhost:5432/db?schema=public",
  },
});
