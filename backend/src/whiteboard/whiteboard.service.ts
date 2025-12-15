import pool from '../db';
import { Whiteboard, WhiteboardEvent, WhiteboardEventType } from './whiteboard.model';

/**
 * Create a new whiteboard
 */
export const createWhiteboard = async (
  name: string,
  createdBy: string
): Promise<Whiteboard> => {
  const query = `
    INSERT INTO whiteboards (name, created_by)
    VALUES ($1, $2)
    RETURNING id, name, created_by, created_at
  `;

  const values = [name, createdBy];
  const result = await pool.query(query, values);

  const row = result.rows[0];

  return {
    id: row.id,
    name: row.name,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
};

/**
 * Get a whiteboard by ID
 */
export const getWhiteboardById = async (id: string): Promise<Whiteboard | null> => {
  const query = `
    SELECT id, name, created_by, created_at
    FROM whiteboards
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);

  if (result.rowCount === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id,
    name: row.name,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
};

/**
 * Save a whiteboard event (draw, erase, undo, etc.)
 */
export const saveWhiteboardEvent = async (
  whiteboardId: string,
  eventType: WhiteboardEventType,
  payload: unknown
): Promise<WhiteboardEvent> => {
  const query = `
    INSERT INTO whiteboard_events (whiteboard_id, event_type, payload)
    VALUES ($1, $2, $3)
    RETURNING id, whiteboard_id, event_type, payload, created_at
  `;

  const values = [whiteboardId, eventType, payload];
  const result = await pool.query(query, values);

  const row = result.rows[0];

  return {
    id: row.id,
    whiteboardId: row.whiteboard_id,
    eventType: row.event_type,
    payload: row.payload,
    createdAt: row.created_at,
  };
};

/**
 * Get all events for a whiteboard (for replay)
 */
export const getWhiteboardEvents = async (
  whiteboardId: string
): Promise<WhiteboardEvent[]> => {
  const query = `
    SELECT id, whiteboard_id, event_type, payload, created_at
    FROM whiteboard_events
    WHERE whiteboard_id = $1
    ORDER BY created_at ASC
  `;

  const result = await pool.query(query, [whiteboardId]);

  return result.rows.map((row) => ({
    id: row.id,
    whiteboardId: row.whiteboard_id,
    eventType: row.event_type,
    payload: row.payload,
    createdAt: row.created_at,
  }));
};


// get all whiteboards
export const getAllWhiteboards = async () => {
  const result = await pool.query(
    'SELECT id, name, created_by, created_at FROM whiteboards ORDER BY created_at DESC'
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    createdBy: row.created_by,
    createdAt: row.created_at,
  }));
};
