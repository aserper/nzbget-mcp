import { z } from 'zod';
import { registerTool } from './index.js';
import { createSuccessResponse } from '../utils/errors.js';

registerTool({
  name: 'nzbget_history',
  description: 'Get download history',
  inputSchema: z.object({ hidden: z.boolean().optional() }),
  handler: async (client, args) => {
    const history = await client.history((args as { hidden?: boolean }).hidden || false);
    return createSuccessResponse(history);
  },
});
