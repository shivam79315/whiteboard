import 'dotenv/config';

import express from 'express';
import http from 'http';
import cors from 'cors';

import { initDB } from './src/db/index';
import whiteboardRoutes from './src/whiteboard/whiteboard.routes';
import { initSocket } from './src/websocket/socket';

const PORT = process.env.PORT || 4000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes 
app.use('/api/whiteboards', whiteboardRoutes);


const server = http.createServer(app);

// websocket
initSocket(server);

// start server
const startServer = async (): Promise<void> => {
  try {
    await initDB();
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();