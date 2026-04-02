import { z } from 'zod';
import { registerTool } from './index.js';
import { createSuccessResponse } from '../utils/errors.js';

registerTool({
  name: 'nzbget_log',
  description: 'Get log entries',
  inputSchema: z.object({ idFrom: z.number().optional(), numberOfEntries: z.number().optional() }),
  handler: async (client, args) => {
    const params = args as { idFrom?: number; numberOfEntries?: number };
    const logs = await client.log(params.idFrom || 0, params.numberOfEntries || 50);
    return createSuccessResponse(logs);
  },
});

registerTool({
  name: 'nzbget_write_log',
  description: 'Write log message',
  inputSchema: z.object({ kind: z.enum(['INFO', 'WARNING', 'ERROR', 'DEBUG']), text: z.string() }),
  handler: async (client, args) => {
    const params = args as { kind: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG'; text: string };
    const success = await client.writeLog(params.kind, params.text);
    return createSuccessResponse({ success });
  },
});
