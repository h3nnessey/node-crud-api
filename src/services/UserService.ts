import { validate as validateUuid, v4 as uuidv4 } from 'uuid';
import type { User, UserOperation, UserToOperation } from '../types';
import { UserNotFoundError, InvalidIdError, InvalidUserJsonError } from '../utils/errors';

export class UserService {
  private _users: User[] = [
    {
      id: 'c5f58192-8867-47a9-88c6-be5b3d63322d',
      username: 'h3nnessey',
      age: 27,
      hobbies: ['qwe', 'asd'],
    },
  ];

  async getUsers(): Promise<UserOperation> {
    return {
      data: this._users,
      statusCode: 200,
      statusMessage: 'OK',
    };
  }

  async getUserById(id: string): Promise<UserOperation> {
    this._validateId(id);

    const user = this._users.find((user) => user.id === id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return {
      data: user,
      statusCode: 200,
      statusMessage: 'OK',
    };
  }

  async createUser(user: UserToOperation): Promise<UserOperation> {
    this._validateUser(user);

    const createdUser = { ...user, id: uuidv4() };

    this._users.push(createdUser);

    return {
      data: createdUser,
      statusCode: 201,
      statusMessage: 'Created',
    };
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
