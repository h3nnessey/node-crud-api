import cluster from 'node:cluster';
import 'dotenv/config';
import { createWorkerServer, createMasterClusterServer, createServer } from './server';

const PORT = Number(process.env.PORT) || 5000;

const isClusterMode = process.env.CLUSTER === 'true';

if (!isClusterMode && cluster.isPrimary) {
  createServer(PORT);
}

if (isClusterMode && cluster.isPrimary) {
  createMasterClusterServer(PORT);
}

if (isClusterMode && cluster.isWorker) {
  createWorkerServer();
}
