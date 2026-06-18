import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
  DIRECT_URL: Joi.string().optional(),
  JWT_SECRET: Joi.string().required(),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  COOKIE_SECRET: Joi.string().required(),
  CSRF_SECRET: Joi.string().required(),
  SENTRY_DSN: Joi.string().optional(),
  MERCADOPAGO_ACCESS_TOKEN: Joi.string().optional(),
  RESEND_API_KEY: Joi.string().optional(),
  GEMINI_API_KEY: Joi.string().optional(),
  EVOLUTION_API_URL: Joi.string().optional(),
  EVOLUTION_API_KEY: Joi.string().optional(),
});
