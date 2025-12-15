export type Tool = "select" | "pen" | "rectangle" | "erase";

export interface LineShape {
  id: string;
  points: number[];
}

export interface RectShape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}