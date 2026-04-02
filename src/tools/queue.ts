import { z } from 'zod';
import { registerTool } from './index.js';
import { createSuccessResponse, createErrorResponse } from '../utils/errors.js';
import type { EditQueueCommand } from '../types.js';

registerTool({
  name: 'nzbget_list_groups',
  description: 'List download queue groups',
  inputSchema: z.object({ logEntries: z.number().optional() }),
  handler: async (client, args) => {
    const groups = await client.listGroups((args as { logEntries?: number }).logEntries || 0);
    return createSuccessResponse(groups);
  },
});

registerTool({
  name: 'nzbget_append',
  description: 'Add NZB to queue',
  inputSchema: z.object({
    filename: z.string(),
    content: z.string(),
    category: z.string().optional(),
    priority: z.number().optional(),
    addToTop: z.boolean().optional(),
    addPaused: z.boolean().optional(),
  }),
  handler: async (client, args) => {
    const params = args as { filename: string; content: string; category?: string; priority?: number; addToTop?: boolean; addPaused?: boolean };
    const nzbId = await client.append(
      params.filename,
      params.content,
      params.category || '',
      params.priority || 0,
      params.addToTop || false,
      params.addPaused || false,
      '', 0, 'SCORE'
    );
    if (nzbId <= 0) return createErrorResponse('Failed to add NZB');
    return createSuccessResponse({ success: true, nzbId });
  },
});

registerTool({
  name: 'nzbget_edit_queue',
  description: 'Edit queue items',
  inputSchema: z.object({
    command: z.string(),
    ids: z.array(z.number()),
    param: z.string().optional(),
  }),
  handler: async (client, args) => {
    const params = args as { command: string; ids: number[]; param?: string };
    const success = await client.editQueue(params.command as EditQueueCommand, params.param || '', params.ids);
    return createSuccessResponse({ success });
  },
});
