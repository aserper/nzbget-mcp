import { describe, it, expect } from 'vitest';
import '../logging.js';
import { getTool } from '../index.js';
import { createMockClient } from '../../__tests__/mocks/client.js';

describe('Logging Tools', () => {
  it('nzbget_log should work', async () => {
    const tool = getTool('nzbget_log');
    const result = await tool!.handler(createMockClient(), {});
    expect(result.isError).toBe(false);
  });

  it('nzbget_log should work with params', async () => {
    const tool = getTool('nzbget_log');
    const result = await tool!.handler(createMockClient(), { idFrom: 1, numberOfEntries: 100 });
    expect(result.isError).toBe(false);
  });

  it('nzbget_write_log should work', async () => {
    const tool = getTool('nzbget_write_log');
    const result = await tool!.handler(createMockClient(), { kind: 'INFO', text: 'Test message' });
    expect(result.isError).toBe(false);
  });
});
