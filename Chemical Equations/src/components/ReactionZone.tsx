import { useDrop } from "react-dnd";
import { useRef } from "react";
import { MoleculeItem, ReactionZoneItem } from "../types";

interface ReactionZoneProps {
  reaction: ReactionZoneItem[];
  onDrop: (item: MoleculeItem, col: number, row: number) => void;
  onRemove: (col: number, row: number) => void;
}

const GRID_CELL_SIZE = 70; // Size of each grid cell
const GRID_COLUMNS = 15; // Number of columns
const GRID_ROWS = 10; // Number of rows

export const ReactionZone = ({
  reaction,
  onDrop,
  onRemove,
}: ReactionZoneProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: "MOLECULE",
    drop: (item: MoleculeItem, monitor) => {
      const dropOffset = monitor.getClientOffset();
      if (!dropOffset || !gridRef.current) return;

      const gridRect = gridRef.current.getBoundingClientRect();

      // Calculate position relative to grid's top-left corner
      const relativeX = dropOffset.x - gridRect.left;
      const relativeY = dropOffset.y - gridRect.top;

      // Calculate grid position (0-based index)
      const col = Math.floor(relativeX / GRID_CELL_SIZE);
      const row = Math.floor(relativeY / GRID_CELL_SIZE);

      // Ensure position is within bounds
      if (col >= 0 && col < GRID_COLUMNS && row >= 0 && row < GRID_ROWS) {
        onDrop(item, col, row);
      }
    },
  }));

  drop(gridRef);

  const handleOnEnter = (e: { currentTarget: any }) => {
    // Access the button DOM node
    const button = e.currentTarget;
    console.log("handleOnEnter button ", button);

    const lastChild = button.lastElementChild as HTMLElement;
    if (lastChild) {
      lastChild.style.visibility = "visible";
    }

    // Read a custom attribute
    //const customAttr = button.getAttribute("data-something");
    //console.log("Hovered button attribute:", customAttr);

    // Read computed or inline styles
    //console.log("Background color:", button.style.backgroundColor);
  };

  const handleOnLeave = (e: { currentTarget: any }) => {
    const button = e.currentTarget;
    //console.log("handleOnLeave:", button);
    const lastChild = button.lastElementChild as HTMLElement;
    if (lastChild) {
      lastChild.style.visibility = "hidden";
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#333" }}>
        Reaction Workspace
      </h3>
      <div
        className="Grid Container"
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${GRID_CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${GRID_CELL_SIZE}px)`,
          gap: "2px",
          marginBottom: "16px",
        }}
      >
        {/* Render all grid cells */}
        {Array.from({ length: GRID_ROWS * GRID_COLUMNS }).map((_, index) => {
          const col = index % GRID_COLUMNS;
          const row = Math.floor(index / GRID_COLUMNS);
          const item = reaction.find((i) => i.col === col && i.row === row);

          return (
            <div
              key={`${row}-${col}`}
              style={{
                width: GRID_CELL_SIZE,
                height: GRID_CELL_SIZE,
                border: "1px solid #000000",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                backgroundColor: item ? "#e6f7ff" : "white",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={handleOnEnter}
              onMouseLeave={handleOnLeave}
            >
              {item && (
                <>
                  <span style={{ fontSize: "1.1em" }}>{item.formula}</span>
                  <button
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "3px",
                      background: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      visibility: "visible",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(col, row);
                    }}
                    aria-label={`Remove ${item.formula}`}
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Equation Preview */}
      <div
        style={{
          padding: "12px",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "4px" }}>
          Current Equation:
        </div>
        <div style={{ fontSize: "1.2em", fontWeight: 500 }}>
          {reaction.length > 0 ? (
            <>
              {reaction.map((item) => item.formula).join(" + ")}
              <span style={{ margin: "0 8px", color: "#999" }}>→</span>?
            </>
          ) : (
            <span style={{ color: "#999" }}>Empty</span>
          )}
        </div>
      </div>
    </div>
  );
};
