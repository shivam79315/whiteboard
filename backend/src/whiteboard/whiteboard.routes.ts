import { Router } from 'express';
import {
  createWhiteboardHandler,
  getWhiteboardHandler,
  getWhiteboardEventsHandler,
  getAllWhiteboardsHandler,
} from './whiteboard.controller';

const router = Router();

// Create a new whiteboard
router.get('/', getAllWhiteboardsHandler);
router.post('/', createWhiteboardHandler);

//  Get whiteboard metadata
router.get('/:id', getWhiteboardHandler);


// Get all events for a whiteboard
router.get('/:id/events', getWhiteboardEventsHandler);

export default router;
