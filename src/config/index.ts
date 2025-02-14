import { ConfigValidationSchema } from './config.validation';

const config = (config: Record<string, unknown>) => {
  const ENVS = ConfigValidationSchema.parse(config);
  const APP_NAME = 'url-shortener';
  const NODE_ENV = ENVS.NODE_ENV;
  const PORT = ENVS.PORT;
  const BASE_URL = ENVS.BASE_URL;

  return {
    app: {
      appName: APP_NAME,
      env: NODE_ENV,
      port: PORT,
      baseURL: BASE_URL,
    },
    google: {
      clientID: ENVS.GOOGLE_CLIENT_ID,
      clientSecret: ENVS.GOOGLE_CLIENT_SECRET,
      callbackURL: ENVS.GOOGLE_CALLBACK_URL,
    },
    db: {
      mongo: {
        uri: ENVS.MONGO_URI,
        dbName: ENVS.MONGO_DB_NAME,
      },
    },
    jwt: {
      secret: ENVS.JWT_SECRET,
      expiresIn: ENVS.JWT_EXPIRES_IN,
    },
    ipstack: {
      access_key: ENVS.IP_STACK_ACCESS_KEY,
    },
  } as const;
};

export type ConfigVariablesType = ReturnType<typeof config>;

export type GoogleType = ConfigVariablesType['google'];

export type JwtType = ConfigVariablesType['jwt'];

export default config;
