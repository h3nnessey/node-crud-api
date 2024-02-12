import { createServer, request as httpRequest } from 'node:http';
import cluster, { type Worker } from 'node:cluster';
import { availableParallelism } from 'node:os';
import 'dotenv/config';
import { UserController } from './controllers';
import { UserService, WorkerUserService } from './services';
import { User } from './types';

const PORT = Number(process.env.PORT) || 5000;

const isClusterMode = process.env.CLUSTER === 'true';

if (!isClusterMode && cluster.isPrimary) {
  const userService = new UserService();
  const userController = new UserController(userService);

  const server = createServer(async (request, response) => {
    await userController.handleRequest(request, response);
  });

  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

if (isClusterMode && cluster.isPrimary) {
  const cpusCount = availableParallelism() - 1;
  const workers: Worker[] = [];
  let workerIndex = 0;
  let users: User[] = [];

  type WorkerMessage =
    | { type: 'update'; data: User }
    | { type: 'delete'; data: string }
    | { type: 'create'; data: User };

  for (let i = 1; i < cpusCount + 1; i += 1) {
    const worker = cluster.fork({ workerPort: PORT + i });

    workers.push(worker);

    worker.on('message', ({ type, data }: WorkerMessage) => {
      if (type === 'create') {
        users.push(data);
      }

      if (type === 'delete') {
        users = users.filter((user) => user.id !== data);
      }

      if (type === 'update') {
        const index = users.findIndex((user) => user.id === data.id);
        if (index !== -1) {
          users[index] = data;
        }
      }

      workers.forEach((worker) => {
        worker.send({ data: users });
      });
    });
  }

  const server = createServer((masterRequest, masterResponse) => {
    workerIndex = (workerIndex + 1) % cpusCount;

    const { method, url: path, headers } = masterRequest;

    const requestOptions = { host: 'localhost', port: PORT + workerIndex, path, method, headers };

    masterRequest.pipe(
      httpRequest(requestOptions, (workerResponse) => {
        masterResponse.writeHead(
          workerResponse.statusCode || 500,
          workerResponse.statusMessage,
          workerResponse.headers,
        );
        workerResponse.pipe(masterResponse);
      }),
    );
  });

  server.listen(PORT, () => {
    console.log(`Master process is listening on port: ${PORT}`);
  });
}

if (isClusterMode && cluster.isWorker) {
  const port = Number(process.env.workerPort);
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

  server.listen(port, () => {
    console.log(`Worker is listening on port: ${port}`);
  });
}
