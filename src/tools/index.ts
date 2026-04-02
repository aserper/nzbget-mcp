import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { ToolDefinition } from '../types.js';

const toolRegistry = new Map<string, ToolDefinition>();

export function registerTool(definition: ToolDefinition): void {
  if (toolRegistry.has(definition.name)) {
    throw new Error(`Tool "${definition.name}" is already registered`);
  }
  toolRegistry.set(definition.name, definition);
}

export function getTool(name: string): ToolDefinition | undefined {
  return toolRegistry.get(name);
}

export function getAllTools(): Tool[] {
  return Array.from(toolRegistry.values()).map((definition) => ({
    name: definition.name,
    description: definition.description,
    inputSchema: zodToJsonSchema(definition.inputSchema) as Tool['inputSchema'],
  }));
}

export function clearRegistry(): void {
  toolRegistry.clear();
}

export function getToolCount(): number {
  return toolRegistry.size;
}
