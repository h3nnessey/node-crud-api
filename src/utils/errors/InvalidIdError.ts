import { BasicHttpError } from './BasicHttpError';

export class InvalidIdError extends BasicHttpError {
  constructor() {
    super(400, 'Bad Request', '400: Invalid ID');
  }
}
