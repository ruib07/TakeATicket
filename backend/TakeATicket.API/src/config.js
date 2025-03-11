
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
  path: resolve(__dirname, `../env/${process.env.NODE_ENV}.env`),
});

export const NODE_ENV = process.env.NODE_ENV;
export const NODE_PORT = process.env.NODE_PORT;