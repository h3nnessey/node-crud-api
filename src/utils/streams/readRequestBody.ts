import type { IncomingMessage } from 'node:http';
import { InvalidUserJsonError } from '../errors/InvalidUserJsonError';
import { InternalServerError } from '../errors';

export const readRequestBody = (request: IncomingMessage): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', () => {
      try {
        const json = JSON.parse(body);

        resolve(json);
      } catch {
        reject(new InvalidUserJsonError());
      }
    });

    request.on('error', () => {
      reject(new InternalServerError());
    });
  });
};
