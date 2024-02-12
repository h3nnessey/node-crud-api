import request from 'supertest';
import { describe, expect, test } from '@jest/globals';
import { createServer } from './createServer';

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
