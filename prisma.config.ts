import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// The Prisma CLI runs as a plain Node script, so — unlike `next dev` — it doesn't
// natively know about Next.js's .env.local convention. Load both explicitly here,
// with .env.local taking precedence, to match Next.js's own behavior.
config({ path: ".env" });
config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
