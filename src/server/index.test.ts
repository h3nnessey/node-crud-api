import request from 'supertest';
import { describe, expect, test } from '@jest/globals';
import { createServer } from './createServer';
import { validate } from 'uuid';
import { User } from '../types';

describe('Get all records with a GET api/users request (an empty array is expected)', () => {
  test('', async () => {
    const port = 4000;
    const url = `http://localhost:${port}`;
    const server = createServer(port);

    const response = await request(url).get('/api/users/');

    expect(response.body).toStrictEqual([]);
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');

    server.close();
  });
});

describe('A new object is created by a POST api/users request (a response containing newly created record is expected)', () => {
  test('', async () => {
    const port = 4000;
    const url = `http://localhost:${port}`;
    const server = createServer(port);
    const testUser = {
      username: 'fake user',
      age: 29,
      hobbies: [],
    };

    const response = await request(url).post('/api/users/').send(testUser);

    expect(response.statusCode).toBe(201);
    expect(response.type).toBe('application/json');
    expect(validate(response.body.id)).toBe(true);

    server.close();
  });
});
