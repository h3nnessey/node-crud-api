import { BasicHttpError } from './BasicHttpError';

export class InvalidUserJsonError extends BasicHttpError {
  constructor() {
    super(400, 'Bad Request', '400: Invalid User Json');
  }
}
