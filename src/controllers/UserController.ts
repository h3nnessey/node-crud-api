import type { IncomingMessage, ServerResponse } from 'node:http';
import type { UserService, WorkerUserService } from '../services';
import { HttpMethods, UserOperation, UserToOperation } from '../types';
import { BadRequestError, SourceIsNotFoundError } from '../utils/errors';
import { sendResponseWithError, sendResponseWithResult } from '../utils/response';
import { readRequestBody } from '../utils/streams';

export class UserController {
  private readonly _usersRegExp = new RegExp(/^\/api\/users[\/]?$/i);
  private readonly _usersUuidRegexp = new RegExp(/^\/api\/users(?:\/([^\/]+?))[\/]?$/i);

  constructor(private readonly _userService: UserService | WorkerUserService) {}

  private async GET(id: string | null): Promise<UserOperation> {
    return id ? this._userService.getUserById(id) : this._userService.getUsers();
  }

  private async POST(id: string | null, request: IncomingMessage): Promise<UserOperation> {
    if (id) throw new BadRequestError();

    const user = (await readRequestBody(request)) as UserToOperation;

    return this._userService.createUser(user);
  }

  private async PUT(id: string | null, request: IncomingMessage): Promise<UserOperation> {
    if (!id) throw new BadRequestError();

    const user = (await readRequestBody(request)) as UserToOperation;

    return this._userService.updateUser(id, user);
  }

  private async DELETE(id: string | null): Promise<UserOperation> {
    if (!id) throw new BadRequestError();

    return this._userService.deleteUser(id);
  }

  public async handleRequest(request: IncomingMessage, response: ServerResponse) {
    const { method, url } = request;

    console.log(`${new Date().toLocaleString()} ${method} ${url}`);

    const isValidRoute = this._isValidRoute(url);
    const isValidMethod = this._isValidMethod(method);

    if (!isValidRoute || !isValidMethod) {
      return sendResponseWithError({ response, err: new SourceIsNotFoundError() });
    }

    try {
      if (isValidMethod) {
        const id = this._getIdFromUrl(url);

        const result = await this[method](id, request);

        return sendResponseWithResult({ response, result });
      }
    } catch (error) {
      return sendResponseWithError({ response, err: error });
    }
  }

  private _isValidRoute(url = ''): boolean {
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

  private _getIdFromUrl(url = ''): string | null {
    return (
      url
        .split('/')
        .filter((char) => !!char)
        .at(2) || null
    );
  }
}
