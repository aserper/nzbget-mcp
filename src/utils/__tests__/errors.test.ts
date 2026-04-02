import { describe, it, expect } from 'vitest';
import { ZodError, z } from 'zod';
import {
  createErrorResponse,
  handleToolError,
  createSuccessResponse,
} from '../errors.js';

describe('createErrorResponse', () => {
  it('should create error response with default isError=true', () => {
    const response = createErrorResponse('Test error');
    expect(response.isError).toBe(true);
    expect(response.content[0].text).toContain('Test error');
  });

  it('should create error response with isError=false', () => {
    const response = createErrorResponse('Not an error', false);
    expect(response.isError).toBe(false);
  });
});

describe('createSuccessResponse', () => {
  it('should create success response with data', () => {
    const data = { status: 'ok', value: 42 };
    const response = createSuccessResponse(data);
    expect(response.isError).toBe(false);
    expect(response.content[0].text).toContain('"status": "ok"');
    expect(response.content[0].text).toContain('"value": 42');
  });
});

describe('handleToolError', () => {
  it('should handle ZodError', () => {
    const schema = z.object({ name: z.string() });
    try {
      schema.parse({ name: 123 });
    } catch (error) {
      const response = handleToolError(error);
      expect(response.isError).toBe(true);
      expect(response.content[0].text).toContain('Validation error');
    }
  });

  it('should handle generic Error', () => {
    const response = handleToolError(new Error('Something went wrong'));
    expect(response.isError).toBe(true);
    expect(response.content[0].text).toContain('Something went wrong');
  });

  it('should handle unknown error', () => {
    const response = handleToolError('random string');
    expect(response.isError).toBe(true);
    expect(response.content[0].text).toContain('Unknown error occurred');
  });
});
