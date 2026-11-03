import { defineConfig } from 'drizzle-kit'

// drizzle-kit запускается вне Next, поэтому .env.local читаем сами.
process.loadEnvFile?.('.env.local')

export default defineConfig({
  schema: './db/schema/index.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
