import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { saveWhiteboardEvent } from '../whiteboard/whiteboard.service';
import { WhiteboardEventType } from '../whiteboard/whiteboard.model';

let io: Server | null = null;

export const initSocket = (server: HttpServer): void => {
  io = new Server(server, {
    cors: {
      origin: '*', // tighten later to your frontend origin
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('Socket connected:', socket.id);

    // JOIN BOARD
    socket.on('join_board', ({ boardId, userId }: { boardId: string; userId: string }) => {
      const room = `board:${boardId}`;
      socket.join(room);
      socket.to(room).emit('user_joined', { userId });
    });

    // DRAW / ERASE / UNDO EVENTS
    socket.on(
      'whiteboard:event',
      async ({
        boardId,
        eventType,
        payload,
      }: {
        boardId: string;
        eventType: WhiteboardEventType;
        payload: unknown;
      }) => {
        try {
          // persist event
          await saveWhiteboardEvent(boardId, eventType, payload);

          // broadcast to others in the same board
          const room = `board:${boardId}`;
          socket.to(room).emit('whiteboard:event', { eventType, payload });
        } catch (err) {
          console.error('Failed to handle whiteboard event', err);
        }
      }
    );

    // cursor move 
    socket.on(
      'cursor_move',
      ({
        boardId,
        userId,
        x,
        y,
      }: {
        boardId: string;
        userId: string;
        x: number;
        y: number;
      }) => {
        const room = `board:${boardId}`;
        socket.to(room).emit('cursor_move', { userId, x, y });
      }
    );

    // disconnect 
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};