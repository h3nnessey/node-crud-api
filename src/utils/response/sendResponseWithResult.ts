import { SendResponseWIthResultArguments } from '../../types';

export const sendResponseWithResult = ({
  response,
  result: { data, statusCode, statusMessage },
}: SendResponseWIthResultArguments) => {
  response.writeHead(statusCode, statusMessage, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
};
