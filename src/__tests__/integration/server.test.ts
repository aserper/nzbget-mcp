import { describe, it, expect } from 'vitest';
import { NZBGetMCPServer } from '../../server.js';
import { getAllTools } from '../../tools/index.js';

// Import tools to register
import '../../tools/status.js';
import '../../tools/queue.js';
import '../../tools/history.js';
import '../../tools/control.js';
import '../../tools/logging.js';

describe('NZBGetMCPServer', () => {
  it('should create server', () => {
    const server = new NZBGetMCPServer({ host: 'localhost', port: 6789 });
    expect(server).toBeDefined();
  });

  it('should have all 15 tools registered', () => {
    const tools = getAllTools();
    expect(tools).toHaveLength(15);
  });
});
