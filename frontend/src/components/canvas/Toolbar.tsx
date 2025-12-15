import type { Tool } from "./Types";

interface Props {
  tool: Tool;
  color: string;
  onChange: (t: Tool) => void;
  onColorChange: (c: string) => void;
}

const tools: { key: Tool; iconClass: string }[] = [
  { key: "pen", iconClass: "bi-pencil" },
  { key: "erase", iconClass: "bi-eraser" },
  { key: "rectangle", iconClass: "bi-square" },
  { key: "select", iconClass: "bi-hand-index" }
];


const ToolBar = ({ tool, color, onChange, onColorChange }: Props) => {
  return (
    <div className="position-fixed top-0 start-50 translate-middle-x mt-3 z-3">
      <div className="d-flex align-items-center gap-2 shadow-sm bg-white rounded-pill p-2">

        <div className="btn-group gap-3">
            {tools.map(({ key, iconClass }) => (
                <button
                key={key}
                type="button"
                className={`btn btn-md rounded-pill p-0 d-flex align-items-center justify-content-center ${
                    tool === key ? "btn-outline-info active" : "btn-outline-info"
                }`}
                style={{ width: 42, height: 42 }}
                onClick={() => onChange(key)}
                >
                <i className={`bi ${iconClass} fs-4`} />
                </button>
            ))}
        </div>

        {(tool === "pen" || tool === "rectangle") && (
          <input
            type="color"
            className="form-control form-control-color"
            value={color}
            onChange={e => onColorChange(e.target.value)}
            title="Choose color"
          />
        )}
      </div>
    </div>
  );
};

export default ToolBar;