-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Whiteboards table
CREATE TABLE IF NOT EXISTS whiteboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Whiteboard events table
CREATE TABLE IF NOT EXISTS whiteboard_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whiteboard_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_whiteboard
    FOREIGN KEY (whiteboard_id)
    REFERENCES whiteboards(id)
    ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_whiteboard_events_board
  ON whiteboard_events (whiteboard_id);

CREATE INDEX IF NOT EXISTS idx_whiteboard_events_created_at
  ON whiteboard_events (created_at);
