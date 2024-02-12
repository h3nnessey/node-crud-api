import { BasicHttpError } from './BasicHttpError';

export class BadRequestError extends BasicHttpError {
  constructor() {
    super(400, 'Bad Request', '400: Bad Request');
  }
}
