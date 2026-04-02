import { z } from 'zod';
import { registerTool } from './index.js';
import { createSuccessResponse } from '../utils/errors.js';

registerTool({
  name: 'nzbget_status',
  description: 'Get current NZBGet server status',
  inputSchema: z.object({}),
  handler: async (client) => {
    const status = await client.status();
    return createSuccessResponse(status);
  },
});

registerTool({
  name: 'nzbget_version',
  description: 'Get NZBGet version',
  inputSchema: z.object({}),
  handler: async (client) => {
    const version = await client.version();
    return createSuccessResponse({ version });
  },
});

registerTool({
  name: 'nzbget_server_volumes',
  description: 'Get download statistics per server',
  inputSchema: z.object({}),
  handler: async (client) => {
    const volumes = await client.serverVolumes();
    return createSuccessResponse(volumes);
  },
});
