import { createServer } from 'node:http';
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
  const cpusCount = Number(availableParallelism() - 1);
  const workers: Worker[] = [];

  let workerIndex = 0;

  for (let i = 1; i < cpusCount + 1; i += 1) {
    const worker = cluster.fork({ workerPort: PORT + i });

    worker.on('message', (msg) => console.log(msg));

    workers.push(worker);
  }

  const server = createServer((request, response) => {
    const { method, url } = request;

    workerIndex = (workerIndex + 1) % cpusCount;

    response.end(JSON.stringify(workerIndex));
  });

  server.listen(PORT, () => {
    console.log(`Master process is listening on port: ${PORT}`);
  });

  cluster.on('fork', (worker) => {
    console.log(`Worker with pid: ${worker.process.pid} is running`);
  });
}

if (isClusterMode && cluster.isWorker) {
  const port = Number(process.env.workerPort);

  const server = createServer((request, response) => {
    const { method, url } = request;

    process.send?.({
      method,
      url,
    });

    response.end(JSON.stringify(port));
  });

  server.listen(port, () => {
    console.log(`Worker is listening on port: ${port}`);
  });
}
