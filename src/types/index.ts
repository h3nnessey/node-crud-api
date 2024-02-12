export enum HttpMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'Put',
  Delete = 'Delete',
}

export interface User {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}
