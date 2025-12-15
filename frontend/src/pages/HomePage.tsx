import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

interface Whiteboard {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

const HomePage = () => {
  const [boards, setBoards] = useState<Whiteboard[]>([]);
  const [boardName, setBoardName] = useState('');
  const navigate = useNavigate();

  const { username } = useAuth();

  useEffect(() => {
    fetch('http://localhost:4000/api/whiteboards')
      .then((res) => res.json())
      .then(setBoards)
      .catch(console.error);
  }, []);

  const createWhiteboard = async () => {
    if (!boardName.trim() || !username) return;

    const res = await fetch('http://localhost:4000/api/whiteboards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: boardName,
        createdBy: username,
      }),
    });

    const board = await res.json();
    navigate(`/whiteboard/${board.id}`);
  };

  return (
    <div className="container py-5 vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Whiteboard Events</h3>
      </div>

      {/* Create Whiteboard */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Create New Whiteboard</h5>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Enter whiteboard name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
            <button className="btn btn-primary" onClick={createWhiteboard}>
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {boards.length === 0 && (
        <p className="text-muted">No whiteboards available.</p>
      )}

      {/* Whiteboard list */}
      <div className="row">
        {boards.map((board) => (
          <div className="col-md-4 mb-3" key={board.id}>
            <div
              className="card shadow-sm h-100"
              role="button"
              onClick={() => navigate(`/whiteboard/${board.id}`)}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{board.name}</h5>

                <p className="text-muted mb-1">
                  Created by: <strong>{board.createdBy}</strong>
                </p>

                <p className="text-muted small">
                  {new Date(board.createdAt).toLocaleString()}
                </p>

                <div className="mt-auto">
                  <button className="btn btn-outline-primary w-100">
                    Join Whiteboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;