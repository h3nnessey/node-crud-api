import type { IncomingMessage, ServerResponse } from 'node:http';
import { validate as validateUuid } from 'uuid';
import { UserService } from '../services';
import { HttpMethods, User } from '../types';
import { sendResponseWith } from '../utils';

export class UserController {
  private readonly _userService = new UserService();
  private readonly _usersRegExp = new RegExp(/^\/api\/users[\/]?$/i);
  private readonly _usersUuidRegexp = new RegExp(/^\/api\/users(?:\/([^\/]+?))[\/]?$/i);

  private async GET(id: string | null): Promise<User | User[]> {
    return id ? this._userService.getUserById(id) : this._userService.getUsers();
  }

  private async POST() {}

  private async PUT() {}

  private async DELETE() {}

  public async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const { method, url = '' } = req;

    console.log(`${new Date().toLocaleString()} ${method} ${url}`);

    const isValidRoute = this._isValidRoute(url);
    const isValidMethod = this._isValidMethod(method);

    if (!isValidRoute || !isValidMethod) {
      res.writeHead(404, 'Not found', {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({ message: 'Source is not found' }));

      return;
    }

    try {
      if (isValidMethod) {
        const id = this._getIdFromUrl(url);

        if (id) {
          const isValidId = validateUuid(id || '');

          if (!isValidId) {
            throw new Error('400 bad request');
          }
        }

        const result = await this[method](id);

        sendResponseWith({ response: res, statusCode: 200, statusMessage: 'OK', content: result });
      }
    } catch (error) {
      // error.statusCode, error.statusMessage, content: error.message
      res.end(error instanceof Error ? error.message : 'something went wrong');
    }
  }

  private _isValidRoute(url: string): boolean {
    return this._usersRegExp.test(url) || this._usersUuidRegexp.test(url);
  }

  private _isValidMethod(method = ''): method is HttpMethods {
    switch (method) {
      case HttpMethods.Delete:
      case HttpMethods.Get:
      case HttpMethods.Post:
      case HttpMethods.Put: {
        return true;
      }
      default: {
        return false;
      }
    }
  }

  private _getIdFromUrl(url: string): string | null {
    return (
      url
        .split('/')
        .filter((c) => !!c)
        .at(2) || null
    );
  }
}
