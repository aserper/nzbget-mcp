#!/usr/bin/env node

/**
 * NZBGet MCP Server
 * Model Context Protocol server for controlling NZBGet
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { NZBGetClient, NZBGetConfig } from './client.js';
import type { EditQueueCommand } from './types.js';

// Get configuration from environment
const getNZBGetConfig = (): NZBGetConfig => ({
  host: process.env.NZBGET_HOST || 'localhost',
  port: parseInt(process.env.NZBGET_PORT || '6789', 10),
  username: process.env.NZBGET_USERNAME,
  password: process.env.NZBGET_PASSWORD,
  useHttps: process.env.NZBGET_USE_HTTPS === 'true',
});

// Create NZBGet client
const client = new NZBGetClient(getNZBGetConfig());

// Define available tools
const tools: Tool[] = [
  {
    name: 'nzbget_status',
    description: 'Get current NZBGet server status including download speed, queue size, disk space, and server information',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_list_groups',
    description: 'List all download groups in the queue with detailed information about each download',
    inputSchema: {
      type: 'object',
      properties: {
        logEntries: {
          type: 'integer',
          description: 'Number of log entries to retrieve for the top item (deprecated, use 0)',
          default: 0,
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_history',
    description: 'Get download history with status information for completed downloads',
    inputSchema: {
      type: 'object',
      properties: {
        hidden: {
          type: 'boolean',
          description: 'Include hidden history records',
          default: false,
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_append',
    description: 'Add an NZB file to the download queue',
    inputSchema: {
      type: 'object',
      properties: {
        filename: {
          type: 'string',
          description: 'Name of the NZB file (with .nzb extension)',
        },
        content: {
          type: 'string',
          description: 'Base64-encoded content of the NZB file or URL to fetch from',
        },
        category: {
          type: 'string',
          description: 'Category for the download',
          default: '',
        },
        priority: {
          type: 'integer',
          description: 'Priority: -100 (very low), -50 (low), 0 (normal), 50 (high), 100 (very high), 900 (force)',
          default: 0,
        },
        addToTop: {
          type: 'boolean',
          description: 'Add to top of queue instead of bottom',
          default: false,
        },
        addPaused: {
          type: 'boolean',
          description: 'Add in paused state',
          default: false,
        },
        dupeKey: {
          type: 'string',
          description: 'Duplicate key for duplicate detection',
          default: '',
        },
        dupeScore: {
          type: 'integer',
          description: 'Duplicate score',
          default: 0,
        },
        dupeMode: {
          type: 'string',
          description: 'Duplicate mode: SCORE, ALL, or FORCE',
          default: 'SCORE',
        },
      },
      required: ['filename', 'content'],
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_edit_queue',
    description: 'Edit items in the download queue or history (pause, resume, delete, move, set priority, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'Command to execute',
          enum: [
            'GroupPause', 'GroupResume', 'GroupDelete', 'GroupDupeDelete', 'GroupFinalDelete',
            'GroupMoveTop', 'GroupMoveBottom', 'GroupSetPriority', 'GroupSetCategory',
            'GroupSetName', 'GroupMerge', 'FilePause', 'FileResume', 'FileDelete',
            'HistoryDelete', 'HistoryFinalDelete', 'HistoryReturn', 'HistoryProcess',
            'HistoryRedownload', 'HistoryMarkGood', 'HistoryMarkBad',
          ],
        },
        ids: {
          type: 'array',
          items: { type: 'integer' },
          description: 'Array of NZB IDs or file IDs to operate on',
        },
        param: {
          type: 'string',
          description: 'Additional parameter (e.g., priority value, category name, new name)',
          default: '',
        },
      },
      required: ['command', 'ids'],
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_pause_download',
    description: 'Pause the download queue',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_resume_download',
    description: 'Resume the download queue',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_pause_post',
    description: 'Pause post-processing',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_resume_post',
    description: 'Resume post-processing',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_rate',
    description: 'Set download speed limit',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'integer',
          description: 'Speed limit in KB/s (0 to disable throttling)',
        },
      },
      required: ['limit'],
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_log',
    description: 'Get log entries from NZBGet',
    inputSchema: {
      type: 'object',
      properties: {
        idFrom: {
          type: 'integer',
          description: 'First log ID to retrieve (0 for latest)',
          default: 0,
        },
        numberOfEntries: {
          type: 'integer',
          description: 'Number of entries to retrieve',
          default: 50,
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_version',
    description: 'Get NZBGet version information',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_scan',
    description: 'Scan for new NZB files in the incoming directory',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_server_volumes',
    description: 'Get download statistics per news server',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'nzbget_write_log',
    description: 'Write a message to NZBGet log',
    inputSchema: {
      type: 'object',
      properties: {
        kind: {
          type: 'string',
          description: 'Log level',
          enum: ['INFO', 'WARNING', 'ERROR', 'DEBUG'],
        },
        text: {
          type: 'string',
          description: 'Log message text',
        },
      },
      required: ['kind', 'text'],
      additionalProperties: false,
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: 'nzbget-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Handle tool call requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'nzbget_status': {
        const status = await client.status();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(status, null, 2),
            },
          ],
        };
      }

      case 'nzbget_list_groups': {
        const groups = await client.listGroups((args?.logEntries as number) || 0);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(groups, null, 2),
            },
          ],
        };
      }

      case 'nzbget_history': {
        const history = await client.history((args?.hidden as boolean) || false);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(history, null, 2),
            },
          ],
        };
      }

      case 'nzbget_append': {
        const nzbId = await client.append(
          args?.filename as string,
          args?.content as string,
          (args?.category as string) || '',
          (args?.priority as number) || 0,
          (args?.addToTop as boolean) || false,
          (args?.addPaused as boolean) || false,
          (args?.dupeKey as string) || '',
          (args?.dupeScore as number) || 0,
          (args?.dupeMode as string) || 'SCORE'
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: nzbId > 0, nzbId }, null, 2),
            },
          ],
        };
      }

      case 'nzbget_edit_queue': {
        const success = await client.editQueue(
          args?.command as EditQueueCommand,
          (args?.param as string) || '',
          args?.ids as number[]
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success }, null, 2),
            },
          ],
        };
      }

      case 'nzbget_pause_download': {
        const success = await client.pauseDownload();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success }, null, 2),
            },
          ],
        };
      }

      case 'nzbget_resume_download': {
        const success = await client.resumeDownload();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success }, null, 2),
            },
          ],
        };
      }

      case 'nzbget_pause_post': {
        const success = await client.pausePost();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success }, null, 2),
            },
          ],
        };
      }

      case 'nzbget_resume_post': {
        const success = await client.resumePost();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success }, null, 2),
            },
          ],
        };
      }

      case 'nzbget_rate': {
        const success = await client.rate(args?.limit as number);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success }, null, 2),
            },
          ],
        };
      }

      case 'nzbget_log': {
        const logs = await client.log(
          (args?.idFrom as number) || 0,
          (args?.numberOfEntries as number) || 50
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(logs, null, 2),
            },
          ],
        };
      }

      case 'nzbget_version': {
        const version = await client.version();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ version }, null, 2),
            },
          ],
        };
      }

      case 'nzbget_scan': {
        const success = await client.scan();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success }, null, 2),
            },
          ],
        };
      }

      case 'nzbget_server_volumes': {
        const volumes = await client.serverVolumes();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(volumes, null, 2),
            },
          ],
        };
      }

      case 'nzbget_write_log': {
        const success = await client.writeLog(
          args?.kind as 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG',
          args?.text as string
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('NZBGet MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
