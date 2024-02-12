import http from 'node:http';
import { UserController } from '../controllers';
import { UserService } from '../services';

export const createServer = (port: number) => {
  const userService = new UserService();
  const userController = new UserController(userService);

  const server = http.createServer(async (request, response) => {
    await userController.handleRequest(request, response);
  });

  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

  return server;
};
