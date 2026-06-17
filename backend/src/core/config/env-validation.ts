import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  COOKIE_SECRET: Joi.string().default('clickmarido-cookie-secret'),
  CSRF_SECRET: Joi.string().required(),
});
