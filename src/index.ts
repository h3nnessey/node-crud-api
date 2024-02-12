import http from 'node:http';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';
import 'dotenv/config';
import { HttpMethods } from './types';
import { getIdFromUrl } from './utils/get-id-from-url';

const PORT = process.env.PORT || 4000;

const users = [
  { id: 'c5f58192-8867-47a9-88c6-be5b3d63322d', name: 'qqqqqqqqqqqq', hobbies: ['qwe', 'asd'] },
];

const regexpUuid = new RegExp(/^\/api\/users(?:\/([^\/]+?))[\/]?$/i);
const regexpUsers = new RegExp(/^\/api\/users[\/]?$/i);

const server = http.createServer((req, res) => {
  const { method, url = '' } = req;

  console.log(`${new Date().toLocaleString()} ${method} ${url}`);

  if (method === HttpMethods.Post) {
    if (regexpUsers.test(url)) {
      const body: Buffer[] = [];

      req.on('data', (chunk) => {
        body.push(chunk);
      });

      req.on('end', () => {
        try {
          const userInfo: {
            name: string;
            hobbies: string[];
          } = JSON.parse(Buffer.concat(body).toString());

          const createdUser = { id: uuidv4(), ...userInfo };

          users.push(createdUser);

          res.writeHead(201, 'User created', {
            'Content-Type': 'application/json',
          });

          res.end(JSON.stringify(createdUser));
        } catch {
          res.writeHead(400, 'Bad Request');
          res.end('Wrong data');
        }
      });
    }
  }

  if (method === HttpMethods.Get) {
    if (regexpUuid.test(url)) {
      const id = getIdFromUrl(url);

      if (id) {
        const isValidId = validateUuid(id);

        if (!isValidId) {
          res.writeHead(400, 'Wrong data', { 'Content-Type': 'text/plain' });
          res.end('ID is not uuid');
          return;
        }

        const userCandidate = users.find((user) => user.id === id);

        if (userCandidate) {
          res.writeHead(200, `User with id: ${id}`, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify(userCandidate));
        } else {
          res.writeHead(404, 'Not found', { 'Content-Type': 'text/plain' });
          res.end('User with provided id is not found');
        }
      }
    } else if (regexpUsers.test(url)) {
      res.writeHead(200, 'List of all users', {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify(users));
      console.log(url);
    } else {
      res.writeHead(404, 'not found', { 'Content-Type': 'text/plain' });
      res.end(JSON.stringify('not found'));
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
