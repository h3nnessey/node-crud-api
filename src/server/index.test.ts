import request from 'supertest';
import { describe, expect, test } from '@jest/globals';
import { createServer } from './createServer';
import { validate } from 'uuid';
import { User } from '../types';
import { Server } from 'http';

describe('Get all records with a GET api/users request (an empty array is expected)', () => {
  const port = 4000;
  const url = `http://localhost:${port}`;
  const testUser = {
    username: 'fake user',
    age: 29,
    hobbies: [],
  };
  let server: Server;

  beforeEach(() => {
    server = createServer(port);
  });

  afterEach(() => {
    server.close();
  });

  test('Scenario 1', async () => {
    const response = await request(url).get('/api/users/');

    expect(response.body).toStrictEqual([]);
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
  });

  test('A new object is created by a POST api/users request (a response containing newly created record is expected)', async () => {
    const response = await request(url).post('/api/users/').send(testUser);

    expect(response.statusCode).toBe(201);
    expect(response.type).toBe('application/json');
    expect(validate(response.body.id)).toBe(true);
  });

  test('With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)', async () => {
    const responseCreate = await request(url).post('/api/users/').send(testUser);
    const id = responseCreate.body.id;

    expect(responseCreate.statusCode).toBe(201);
    expect(responseCreate.type).toBe('application/json');
    expect(validate(id)).toBe(true);

    const responseGet = await request(url).get(`/${id}`);

    expect(responseGet.statusCode).toBe(200);
    expect(responseGet.type).toBe('application/json');
    expect(responseCreate.body).toStrictEqual(responseGet.body);
  });
});
