import { Request, Response } from 'express';
import {
  createWhiteboard,
  getWhiteboardById,
  getWhiteboardEvents,
  getAllWhiteboards
} from './whiteboard.service';

/**
 * POST /api/whiteboards
 * Create a new whiteboard
 */
export const createWhiteboardHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, createdBy } = req.body;
    console.log('Creating whiteboard with name:', name);
    if (!name) {
      res.status(400).json({ message: 'Whiteboard name is required' });
      return;
    }

    const whiteboard = await createWhiteboard(name, createdBy);
    res.status(201).json(whiteboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create whiteboard' });
  }
};

/**
 * GET /api/whiteboards/:id
 * Get whiteboard details
 */
export const getWhiteboardHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const whiteboard = await getWhiteboardById(id);

    if (!whiteboard) {
      res.status(404).json({ message: 'Whiteboard not found' });
      return;
    }

    res.status(200).json(whiteboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch whiteboard' });
  }
};

/**
 * GET /api/whiteboards/:id/events
 * Get all events for a whiteboard (for replay)
 */
export const getWhiteboardEventsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const events = await getWhiteboardEvents(id);
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch whiteboard events' });
  }
};

// Export other handlers as needed
export const getAllWhiteboardsHandler = async (_req: Request, res: Response) => {
  try {
    const boards = await getAllWhiteboards();
    res.status(200).json(boards);
  } catch {
    res.status(500).json({ message: 'Failed to fetch whiteboards' });
  }
};