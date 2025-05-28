import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  TZ: z.string().default('America/Sao_Paulo'),
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
})

export type Env = z.infer<typeof envSchema>

export const Environments = envSchema.safeParse(process.env).data
