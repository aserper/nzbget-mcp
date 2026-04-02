import { describe, it, expect } from 'vitest';
import '../history.js';
import { getTool } from '../index.js';
import { createMockClient } from '../../__tests__/mocks/client.js';

describe('History Tools', () => {
  it('nzbget_history should work', async () => {
    const tool = getTool('nzbget_history');
    const result = await tool!.handler(createMockClient(), {});
    expect(result.isError).toBe(false);
  });

  it('nzbget_history should work with hidden param', async () => {
    const tool = getTool('nzbget_history');
    const result = await tool!.handler(createMockClient(), { hidden: true });
    expect(result.isError).toBe(false);
  });
});
