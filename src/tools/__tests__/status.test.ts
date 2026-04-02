import { describe, it, expect } from 'vitest';
import '../status.js';
import { getTool } from '../index.js';
import { createMockClient } from '../../__tests__/mocks/client.js';

describe('Status Tools', () => {
  it('nzbget_status should work', async () => {
    const mockClient = createMockClient();
    const tool = getTool('nzbget_status');
    const result = await tool!.handler(mockClient, {});
    expect(result.isError).toBe(false);
  });

  it('nzbget_version should work', async () => {
    const mockClient = createMockClient();
    const tool = getTool('nzbget_version');
    const result = await tool!.handler(mockClient, {});
    expect(result.isError).toBe(false);
  });

  it('nzbget_server_volumes should work', async () => {
    const mockClient = createMockClient();
    const tool = getTool('nzbget_server_volumes');
    const result = await tool!.handler(mockClient, {});
    expect(result.isError).toBe(false);
  });
});
