
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

let envPath;
if (process.env.NODE_ENV === 'test') {
  envPath = resolve(process.cwd(), '../env/test.env');
} else {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  envPath = resolve(__dirname, `../env/${process.env.NODE_ENV}.env`);
}

config({ path: envPath });

export const NODE_ENV = process.env.NODE_ENV;
export const NODE_PORT = process.env.NODE_PORT;