import { SendResponseWithErrorArguments } from '../../types';
import { BasicHttpError, InternalServerError } from '../errors';

export const sendResponseWithError = ({ response, err }: SendResponseWithErrorArguments) => {
  const error = err instanceof BasicHttpError ? err : new InternalServerError();

  response.writeHead(error.statusCode, error.statusMessage, {
    'Content-Type': 'application/json',
  });

  response.end(JSON.stringify(error.message));
};
