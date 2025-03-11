import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
  path: resolve(__dirname, `./env/${process.env.NODE_ENV}.env`),
});

const settings = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  debug: false,
  migrations: {
    directory: 'src/migrations',
  },
  pool: {
    min: 0,
    max: 50,
    propagateCreateError: false,
  },
};

export default {
  development: settings,
};
