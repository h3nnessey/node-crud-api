import { BasicHttpError } from './BasicHttpError';

export class SourceIsNotFoundError extends BasicHttpError {
  constructor() {
    super(404, 'Not Found', '404: Source is not found');
  }
}
