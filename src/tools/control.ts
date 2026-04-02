import { z } from 'zod';
import { registerTool } from './index.js';
import { createSuccessResponse } from '../utils/errors.js';

registerTool({
  name: 'nzbget_pause_download',
  description: 'Pause downloads',
  inputSchema: z.object({}),
  handler: async (client) => {
    const success = await client.pauseDownload();
    return createSuccessResponse({ success });
  },
});

registerTool({
  name: 'nzbget_resume_download',
  description: 'Resume downloads',
  inputSchema: z.object({}),
  handler: async (client) => {
    const success = await client.resumeDownload();
    return createSuccessResponse({ success });
  },
});

registerTool({
  name: 'nzbget_pause_post',
  description: 'Pause post-processing',
  inputSchema: z.object({}),
  handler: async (client) => {
    const success = await client.pausePost();
    return createSuccessResponse({ success });
  },
});

registerTool({
  name: 'nzbget_resume_post',
  description: 'Resume post-processing',
  inputSchema: z.object({}),
  handler: async (client) => {
    const success = await client.resumePost();
    return createSuccessResponse({ success });
  },
});

registerTool({
  name: 'nzbget_rate',
  description: 'Set download rate limit',
  inputSchema: z.object({ limit: z.number() }),
  handler: async (client, args) => {
    const success = await client.rate((args as { limit: number }).limit);
    return createSuccessResponse({ success });
  },
});

registerTool({
  name: 'nzbget_scan',
  description: 'Scan for new NZB files',
  inputSchema: z.object({}),
  handler: async (client) => {
    const success = await client.scan();
    return createSuccessResponse({ success });
  },
});
