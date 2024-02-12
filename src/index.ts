import { createServer } from 'node:http';
import cluster from 'node:cluster';
import 'dotenv/config';
import { UserController } from './controllers';

const PORT = process.env.PORT || 5000;

if (cluster.isPrimary) {
  const userController = new UserController();

  const server = createServer(async (request, response) => {
    await userController.handleRequest(request, response);
  });

  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
