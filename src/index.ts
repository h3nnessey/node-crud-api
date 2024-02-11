import http from 'node:http';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const PORT = process.env.PORT || 4000;

enum Routes {
  Users = '/api/users',
}

enum HttpMethods {
  Get = 'GET',
}

const users = [{ id: 1, name: 'qqqqqqqqqqqq', hobbies: ['qwe', 'asd'] }];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === HttpMethods.Get && url === Routes.Users) {
    res.writeHead(200, 'OK', {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify(users));
  } else {
    res.writeHead(404, 'Source is not found!', {
      'Content-Type': 'text/plain',
    });

    res.end(`Source is not found! ${uuidv4()}`);
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
