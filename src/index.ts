import http from 'node:http';
import { UserController } from './controllers';
import 'dotenv/config';

const PORT = process.env.PORT || 4000;

const userController = new UserController();

const server = http.createServer(async (req, res) => {
  await userController.handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
