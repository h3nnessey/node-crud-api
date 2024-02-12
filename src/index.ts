import { createServer, request as httpRequest } from 'node:http';
import cluster, { type Worker } from 'node:cluster';
import { availableParallelism } from 'node:os';
import 'dotenv/config';
import { UserController } from './controllers';

const PORT = Number(process.env.PORT) || 5000;

const isClusterMode = process.env.CLUSTER === 'true';

if (!isClusterMode && cluster.isPrimary) {
  const userController = new UserController();

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

  for (let i = 1; i < cpusCount + 1; i += 1) {
    const worker = cluster.fork({ workerPort: PORT + i });

    workers.push(worker);
  }

  const server = createServer((masterRequest, masterResponse) => {
    workerIndex = (workerIndex + 1) % cpusCount;

    const { method, url: path, headers } = masterRequest;

    const requestOptions = { host: 'localhost', port: PORT + workerIndex, path, method, headers };

    masterRequest.pipe(
      httpRequest(requestOptions, (workerResponse) => {
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
  const userController = new UserController();

  const server = createServer(async (request, response) => {
    await userController.handleRequest(request, response);
  });

  server.listen(port, () => {
    console.log(`Worker is listening on port: ${port}`);
  });
}
