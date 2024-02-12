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

export type SendResponseOptions = {
  response: ServerResponse;
  statusCode: number;
  statusMessage: string;
  content: unknown;
};
