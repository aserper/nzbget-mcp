import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import {
  registerTool,
  getTool,
  getAllTools,
  clearRegistry,
  getToolCount,
} from '../index.js';
import { createSuccessResponse } from '../../utils/errors.js';

describe('Tool Registry', () => {
  beforeEach(() => {
    clearRegistry();
  });

  const mockTool = {
    name: 'test_tool',
    description: 'A test tool',
    inputSchema: z.object({ value: z.number() }),
    handler: async () => createSuccessResponse({ result: 'ok' }),
  };

  it('should register a tool', () => {
    registerTool(mockTool);
    expect(getToolCount()).toBe(1);
  });

  it('should retrieve a registered tool', () => {
    registerTool(mockTool);
    const tool = getTool('test_tool');
    expect(tool).toBeDefined();
    expect(tool?.name).toBe('test_tool');
  });

  it('should return undefined for unregistered tool', () => {
    const tool = getTool('nonexistent');
    expect(tool).toBeUndefined();
  });

  it('should throw when registering duplicate tool', () => {
    registerTool(mockTool);
    expect(() => registerTool(mockTool)).toThrow('already registered');
  });

  it('should get all tools', () => {
    registerTool(mockTool);
    registerTool({
      ...mockTool,
      name: 'test_tool_2',
    });
    const tools = getAllTools();
    expect(tools).toHaveLength(2);
  });

  it('should clear registry', () => {
    registerTool(mockTool);
    clearRegistry();
    expect(getToolCount()).toBe(0);
  });
});
