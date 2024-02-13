import { createServer } from 'node:http';
import { UserController } from '../controllers';
import { WorkerUserService } from '../services';
import type { User } from '../types';

const PORT = Number(process.env.workerPort);

export const createWorkerServer = () => {
  const workerUserService = new WorkerUserService();
  const userController = new UserController(workerUserService);

  const server = createServer(async (request, response) => {
    await userController.handleRequest(request, response);
  });

  process.on('message', (message) => {
    if (message instanceof Object && 'data' in message) {
      workerUserService.update(message.data as User[]);
    }
  });

  server.listen(PORT, () => {
    console.log(`Worker #${process.pid} is listening on port: ${PORT}`);
  });

  return server;
};
