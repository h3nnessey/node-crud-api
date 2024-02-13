import { BasicHttpError } from './BasicHttpError';

export class UserNotFoundError extends BasicHttpError {
  constructor() {
    super(404, 'Not Found', '404: User with provided ID is not found');
  }
}
