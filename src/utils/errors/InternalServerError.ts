import { BasicHttpError } from './BasicHttpError';

export class InternalServerError extends BasicHttpError {
  constructor() {
    super(500, 'Internal Server Error', '500: Internal Server Error');
  }
}
