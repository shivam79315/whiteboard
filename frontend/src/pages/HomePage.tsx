import ToolBar from "../components/canvas/Toolbar";
import Canvas from "../components/canvas/Canvas";
import { useState } from "react";
import type { Tool } from "../components/canvas/Types";

const HomePage = () => {
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <ToolBar
        tool={tool}
        color={color}
        onColorChange={setColor}
        onChange={setTool}
      />

      <div className="flex-grow-1">
        <Canvas tool={tool} color={color} />
      </div>
    </div>
  );
};

export default HomePage;