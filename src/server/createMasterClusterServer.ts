import cluster, { type Worker } from 'node:cluster';
import { createServer, request as httpRequest } from 'node:http';
import { availableParallelism } from 'node:os';
import { User, WorkerMessage } from '../types';

export const createMasterClusterServer = (port: number) => {
  const cpusCount = availableParallelism() - 1;
  const workers: Worker[] = [];
  let workerIndex = 0;
  let users: User[] = [];

  for (let i = 1; i < cpusCount + 1; i += 1) {
    const worker = cluster.fork({ workerPort: port + i });

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
    workerIndex = workerIndex % cpusCount;
    workerIndex++;

    const { method, url: path, headers } = masterRequest;

    const requestOptions = { host: 'localhost', port: port + workerIndex, path, method, headers };

    masterRequest.pipe(
      httpRequest(requestOptions, (workerResponse) => {
        const { statusCode = 200, statusMessage, headers } = workerResponse;

        masterResponse.writeHead(statusCode, statusMessage, headers);

        workerResponse.pipe(masterResponse);
      }),
    );
  });

  server.listen(port, () => {
    console.log(`Master process is listening on port: ${port}`);
  });

  return server;
};
