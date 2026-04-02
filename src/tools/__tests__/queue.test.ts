import { describe, it, expect } from 'vitest';
import '../queue.js';
import { getTool } from '../index.js';
import { createMockClient } from '../../__tests__/mocks/client.js';

describe('Queue Tools', () => {
  it('nzbget_list_groups should work', async () => {
    const tool = getTool('nzbget_list_groups');
    const result = await tool!.handler(createMockClient(), {});
    expect(result.isError).toBe(false);
  });

  it('nzbget_append should work', async () => {
    const tool = getTool('nzbget_append');
    const result = await tool!.handler(createMockClient(), { filename: 'test.nzb', content: 'abc' });
    expect(result.isError).toBe(false);
  });

  it('nzbget_edit_queue should work', async () => {
    const tool = getTool('nzbget_edit_queue');
    const result = await tool!.handler(createMockClient(), { command: 'GroupPause', ids: [1] });
    expect(result.isError).toBe(false);
  });
});
