import { io, Socket } from 'socket.io-client';
import type { WhiteboardEventType } from '../components/canvas/Types';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:4000', {
      transports: ['websocket'],
    });
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinBoard = (boardId: string, userId: string): void => {
    console.log('Joining board:', boardId, 'as user:', userId);
  socket?.emit('join_board', { boardId, userId });
};

export const emitWhiteboardEvent = (
  boardId: string,
  eventType: WhiteboardEventType,
  payload: unknown
): void => {
  socket?.emit('whiteboard:event', { boardId, eventType, payload });
};

export const emitCursorMove = (
  boardId: string,
  userId: string,
  x: number,
  y: number
): void => {
  socket?.emit('cursor_move', { boardId, userId, x, y });
};

export const onWhiteboardEvent = (
  callback: (eventType: WhiteboardEventType, payload: unknown) => void
): void => {
  socket?.on('whiteboard:event', ({ eventType, payload }) => {
    callback(eventType, payload);
  });
};

export const onCursorMove = (
  callback: (userId: string, x: number, y: number) => void
): void => {
  socket?.on('cursor_move', ({ userId, x, y }) => {
    callback(userId, x, y);
  });
};