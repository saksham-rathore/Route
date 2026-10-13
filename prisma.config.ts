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
    // NOTE: never commit a real connection string here.
    url:
      process.env.DATABASE_URL ??
      "postgresql://build:build@localhost:5432/build?sslmode=disable",
  },
});