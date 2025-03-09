import { NODE_PORT } from './config.js';

import { listen } from './app.js';

listen(NODE_PORT, () => { });