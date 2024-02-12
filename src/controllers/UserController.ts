import type { IncomingMessage, ServerResponse } from 'node:http';
import { UserService } from '../services';

export class UserController {
  userService = new UserService();
  usersRegExp = new RegExp(/^\/api\/users[\/]?$/i);
  usersUuidRegexp = new RegExp(/^\/api\/users(?:\/([^\/]+?))[\/]?$/i);

  async get() {}

  async post() {}

  async put() {}

  async delete() {}

  async _handleRequest(req: IncomingMessage, res: ServerResponse) {
    // const { method, url = '' } = req;

    try {
      // await this[method](type of operation: id or not?, req to stream data consuming)
      // await user service method
      // send success response
    } catch (error: unknown) {
      // ... error from user service or internal
      // send error response
    }
  }

  private _getIdFromStringUrl(url: string): string | null {
    return (
      url
        .split('/')
        .filter((c) => !!c)
        .at(2) || null
    );
  }
}
