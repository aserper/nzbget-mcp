#!/usr/bin/env node

import { startServer } from './server.js';
import type { NZBGetConfig } from './client.js';

// Import all tools to register them
import './tools/status.js';
import './tools/queue.js';
import './tools/history.js';
import './tools/control.js';
import './tools/logging.js';

const config: NZBGetConfig = {
  host: process.env.NZBGET_HOST || 'localhost',
  port: parseInt(process.env.NZBGET_PORT || '6789', 10),
  username: process.env.NZBGET_USERNAME,
  password: process.env.NZBGET_PASSWORD,
  useHttps: process.env.NZBGET_USE_HTTPS === 'true',
};

startServer(config).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
