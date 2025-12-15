import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ToolBar from '../components/canvas/Toolbar';
import Canvas from '../components/canvas/Canvas';
import { useState } from 'react';
import type { Tool } from '../components/canvas/Types';

import {
  connectSocket,
  disconnectSocket,
  joinBoard,
  onWhiteboardEvent,
} from '../services/socket';

const WhiteboardPage = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');

  const userId = 'testuser';

  useEffect(() => {
    if (!boardId) return;

    connectSocket();
    joinBoard(boardId, userId);

    onWhiteboardEvent((eventType, payload) => {
      // forward event to Canvas (we’ll handle this next)
      window.dispatchEvent(
        new CustomEvent('remote-whiteboard-event', {
          detail: { eventType, payload },
        })
      );
    });

    return () => {
      disconnectSocket();
    };
  }, [boardId]);

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <ToolBar
        tool={tool}
        color={color}
        onColorChange={setColor}
        onChange={setTool}
      />
      <div className="flex-grow-1">
        <Canvas tool={tool} color={color} boardId={boardId!} />
      </div>
    </div>
  );
};

export default WhiteboardPage;