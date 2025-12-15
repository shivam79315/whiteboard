export interface Whiteboard {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
}

export type WhiteboardEventType =
  | 'draw'
  | 'erase'
  | 'undo'
  | 'redo'
  | 'clear';

export interface WhiteboardEvent {
  id: string;
  whiteboardId: string;
  eventType: WhiteboardEventType;
  payload: unknown;
  createdAt: Date;
}