import type { User } from '../types';

export class UserService {
  private users: User[] = [
    {
      id: 'c5f58192-8867-47a9-88c6-be5b3d63322d',
      username: 'h3nnessey',
      age: 27,
      hobbies: ['qwe', 'asd'],
    },
  ];

  async getUsers(): Promise<User[]> {
    return this.users;
  }
}
