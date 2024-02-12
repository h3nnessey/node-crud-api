import type { ServerResponse } from 'node:http';

export enum HttpMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export interface User {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserToOperation = Omit<User, 'id'>;

export interface UserOperation {
  data: User | User[];
  statusCode: number;
  statusMessage: string;
}

export interface SendResponseWithErrorArguments {
  response: ServerResponse;
  err: unknown;
}

export interface SendResponseWIthResultArguments {
  response: ServerResponse;
  result: UserOperation;
}
