import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { NZBGetClient } from './client.js';
import { getAllTools, getTool } from './tools/index.js';
import { handleToolError } from './utils/errors.js';
import type { NZBGetConfig } from './client.js';

export class NZBGetMCPServer {
  private server: Server;
  private client: NZBGetClient;

  constructor(config: NZBGetConfig) {
    this.client = new NZBGetClient(config);
    this.server = new Server(
      { name: 'nzbget-mcp', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: getAllTools(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const tool = getTool(name);
      if (!tool) {
        return handleToolError(new Error(`Unknown tool: ${name}`)) as unknown as { content: Array<{ type: 'text'; text: string }> };
      }
      try {
        const validatedArgs = tool.inputSchema.parse(args);
        return await tool.handler(this.client, validatedArgs) as unknown as { content: Array<{ type: 'text'; text: string }> };
      } catch (error) {
        return handleToolError(error) as unknown as { content: Array<{ type: 'text'; text: string }> };
      }
    });
  }

  async connect(transport: StdioServerTransport): Promise<void> {
    await this.server.connect(transport);
    console.error('NZBGet MCP server running on stdio');
  }
}

export async function startServer(config: NZBGetConfig): Promise<void> {
  const server = new NZBGetMCPServer(config);
  await server.connect(new StdioServerTransport());
}
