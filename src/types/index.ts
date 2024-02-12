import type { ServerResponse } from 'node:http';

export enum HttpMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

// todo: add http codes / messages

export interface User {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type WorkerMessage =
  | { type: 'update'; data: User }
  | { type: 'delete'; data: string }
  | { type: 'create'; data: User };

export type UserToOperation = Omit<User, 'id'>;

export interface UserOperation {
  data: User | User[] | string;
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
