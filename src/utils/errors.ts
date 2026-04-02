import { ZodError } from 'zod';
import type { ToolResponse } from '../types.js';

export function createErrorResponse(
  message: string,
  isError = true
): ToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: message }, null, 2),
      },
    ],
    isError,
  };
}

export function handleToolError(error: unknown): ToolResponse {
  if (error instanceof ZodError) {
    const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    return createErrorResponse(`Validation error: ${messages.join(', ')}`);
  }

  if (error instanceof Error) {
    return createErrorResponse(error.message);
  }

  return createErrorResponse('Unknown error occurred');
}

export function createSuccessResponse(data: unknown): ToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
    isError: false,
  };
}
