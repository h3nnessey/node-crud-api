import { validate as validateUuid, v4 as uuidv4 } from 'uuid';
import type { User, UserOperation, UserToOperation } from '../types';
import { UserNotFoundError, InvalidIdError, InvalidUserJsonError } from '../utils/errors';

export class WorkerUserService {
  private _users: User[] = [];

  async getUsers(): Promise<UserOperation> {
    const operationResult = {
      data: this._users,
      statusCode: 200,
      statusMessage: 'OK',
    };

    return operationResult;
  }

  async getUserById(id: string): Promise<UserOperation> {
    this._validateId(id);

    const user = this._users.find((user) => user.id === id);

    if (!user) {
      throw new UserNotFoundError();
    }

    const operationResult = {
      data: user,
      statusCode: 200,
      statusMessage: 'OK',
    };

    return operationResult;
  }

  async createUser(user: UserToOperation): Promise<UserOperation> {
    this._validateUser(user);

    const createdUser = { ...user, id: uuidv4() };

    this._users.push(createdUser);

    const operationResult = {
      data: createdUser,
      statusCode: 201,
      statusMessage: 'Created',
    };

    process.send?.({ type: 'create', data: createdUser });

    return operationResult;
  }

  async updateUser(id: string, user: UserToOperation): Promise<UserOperation> {
    this._validateId(id);
    this._validateUser(user);

    const userIndex = this._users.findIndex((u) => u.id === id);

    if (userIndex !== -1) {
      const updatedUser = { ...user, id: this._users[userIndex].id };

      const operationResult = {
        data: updatedUser,
        statusCode: 200,
        statusMessage: 'Updated',
      };

      process.send?.({ type: 'update', data: updatedUser });

      return operationResult;
    }

    throw new UserNotFoundError();
  }

  async deleteUser(id: string): Promise<UserOperation> {
    this._validateId(id);

    const user = this._users.find((user) => user.id === id);

    if (!user) {
      throw new UserNotFoundError();
    }

    this._users = this._users.filter((user) => user.id !== id);

    const operationResult = {
      data: `User with ID: ${id} has been deleted`,
      statusCode: 204,
      statusMessage: 'Deleted',
    };

    process.send?.({ type: 'delete', data: id });

    return operationResult;
  }

  update(users: User[]) {
    this._users = users;
  }

  private _validateUser(user: UserToOperation) {
    const isValidKeysCount = Object.keys(user).length === 3;
    const isValidAge = 'age' in user && typeof user.age === 'number';
    const isValidHobbies =
      'hobbies' in user && user.hobbies.every((hobbie) => typeof hobbie === 'string');

    const isValidUser = isValidKeysCount && isValidAge && isValidHobbies;

    if (!isValidUser) {
      throw new InvalidUserJsonError();
    }

    return isValidUser;
  }

  private _validateId(id: string) {
    const isValidId = validateUuid(id);

    if (!isValidId) {
      throw new InvalidIdError();
    }
  }
}
