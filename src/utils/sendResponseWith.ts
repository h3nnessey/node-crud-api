import { SendResponseOptions } from '../types';

export const sendResponseWith = ({
  response,
  statusCode,
  statusMessage,
  content,
}: SendResponseOptions) => {
  response.writeHead(statusCode, statusMessage, {
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(content));
};
