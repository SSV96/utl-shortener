import * as z from 'zod';

export const ConfigValidationSchema = z.object({
  NODE_ENV: z.enum(['development', 'local', 'production', 'test']),
  PORT: z.string(),

  BASE_URL: z.string(),

  MONGO_URI: z.string(),
  MONGO_DB_NAME: z.string(),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),

  IP_STACK_ACCESS_KEY: z.string(),
});
