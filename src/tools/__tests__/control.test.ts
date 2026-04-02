import { describe, it, expect } from 'vitest';
import '../control.js';
import { getTool } from '../index.js';
import { createMockClient } from '../../__tests__/mocks/client.js';

describe('Control Tools', () => {
  it('nzbget_pause_download should work', async () => {
    const tool = getTool('nzbget_pause_download');
    const result = await tool!.handler(createMockClient(), {});
    expect(result.isError).toBe(false);
  });

  it('nzbget_resume_download should work', async () => {
    const tool = getTool('nzbget_resume_download');
    const result = await tool!.handler(createMockClient(), {});
    expect(result.isError).toBe(false);
  });

  it('nzbget_pause_post should work', async () => {
    const tool = getTool('nzbget_pause_post');
    const result = await tool!.handler(createMockClient(), {});
    expect(result.isError).toBe(false);
  });

  it('nzbget_resume_post should work', async () => {
    const tool = getTool('nzbget_resume_post');
    const result = await tool!.handler(createMockClient(), {});
    expect(result.isError).toBe(false);
  });

  it('nzbget_rate should work', async () => {
    const tool = getTool('nzbget_rate');
    const result = await tool!.handler(createMockClient(), { limit: 1024 });
    expect(result.isError).toBe(false);
  });

  it('nzbget_scan should work', async () => {
    const tool = getTool('nzbget_scan');
    const result = await tool!.handler(createMockClient(), {});
    expect(result.isError).toBe(false);
  });
});
