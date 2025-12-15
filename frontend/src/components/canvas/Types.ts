export type Tool = "select" | "pen" | "rectangle" | "erase";

export type WhiteboardEventType =
  | 'draw'
  | 'erase'
  | 'undo'
  | 'redo'
  | 'clear';